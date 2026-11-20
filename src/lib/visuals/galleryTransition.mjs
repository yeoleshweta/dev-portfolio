const mix = (from, to, amount) => from + (to - from) * amount;

export function fitGalleryPhoto(bounds, naturalWidth, naturalHeight) {
  const scale = Math.min(bounds.width / naturalWidth, bounds.height / naturalHeight);
  return {
    cx: bounds.left + bounds.width / 2,
    cy: bounds.top + bounds.height / 2,
    width: naturalWidth * scale,
    height: naturalHeight * scale,
  };
}

// The mask changes aspect ratio while its image remains uniformly scaled.
// Sampling the inverse transform avoids the stretching of a simple FLIP scale.
export function galleryFlightFrames(source, target, position, steps = 40) {
  const cover = Math.max(source.width / target.width, source.height / target.height);
  const mask = [];
  const image = [];
  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps;
    const sx = mix(source.width / target.width, 1, t);
    const sy = mix(source.height / target.height, 1, t);
    const imageScale = mix(cover, 1, t);
    const x = (target.width * sx - target.width * imageScale) * mix(position.x, 0.5, t);
    const y = (target.height * sy - target.height * imageScale) * mix(position.y, 0.5, t);
    mask.push({
      offset: t,
      transform: `translate(${(source.cx - target.cx) * (1 - t)}px, ${(source.cy - target.cy) * (1 - t)}px) rotate(${source.angle * (1 - t)}deg) scale(${sx}, ${sy})`,
    });
    image.push({
      offset: t,
      transform: `translate(${x / sx}px, ${y / sy}px) scale(${imageScale / sx}, ${imageScale / sy})`,
    });
  }
  return { mask, image };
}
