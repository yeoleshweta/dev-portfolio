import * as THREE from "three";

const handCoordinates = [
  [200, 352],
  [145, 278],
  [102, 227],
  [72, 185],
  [54, 147],
  [166, 221],
  [152, 146],
  [144, 91],
  [139, 48],
  [213, 205],
  [211, 119],
  [210, 62],
  [209, 25],
  [257, 216],
  [267, 139],
  [275, 84],
  [280, 48],
  [296, 242],
  [320, 186],
  [338, 146],
  [349, 117],
];
export const hand = handCoordinates.map(
  ([x, y]) => new THREE.Vector3((x - 200) / 110, (352 - y) / 140 - 0.9, 0),
);
const handRoute = [
  0, 1, 2, 3, 4, 3, 2, 1, 0, 5, 6, 7, 8, 7, 6, 5, 9, 10, 11, 12, 11, 10, 9, 13,
  14, 15, 16, 15, 14, 13, 17, 18, 19, 20, 19, 18, 17, 0,
];

function roundedFrame() {
  const path = new THREE.CurvePath();
  const corners = [
    [-1.8, -1.16],
    [1.8, -1.16],
    [1.8, 1.16],
    [-1.8, 1.16],
  ];
  const r = 0.13;
  for (let i = 0; i < 4; i++) {
    const prev = new THREE.Vector3(...corners[(i + 3) % 4], 0),
      at = new THREE.Vector3(...corners[i], 0),
      next = new THREE.Vector3(...corners[(i + 1) % 4], 0);
    const incoming = at
      .clone()
      .add(prev.clone().sub(at).normalize().multiplyScalar(r));
    const outgoing = at
      .clone()
      .add(next.clone().sub(at).normalize().multiplyScalar(r));
    const end = next
      .clone()
      .add(at.clone().sub(next).normalize().multiplyScalar(r));
    path.add(new THREE.QuadraticBezierCurve3(incoming, at, outgoing));
    path.add(new THREE.LineCurve3(outgoing, end));
  }
  return path;
}

// All six forms share vertex topology, so one mesh survives the whole story.
export function ribbonGeometry(mode) {
  const segments = 480,
    sides = 10;
  let path;
  if (mode === 1) path = roundedFrame();
  if (mode === 2) {
    path = new THREE.CurvePath();
    for (let i = 1; i < handRoute.length; i++)
      path.add(
        new THREE.LineCurve3(hand[handRoute[i - 1]], hand[handRoute[i]]),
      );
  }
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    if (mode === 0)
      points.push(
        new THREE.Vector3(
          (1.22 + 0.42 * Math.cos(3 * t)) * Math.cos(2 * t),
          (1.22 + 0.42 * Math.cos(3 * t)) * Math.sin(2 * t),
          0.52 * Math.sin(3 * t),
        ),
      );
    else if (mode === 3)
      points.push(
        new THREE.Vector3(
          (i / segments - 0.5) * 3.6,
          Math.sin(t * 5) *
            0.38 *
            Math.pow(Math.sin((i / segments) * Math.PI), 2),
          0,
        ),
      );
    else if (mode === 4) {
      // An open, two-turn lens. The ribbon winds around the explanatory UI.
      const radius = 1.72 - (i / segments) * 0.3;
      points.push(
        new THREE.Vector3(
          Math.cos(t * 2) * radius,
          Math.sin(t * 2) * radius * 0.82,
          Math.sin(t) * 0.14,
        ),
      );
    } else if (mode === 5) {
      const x = i / segments;
      // A rising illustrative forecast, not financial performance data.
      points.push(
        new THREE.Vector3(
          (x - 0.5) * 3.6,
          -0.65 + 1.55 * x + Math.sin(x * Math.PI * 3) * 0.16,
          0,
        ),
      );
    } else points.push(path.getPoint(i / segments));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const frames = curve.computeFrenetFrames(segments, mode < 2);
  const positions = [],
    indices = [];
  for (let i = 0; i <= segments; i++) {
    const center = points[i],
      twist = mode === 0 ? (i / segments) * Math.PI * 2 : 0;
    const normal = frames.normals[i],
      binormal = frames.binormals[i];
    for (let j = 0; j <= sides; j++) {
      const a = (j / sides) * Math.PI * 2;
      const wide =
        Math.cos(a) *
        (mode === 0
          ? 0.245
          : mode === 1 || mode === 4
            ? 0.035
            : mode === 5
              ? 0.028
              : 0.016);
      const thin =
        Math.sin(a) *
        (mode === 0
          ? 0.055
          : mode === 1 || mode === 4
            ? 0.035
            : mode === 5
              ? 0.028
              : 0.016);
      const u = wide * Math.cos(twist) - thin * Math.sin(twist),
        v = wide * Math.sin(twist) + thin * Math.cos(twist);
      positions.push(
        center.x + normal.x * u + binormal.x * v,
        center.y + normal.y * u + binormal.y * v,
        center.z + normal.z * u + binormal.z * v,
      );
      if (i < segments && j < sides) {
        const n = i * (sides + 1) + j;
        indices.push(
          n,
          n + sides + 1,
          n + 1,
          n + 1,
          n + sides + 1,
          n + sides + 2,
        );
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
