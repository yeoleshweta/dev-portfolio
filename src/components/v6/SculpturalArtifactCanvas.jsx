"use client";
import { useEffect, useRef } from "react";

// Indexed by DOM-measured chapterProgress (0.0 .. 9.0):
// [xFracOfHalfWidth, yWorld, scale, morphIdx, colorIdx, opacity]
// Card alignment:
//   0 Arrival (transparent hero LEFT) -> Grain Mass nebula blooms right/center-right (+0.26)
//   1 Research (card RIGHT)           -> sculpture LEFT  (-0.50) | Shape 1: 6 Affinity Clusters
//   2 Frontend (card LEFT)            -> sculpture RIGHT (+0.50) | Shape 2: Modular 3D Grid Cube
//   3 Backend (card RIGHT)            -> sculpture LEFT  (-0.50) | Shape 3: Flowing Torus Pipeline
//   4 AI & ML (card LEFT)             -> sculpture RIGHT (+0.50) | Shape 4: Dual-Hemisphere Neural Brain
//   5 Works (full-width glass stage)  -> Brilliant-Cut Diamond centered softly behind frosted glass (0.28)
//   6 Craft (full-width glass index)  -> Brilliant-Cut Diamond centered softly behind frosted glass (0.24)
//   7 Trajectory (horiz. glass deck)  -> Brilliant-Cut Diamond centered softly behind frosted glass (0.24)
//   8 Offscreen (photo desk)          -> Faded softly so photo desk owns stage (0.14)
//   9 Contact (centered colophon)     -> Glowing behind closing call (0.45)
const CHAPTER_STATES = [
  [ 0.26,  0.02, 1.46, 0.0, 0, 1.00], // 0 Arrival — Swirling Grain Mass Nebula
  [-0.50,  0.06, 0.98, 1.0, 1, 1.00], // 1 UX Research
  [ 0.50,  0.06, 0.96, 2.0, 2, 1.00], // 2 Frontend UI
  [-0.50,  0.06, 0.96, 3.0, 3, 1.00], // 3 Backend APIs
  [ 0.50,  0.06, 0.98, 4.0, 4, 1.00], // 4 AI & ML
  [ 0.00,  0.04, 1.12, 5.0, 5, 0.28], // 5 Shipped Builds Spotlight (frosted glass refracts diamond)
  [ 0.00,  0.04, 1.04, 5.0, 5, 0.24], // 6 Craft & Toolkit Index
  [ 0.00,  0.04, 1.00, 5.0, 5, 0.24], // 7 Horizontal Experience Timeline
  [ 0.00,  0.08, 0.84, 5.0, 5, 0.14], // 8 Off-screen photo desk
  [ 0.00,  0.02, 1.08, 5.0, 5, 0.45], // 9 Colophon
];

const PHASE_PALETTE = [
  [0.93, 0.75, 0.40], // 0: Warm Champagne Gold (Hero transition)
  [0.95, 0.65, 0.24], // 1: Discovery Amber (UX Research)
  [0.42, 0.74, 1.00], // 2: Ice Cobalt (Frontend UI)
  [0.20, 0.90, 0.62], // 3: Terminal Mint (Backend APIs)
  [0.68, 0.42, 1.00], // 4: Neural Violet (AI & ML)
  [0.96, 0.79, 0.44], // 5: Brilliant Champagne Gold (Tested & Shipped)
];

function sampleChapterState(chP) {
  const maxIdx = CHAPTER_STATES.length - 1;
  const c = Math.max(0, Math.min(maxIdx, chP));
  const i0 = Math.min(maxIdx - 1, Math.floor(c));
  const i1 = i0 + 1;
  const raw = c - i0;
  const t = raw * raw * (3 - 2 * raw); // smoothstep
  const a = CHAPTER_STATES[i0];
  const b = CHAPTER_STATES[i1];
  return [
    a[0] + (b[0] - a[0]) * t, // xFrac
    a[1] + (b[1] - a[1]) * t, // yWorld
    a[2] + (b[2] - a[2]) * t, // scale
    a[3] + (b[3] - a[3]) * t, // morphIdx (0..5)
    a[4] + (b[4] - a[4]) * t, // colorIdx (0..5)
    a[5] + (b[5] - a[5]) * t, // opacity
  ];
}

/**
 * SculpturalArtifactCanvas — Opens as a churning, marbled 3-pigment Grain Mass
 * nebula (molten gold, electric violet, glacial blue) with cursor repulsion, then
 * physically vertex-morphs those exact grains through all 5 build phases as you scroll.
 */
