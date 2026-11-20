import test from "node:test";
import assert from "node:assert/strict";
import { hand, ribbonGeometry } from "../src/lib/visuals/sculptureGeometry.mjs";
import {
  storyStages,
  storyWeights,
  lastStoryStage,
} from "../src/lib/visuals/storyStages.mjs";

test("every story form can morph on the same indexed mesh without invalid vertices", () => {
  const forms = storyStages.map((_, index) => ribbonGeometry(index));
  try {
    const count = forms[0].attributes.position.count;
    const topology = [...forms[0].index.array];
    for (const form of forms) {
      assert.equal(form.attributes.position.count, count);
      assert.deepEqual([...form.index.array], topology);
      for (const attribute of [
        form.attributes.position,
        form.attributes.normal,
      ]) {
        assert.ok([...attribute.array].every(Number.isFinite));
      }
      form.computeBoundingBox();
      assert.ok(form.boundingBox.max.x - form.boundingBox.min.x > 2);
    }
    assert.equal(hand.length, 21);
    // The UI image is registered to a 3.6 × 2.32 world-unit frame.
    const frame = forms[1].boundingBox;
    assert.ok(Math.abs(frame.max.x - frame.min.x - 3.67) < 0.03);
    assert.ok(Math.abs(frame.max.y - frame.min.y - 2.39) < 0.03);
  } finally {
    forms.forEach((form) => form.dispose());
  }
});

test("all chapter transitions preserve total mesh influence, including the two new projects", () => {
  assert.equal(storyStages[lastStoryStage - 1].id, "bias-checker");
  assert.equal(storyStages[lastStoryStage].id, "pocketsaver");
  for (let stage = 0; stage <= lastStoryStage; stage += 0.125) {
    const weights = storyWeights(stage);
    assert.ok(
      Math.abs(weights.reduce((total, value) => total + value, 0) - 1) < 1e-9,
    );
    assert.ok(weights.every((value) => value >= 0 && value <= 1));
    assert.ok(weights.filter((value) => value > 0).length <= 2);
  }
  assert.equal(storyWeights(lastStoryStage)[lastStoryStage], 1);
});
