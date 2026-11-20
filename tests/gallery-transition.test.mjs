import test from "node:test";
import assert from "node:assert/strict";
import { fitGalleryPhoto, galleryFlightFrames } from "../src/lib/visuals/galleryTransition.mjs";

const scaleOf = (transform) => transform.match(/scale\(([^,]+), ([^)]+)\)/).slice(1).map(Number);

test("the full photo fits inside the available viewport without cropping", () => {
  const fitted = fitGalleryPhoto({ left: 20, top: 80, width: 350, height: 600 }, 900, 1600);
  assert.equal(fitted.cx, 195);
  assert.equal(fitted.cy, 380);
  assert.equal(fitted.height, 600);
  assert.equal(fitted.width, 337.5);
});

test("cropped and rotated prints expand without stretching their image", () => {
  const target = { cx: 640, cy: 350, width: 320, height: 570 };
  for (const source of [
    { cx: 140, cy: 210, width: 280, height: 220, angle: -8 },
    { cx: 970, cy: 560, width: 170, height: 300, angle: 7 },
    { cx: 190, cy: 400, width: 320, height: 372, angle: 0 },
  ]) {
    const { mask, image } = galleryFlightFrames(source, target, { x: .5, y: .64 });
    assert.equal(mask.length, image.length);
    assert.deepEqual(scaleOf(mask[0].transform), [source.width / target.width, source.height / target.height]);
    assert.equal(mask.at(-1).transform, "translate(0px, 0px) rotate(0deg) scale(1, 1)");
    assert.equal(image.at(-1).transform, "translate(0px, 0px) scale(1, 1)");
    mask.forEach((frame, index) => {
      const [mx, my] = scaleOf(frame.transform);
      const [ix, iy] = scaleOf(image[index].transform);
      assert.ok(Math.abs(mx * ix - my * iy) < 1e-10, "physical image scale must remain uniform");
      assert.ok(ix >= 1 - 1e-10 && iy >= 1 - 1e-10, "image must cover the animated crop window");
    });
  }
});