export function SculpturalArtifactCanvas({ progressRef }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    let disposed = false;
    let teardown = () => {};

    import("three").then((THREE) => {
      if (disposed || !hostRef.current) return;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0, 6.8);

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      renderer.setClearColor(0x0b0a0f, 1);
      container.appendChild(renderer.domElement);

      const COUNT = isMobile ? 16000 : 38000;

      const s0 = new Float32Array(COUNT * 3); // 0: Marbled Grain Mass Nebula (Hero)
      const s1 = new Float32Array(COUNT * 3); // 1: 6 Affinity Clusters (UX Research)
      const s2 = new Float32Array(COUNT * 3); // 2: Modular 3D Grid Cube (Frontend UI)
      const s3 = new Float32Array(COUNT * 3); // 3: Flowing Data Torus Knot (Backend APIs)
      const s4 = new Float32Array(COUNT * 3); // 4: Dual-Hemisphere Neural Brain (AI & ML)
      const s5 = new Float32Array(COUNT * 3); // 5: Faceted Brilliant-Cut Diamond (Shipped)
      const seeds = new Float32Array(COUNT * 4); // [phase, size, frayFlag, pigmentJitter]

      const clusters = [
        [-1.08,  0.80,  0.32],
        [ 1.04,  0.72, -0.38],
        [-0.90, -0.78, -0.32],
        [ 1.00, -0.74,  0.40],
        [ 0.05,  1.16, -0.14],
        [-0.08, -1.12,  0.20],
      ];

      const cubeEdges = [
        [-1,-1,-1,  1,-1,-1], [ 1,-1,-1,  1, 1,-1], [ 1, 1,-1, -1, 1,-1], [-1, 1,-1, -1,-1,-1],
        [-1,-1, 1,  1,-1, 1], [ 1,-1, 1,  1, 1, 1], [ 1, 1, 1, -1, 1, 1], [-1, 1, 1, -1,-1, 1],
        [-1,-1,-1, -1,-1, 1], [ 1,-1,-1,  1,-1, 1], [ 1, 1,-1,  1, 1, 1], [-1, 1,-1, -1, 1, 1],
      ];

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const i4 = i * 4;
        const u = Math.random();
        const v = Math.random();
        const theta = u * Math.PI * 2;
        const phi = Math.acos(2 * v - 1);
        const sinPhi = Math.sin(phi);
        const dx = sinPhi * Math.cos(theta);
        const dy0 = sinPhi * Math.sin(theta);
        const dz = Math.cos(phi);

        // Shape 0: Grain Mass Organic Volumetric Nebula + Fraying Dust Halo
        const isFray = Math.random() > 0.82;
        const radius = isFray
          ? 1.52 + Math.pow(Math.random(), 1.5) * 1.65
          : 0.22 + Math.pow(Math.random(), 0.48) * 1.44;
        const lobe =
          1.0 +
          0.28 * Math.sin(dx * 2.6 + dy0 * 1.8) * Math.cos(dz * 2.2) +
          0.17 * Math.cos(dy0 * 3.4 - dz * 2.5) +
          0.12 * Math.sin(dx * 4.1 - dy0 * 3.1);
        const r0 = radius * lobe;
        s0[i3] = dx * r0 * 1.16;
        s0[i3 + 1] = dy0 * r0 * 1.26;
        s0[i3 + 2] = dz * r0 * 0.96;

        seeds[i4] = Math.random() * 6.28318;
        seeds[i4 + 1] = isFray
          ? 0.65 + Math.random() * 1.25
          : 0.9 + Math.random() * 1.65;
        seeds[i4 + 2] = isFray ? 1.0 : 0.0;
        seeds[i4 + 3] = Math.random();

        // Shape 1: 6 Scattered Affinity Clusters + Bridges
        if (i < COUNT * 0.85) {
          const c = clusters[i % clusters.length];
          const cr = Math.pow(Math.random(), 0.6) * 0.42;
          s1[i3] = c[0] + cr * dx;
          s1[i3 + 1] = c[1] + cr * dy0;
          s1[i3 + 2] = c[2] + cr * dz;
        } else {
          const cA = clusters[i % clusters.length];
          const cB = clusters[(i + 1 + (i % 2)) % clusters.length];
          const t = Math.random();
          s1[i3] = cA[0] + (cB[0] - cA[0]) * t + (Math.random() - 0.5) * 0.05;
          s1[i3 + 1] = cA[1] + (cB[1] - cA[1]) * t + (Math.random() - 0.5) * 0.05;
          s1[i3 + 2] = cA[2] + (cB[2] - cA[2]) * t + (Math.random() - 0.5) * 0.05;
        }

        // Shape 2: Modular 3D Architectural Grid Cube
        const half = 1.02;
        if (i < COUNT * 0.36) {
          const e = cubeEdges[i % cubeEdges.length];
          const t = Math.random();
          s2[i3] = (e[0] + (e[3] - e[0]) * t) * half + (Math.random() - 0.5) * 0.025;
          s2[i3 + 1] = (e[1] + (e[4] - e[1]) * t) * half + (Math.random() - 0.5) * 0.025;
          s2[i3 + 2] = (e[2] + (e[5] - e[2]) * t) * half + (Math.random() - 0.5) * 0.025;
        } else {
          const face = i % 6;
          const gridStep = (Math.floor(Math.random() * 5) - 2) * 0.5;
          const span = Math.random() * 2 - 1;
          const flip = Math.random() > 0.5;
          const a = flip ? gridStep : span;
          const b = flip ? span : gridStep;
          if (face === 0) { s2[i3] = half; s2[i3+1] = a * half; s2[i3+2] = b * half; }
          else if (face === 1) { s2[i3] = -half; s2[i3+1] = a * half; s2[i3+2] = b * half; }
          else if (face === 2) { s2[i3] = a * half; s2[i3+1] = half; s2[i3+2] = b * half; }
          else if (face === 3) { s2[i3] = a * half; s2[i3+1] = -half; s2[i3+2] = b * half; }
          else if (face === 4) { s2[i3] = a * half; s2[i3+1] = b * half; s2[i3+2] = half; }
          else { s2[i3] = a * half; s2[i3+1] = b * half; s2[i3+2] = -half; }
        }

        // Shape 3: Interlocking Torus Knot Data Pipeline (p=2, q=3)
        const kt = (i / COUNT) * Math.PI * 2 * 3.0 + Math.random() * 0.1;
        const rK = 0.88 + 0.34 * Math.cos(3 * kt);
        const cx = rK * Math.cos(2 * kt);
        const cy = rK * Math.sin(2 * kt);
        const cz = 0.40 * Math.sin(3 * kt);
        const tubeR = 0.16 + Math.random() * 0.11;
        const tubeA = Math.random() * Math.PI * 2;
        s3[i3] = cx + Math.cos(tubeA) * tubeR;
        s3[i3 + 1] = cy + Math.sin(tubeA) * tubeR;
        s3[i3 + 2] = cz + Math.sin(tubeA + kt) * tubeR;

        // Shape 4: Dual-Hemisphere Neural Brain
        const hemi = i % 2 === 0 ? 1 : -1;
        const bTheta = Math.random() * Math.PI * 2;
        const bPhi = Math.acos(2 * Math.random() - 1);
        let bx = Math.sin(bPhi) * Math.cos(bTheta);
        let by = Math.sin(bPhi) * Math.sin(bTheta);
        let bz = Math.cos(bPhi);
        bx = Math.abs(bx) * 0.74 * hemi + hemi * 0.12;
        by *= 0.94;
        bz *= 1.22;
        const fold =
          1.0 +
          0.11 * Math.sin(bx * 10.0 + bz * 8.0) * Math.cos(by * 9.0) +
          0.07 * Math.cos(bz * 13.0 - by * 7.0);
        const br = (0.92 + Math.pow(Math.random(), 2.0) * 0.24) * fold;
        s4[i3] = bx * br * 1.12;
        s4[i3 + 1] = by * br * 1.02;
        s4[i3 + 2] = bz * br * 1.08;

        // Shape 5: Faceted Brilliant-Cut Diamond
        const dAng = Math.random() * Math.PI * 2;
        const facetAng = Math.round(dAng / (Math.PI / 4)) * (Math.PI / 4);
        const blendAng = dAng + (facetAng - dAng) * 0.22;
        const zone = Math.random();
        let dy, dr;
        if (zone < 0.16) {
          dy = 0.68;
          dr = Math.sqrt(Math.random()) * 0.70;
        } else if (zone < 0.45) {
          const f = Math.random();
          dy = 0.68 - f * 0.46;
          dr = 0.70 + f * 0.54;
        } else {
          const f = Math.pow(Math.random(), 0.72);
          dy = 0.22 - f * 1.54;
          dr = 1.24 * (1.0 - f);
        }
        const polyCos = Math.cos((blendAng % (Math.PI / 4)) - Math.PI / 8);
        const polyR = dr / Math.max(0.85, polyCos);
        s5[i3] = Math.cos(blendAng) * polyR;
        s5[i3 + 1] = dy + 0.12;
        s5[i3 + 2] = Math.sin(blendAng) * polyR;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(s0, 3));
      geo.setAttribute("aPos1", new THREE.BufferAttribute(s1, 3));
      geo.setAttribute("aPos2", new THREE.BufferAttribute(s2, 3));
      geo.setAttribute("aPos3", new THREE.BufferAttribute(s3, 3));
      geo.setAttribute("aPos4", new THREE.BufferAttribute(s4, 3));
      geo.setAttribute("aPos5", new THREE.BufferAttribute(s5, 3));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));

      const uniforms = {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uPixelRatio: { value: dpr },
        uColorA: { value: new THREE.Color(0.93, 0.75, 0.40) },
        uColorB: { value: new THREE.Color(0.95, 0.65, 0.24) },
        uColorMix: { value: 0 },
        uOpacity: { value: 1 },
        uPointer: { value: new THREE.Vector3(99, 99, 0) },
        uPointerStrength: { value: 0 },
      };

      const vertexShader = /* glsl */ `
        attribute vec3 aPos1;
        attribute vec3 aPos2;
        attribute vec3 aPos3;
        attribute vec3 aPos4;
        attribute vec3 aPos5;
        attribute vec4 aSeed;

        uniform float uTime;
        uniform float uMorph;
        uniform float uPixelRatio;
        uniform vec3 uPointer;
        uniform float uPointerStrength;

        varying float vShade;
        varying float vSpark;
        varying float vTone;
        varying vec3 vHeroColor;
        varying float vHeroWeight;
        varying float vHeroAlpha;

        // Compact 3D Simplex Noise for Grain Mass marbling & curl churning
        vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod(i, 289.0);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 1.0 / 7.0;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }

        vec3 curlFlow(vec3 p, float t) {
          float n1 = snoise(p * 0.72 + vec3(0.0, t, 0.0));
          float n2 = snoise(p * 0.72 + vec3(4.3, -t * 0.85, 2.1));
          float n3 = snoise(p * 0.72 + vec3(-3.1, 1.7, t * 0.7));
          return vec3(n2 - n3, n3 - n1, n1 - n2);
        }

        void main() {
          float seg = floor(clamp(uMorph, 0.0, 4.9999));
          float frac = clamp(uMorph - seg, 0.0, 1.0);
          float t = frac * frac * (3.0 - 2.0 * frac);

          vec3 pA = position;
          vec3 pB = aPos1;
          if (seg < 0.5) { pA = position; pB = aPos1; }
          else if (seg < 1.5) { pA = aPos1; pB = aPos2; }
          else if (seg < 2.5) { pA = aPos2; pB = aPos3; }
          else if (seg < 3.5) { pA = aPos3; pB = aPos4; }
          else { pA = aPos4; pB = aPos5; }

          vec3 pos = mix(pA, pB, t);

          // Hero Grain Mass weight (1.0 in Arrival hero -> 0.0 as it condenses into UX Research)
          float heroW = 1.0 - smoothstep(0.0, 0.88, uMorph);
          vHeroWeight = heroW;

          // 3D curl-noise churning & tri-pigment marbling in the hero Grain Mass state
          float flowT = uTime * 0.16;
          vec3 flow = vec3(0.0);
          if (heroW > 0.001) {
            flow = curlFlow(position, flowT);
            float churnAmp = mix(0.24, 0.54, aSeed.z);
            pos += flow * churnAmp * heroW;
          }

          // Dramatic vortex swirl during inter-shape transitions
          float swirlAmt = sin(frac * 3.14159265);
          float angle = swirlAmt * (1.2 + aSeed.w * 0.85);
          float ca = cos(angle);
          float sa = sin(angle);
          pos.xz = mat2(ca, -sa, sa, ca) * pos.xz;
          pos += normalize(pos + vec3(0.001)) * swirlAmt * (0.24 + 0.30 * sin(aSeed.x + uTime * 2.0));

          // Gentle organic breathing
          float pulse = sin(uTime * 2.2 + aSeed.x * 2.0 + pos.y * 3.0) * 0.5 + 0.5;
          pos += vec3(
            sin(uTime * 0.9 + aSeed.x) * 0.018,
            cos(uTime * 0.8 + aSeed.x) * 0.018,
            sin(uTime * 0.7 + aSeed.x) * 0.018
          );

          // Smooth cursor repulsion on the hero Grain Mass
          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          if (heroW > 0.01 && uPointerStrength > 0.001) {
            vec3 toGrain = worldPos.xyz - uPointer;
            float dist = length(toGrain.xy);
            float radius = 1.35;
            if (dist < radius) {
              float push = pow(1.0 - dist / radius, 2.0) * 0.85 * uPointerStrength * heroW;
              vec2 dir = dist > 0.0001 ? normalize(toGrain.xy) : vec2(1.0, 0.0);
              worldPos.xy += dir * push;
              worldPos.z += push * 0.4;
            }
          }

          // Tri-pigment mineral marbling for hero (Molten Gold, Electric Violet, Glacial Blue)
          vec3 marbleCoord = position * 0.85 + flow * 0.65 + vec3(flowT * 0.35, -flowT * 0.2, 0.0);
          float mA = snoise(marbleCoord);
          float mB = snoise(marbleCoord * 1.35 + vec3(7.2, -3.4, 5.1));

          vec3 colGold   = vec3(0.93, 0.66, 0.17);
          vec3 colViolet = vec3(0.49, 0.14, 0.94);
          vec3 colBlue   = vec3(0.47, 0.72, 0.89);
          vec3 colDark   = vec3(0.07, 0.05, 0.11);

          float wGold = smoothstep(-0.18, 0.48, mA);
          float wBlue = smoothstep(0.05, 0.62, mB) * (1.0 - wGold * 0.55);
          vec3 baseHero = mix(colViolet, colGold, wGold);
          baseHero = mix(baseHero, colBlue, wBlue);
          baseHero *= 0.86 + 0.28 * aSeed.w;

          vec3 n = normalize(pos + flow * 0.35 * heroW + vec3(0.0001));
          vec3 lightDir = normalize(vec3(-0.58, 0.70, 0.50));
          float ndl = dot(n, lightDir) * 0.5 + 0.5;
          float rim = pow(1.0 - clamp(abs(n.z), 0.0, 1.0), 1.8) * 0.32;
          float heroShade = smoothstep(0.14, 0.92, ndl) + rim;

          vHeroColor = mix(colDark, baseHero, clamp(heroShade * 1.08, 0.10, 1.0));
          vHeroAlpha = mix(0.86, 0.52, aSeed.z) * smoothstep(0.02, 0.28, heroShade + 0.15);

          vShade = clamp(ndl + 0.05, 0.2, 1.0);
          vSpark = pow(pulse, 4.0);
          vTone = aSeed.w;

          vec4 mv = viewMatrix * worldPos;
          gl_Position = projectionMatrix * mv;

          float heroSize = (aSeed.y * 10.2 * uPixelRatio) / max(1.3, -mv.z);
          float sculptSize = (aSeed.y * 7.4 * uPixelRatio) / max(1.5, -mv.z);
          gl_PointSize = clamp(mix(sculptSize + vSpark * 1.3, heroSize, heroW), 1.15, 5.4);
        }
      `;

      const fragmentShader = /* glsl */ `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uColorMix;
        uniform float uOpacity;

        varying float vShade;
        varying float vSpark;
        varying float vTone;
        varying vec3 vHeroColor;
        varying float vHeroWeight;
        varying float vHeroAlpha;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;

          float bead = smoothstep(0.5, 0.12, d);

          // Sculpted phase color
          vec3 base = mix(uColorA, uColorB, uColorMix);
          vec3 ivory = vec3(0.98, 0.96, 0.92);
          vec3 deep = base * 0.24;
          vec3 sculptCol = mix(deep, base, vShade);
          sculptCol = mix(sculptCol, ivory, clamp(vSpark * 0.42 + vTone * 0.14, 0.0, 0.62));
          float sculptAlpha = 0.62 + 0.34 * vShade;

          // Hero Grain Mass micro-bead highlight
          float highlight = smoothstep(0.32, 0.0, length(uv - vec2(-0.12, -0.12))) * 0.24 * vShade;
          vec3 heroCol = vHeroColor + highlight;

          vec3 finalCol = mix(sculptCol, heroCol, vHeroWeight);
          float finalAlpha = mix(sculptAlpha, vHeroAlpha, vHeroWeight);

          gl_FragColor = vec4(finalCol, bead * finalAlpha * uOpacity);
        }
      `;

      const mat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const sculpture = new THREE.Points(geo, mat);
      scene.add(sculpture);

      const BG_COUNT = isMobile ? 550 : 1200;
      const bgPos = new Float32Array(BG_COUNT * 3);
      for (let i = 0; i < BG_COUNT; i++) {
        bgPos[i * 3] = (Math.random() - 0.5) * 16;
        bgPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
        bgPos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 3;
      }
      const bgGeo = new THREE.BufferGeometry();
      bgGeo.setAttribute("position", new THREE.BufferAttribute(bgPos, 3));
      const bgMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.018,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      });
      const bgField = new THREE.Points(bgGeo, bgMat);
      scene.add(bgField);

      let mx = 0;
      let my = 0;
      const targetPointer = new THREE.Vector3(99, 99, 0);
      let pointerActive = 0;

      let curX = 1.0;
      let curY = 0.02;
      let curScale = 1.46;
      let curMorph = 0;
      let curOp = 1;

      const onPointer = (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -((e.clientY / window.innerHeight) * 2 - 1);
        mx = nx;
        my = -ny;
        const vFov = (camera.fov * Math.PI) / 180;
        const planeH = 2 * Math.tan(vFov / 2) * camera.position.z;
        const planeW = planeH * camera.aspect;
        targetPointer.set(nx * (planeW * 0.5), ny * (planeH * 0.5), 0);
        pointerActive = 1;
      };
      const onPointerLeave = () => {
        pointerActive = 0;
      };
      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
      window.addEventListener("resize", onResize);

      const clock = new THREE.Clock();
      let raf = 0;

      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (document.hidden) return;

        const t = reduced ? 0 : clock.getElapsedTime();
        const chP = progressRef?.current ?? 0;

        const [xFrac, kfY, kfScale, targetMorph, colorIdx, targetOp] = sampleChapterState(chP);

        const vFovRad = (camera.fov * Math.PI) / 180;
        const halfH = Math.tan(vFovRad / 2) * camera.position.z;
        const halfW = halfH * camera.aspect;

        const isNarrow = window.innerWidth < 1024;
        const targetX = isNarrow ? 0 : xFrac * halfW;
        const targetScale = isNarrow
          ? kfScale * 0.72
          : Math.min(1.52, kfScale * Math.min(1.08, halfW / 3.35));

        curX += (targetX - curX) * (reduced ? 1 : 0.12);
        curY += (kfY - curY) * (reduced ? 1 : 0.12);
        curScale += (targetScale - curScale) * (reduced ? 1 : 0.12);
        curMorph += (targetMorph - curMorph) * (reduced ? 1 : 0.11);
        curOp += (targetOp - curOp) * 0.1;

        const heroBlend = Math.max(0, 1 - curMorph);
        sculpture.position.set(curX, curY + Math.sin(t * 0.75) * 0.04, 0);
        sculpture.scale.setScalar(curScale);
        sculpture.rotation.y =
          t * (0.065 * heroBlend + 0.24 * (1 - heroBlend)) +
          chP * 0.65 +
          mx * (0.12 * heroBlend + 0.35 * (1 - heroBlend));
        sculpture.rotation.x =
          Math.sin(t * 0.32) * 0.1 + my * (0.08 * heroBlend + 0.28 * (1 - heroBlend));

        uniforms.uTime.value = t;
        uniforms.uMorph.value = curMorph;
        uniforms.uOpacity.value = curOp * (isNarrow ? 0.34 : 0.96);
        uniforms.uPointer.value.lerp(targetPointer, 0.1);
        uniforms.uPointerStrength.value +=
          (pointerActive - uniforms.uPointerStrength.value) * 0.08;

        const seg = Math.min(4, Math.floor(colorIdx));
        const frac = colorIdx - seg;
        const cA = PHASE_PALETTE[seg];
        const cB = PHASE_PALETTE[seg + 1];
        uniforms.uColorA.value.setRGB(cA[0], cA[1], cA[2]);
        uniforms.uColorB.value.setRGB(cB[0], cB[1], cB[2]);
        uniforms.uColorMix.value = frac;

        bgField.rotation.y = t * 0.015;

        renderer.render(scene, camera);
      };

      animate();

      teardown = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("resize", onResize);
        geo.dispose();
        mat.dispose();
        bgGeo.dispose();
        bgMat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      teardown();
    };
  }, [progressRef]);

  return <div ref={hostRef} className="v6SculptureCanvas" aria-hidden="true" />;
}
