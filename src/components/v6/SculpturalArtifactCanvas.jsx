"use client";
import { useEffect, useRef } from "react";

// Scroll progress stops for the 6 distinct 3D morphed silhouettes:
// 0: Seed Sphere (Intro)
// 1: 6 Scattered Affinity Clusters (UX Research)
// 2: Modular 3D Architectural Grid Cube (Frontend UI)
// 3: Interlocking Flowing Data Pipeline / Torus Knot (Backend APIs)
// 4: Dual-Hemisphere Firing Neural Brain (Applied AI & ML)
// 5: Faceted Brilliant-Cut Diamond (Testing & Shipped)
const SHAPE_STOPS = [0.0, 0.14, 0.29, 0.44, 0.58, 0.72];

// Screen X position & scale & opacity across 0..1 scroll
// [p, xWorld, yWorld, scale, opacity]
const POS_KEYS = [
  [0.00,  1.65,  0.08, 1.00, 1.00], // 01 Intro (right)
  [0.14, -1.65,  0.08, 1.04, 1.00], // 02 UX Research (left)
  [0.29,  1.65,  0.08, 1.02, 1.00], // 03 Frontend UI (right)
  [0.44, -1.60,  0.08, 1.00, 1.00], // 04 Backend APIs (left)
  [0.58,  1.60,  0.08, 1.04, 1.00], // 05 AI & ML (right)
  [0.72, -1.65,  0.08, 1.06, 1.00], // 06 Testing & Shipped (left)
  [0.85,  1.72,  0.08, 0.86, 0.82], // 07 Trajectory (right)
  [0.93,  0.00,  0.10, 0.86, 0.20], // Off-screen gallery breathing room
  [1.00,  0.00,  0.02, 1.12, 0.62], // 08 Colophon (centered diamond)
];

const PHASE_PALETTE = [
  [0.93, 0.75, 0.40], // 0: Warm Champagne Gold (Intro)
  [0.95, 0.65, 0.24], // 1: Discovery Amber (UX Research)
  [0.42, 0.74, 1.00], // 2: Ice Cobalt (Frontend UI)
  [0.20, 0.90, 0.62], // 3: Terminal Mint (Backend APIs)
  [0.68, 0.42, 1.00], // 4: Neural Violet (AI & ML)
  [0.96, 0.79, 0.44], // 5: Brilliant Champagne Gold (Tested & Shipped)
];

function samplePos(p) {
  const c = Math.max(0, Math.min(1, p));
  for (let i = 0; i < POS_KEYS.length - 1; i++) {
    const a = POS_KEYS[i];
    const b = POS_KEYS[i + 1];
    if (c >= a[0] && c <= b[0]) {
      const raw = (c - a[0]) / Math.max(0.0001, b[0] - a[0]);
      const t = raw * raw * (3 - 2 * raw);
      return [
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
        a[3] + (b[3] - a[3]) * t,
        a[4] + (b[4] - a[4]) * t,
      ];
    }
  }
  return POS_KEYS[POS_KEYS.length - 1].slice(1);
}

// Compute continuous morph index 0..5 from scroll progress 0..1
function scrollToMorph(p) {
  if (p <= SHAPE_STOPS[0]) return 0;
  if (p >= SHAPE_STOPS[SHAPE_STOPS.length - 1]) return SHAPE_STOPS.length - 1;
  for (let i = 0; i < SHAPE_STOPS.length - 1; i++) {
    if (p >= SHAPE_STOPS[i] && p <= SHAPE_STOPS[i + 1]) {
      const raw = (p - SHAPE_STOPS[i]) / (SHAPE_STOPS[i + 1] - SHAPE_STOPS[i]);
      // Hold slightly on each shape then glide crisply to the next
      const eased = raw * raw * (3 - 2 * raw);
      return i + eased;
    }
  }
  return 5;
}

/**
 * SculpturalArtifactCanvas — True GPU Vertex-Morphing 3D Particle Sculpture.
 * 24,000 shaded micro-grains physically swarm and re-sculpt into 6 completely
 * distinct 3D silhouettes as the user scrolls through every phase of Shweta's lifecycle.
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
      camera.position.set(0, 0, 6.4);

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      renderer.setClearColor(0x0b0c10, 1);
      container.appendChild(renderer.domElement);

      const COUNT = isMobile ? 12000 : 24000;

      // Allocate 6 distinct 3D shape buffers
      const s0 = new Float32Array(COUNT * 3); // 0: Seed Sphere
      const s1 = new Float32Array(COUNT * 3); // 1: 6 Affinity Clusters (UX Research)
      const s2 = new Float32Array(COUNT * 3); // 2: Modular 3D Grid Cube (Frontend UI)
      const s3 = new Float32Array(COUNT * 3); // 3: Flowing Data Torus Knot (Backend APIs)
      const s4 = new Float32Array(COUNT * 3); // 4: Dual-Hemisphere Neural Brain (AI & ML)
      const s5 = new Float32Array(COUNT * 3); // 5: Faceted Brilliant-Cut Diamond (Shipped)
      const seeds = new Float32Array(COUNT * 3); // [phase, size, tone]

      // 6 cluster centers for UX Research (distributed in 3D space)
      const clusters = [
        [-1.15,  0.85,  0.35],
        [ 1.10,  0.75, -0.40],
        [-0.95, -0.82, -0.35],
        [ 1.05, -0.78,  0.42],
        [ 0.05,  1.22, -0.15],
        [-0.08, -1.18,  0.22],
      ];

      // 12 edges of a 3D architectural cube for crisp wireframe emphasis
      const cubeEdges = [
        [-1,-1,-1,  1,-1,-1], [ 1,-1,-1,  1, 1,-1], [ 1, 1,-1, -1, 1,-1], [-1, 1,-1, -1,-1,-1],
        [-1,-1, 1,  1,-1, 1], [ 1,-1, 1,  1, 1, 1], [ 1, 1, 1, -1, 1, 1], [-1, 1, 1, -1,-1, 1],
        [-1,-1,-1, -1,-1, 1], [ 1,-1,-1,  1,-1, 1], [ 1, 1,-1,  1, 1, 1], [-1, 1,-1, -1, 1, 1],
      ];

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const u = Math.random();
        const v = Math.random();
        const theta = u * Math.PI * 2;
        const phi = Math.acos(2 * v - 1);

        seeds[i3] = Math.random() * 6.28318;
        seeds[i3 + 1] = 0.75 + Math.random() * 1.45;
        seeds[i3 + 2] = Math.random();

        // -------------------------------------------------------------
        // SHAPE 0: LATENT SEED SPHERE + EQUATORIAL HALO
        // -------------------------------------------------------------
        if (i < COUNT * 0.82) {
          const r = 1.12 + (Math.random() - 0.5) * 0.14;
          s0[i3] = r * Math.sin(phi) * Math.cos(theta);
          s0[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          s0[i3 + 2] = r * Math.cos(phi);
        } else {
          const ang = Math.random() * Math.PI * 2;
          const rr = 1.62 + (Math.random() - 0.5) * 0.08;
          s0[i3] = Math.cos(ang) * rr;
          s0[i3 + 1] = (Math.random() - 0.5) * 0.06;
          s0[i3 + 2] = Math.sin(ang) * rr;
        }

        // -------------------------------------------------------------
        // SHAPE 1: UX RESEARCH — 6 SCATTERED AFFINITY CLUSTERS + BRIDGES
        // -------------------------------------------------------------
        if (i < COUNT * 0.85) {
          const c = clusters[i % clusters.length];
          const cr = Math.pow(Math.random(), 0.6) * 0.44;
          s1[i3] = c[0] + cr * Math.sin(phi) * Math.cos(theta);
          s1[i3 + 1] = c[1] + cr * Math.sin(phi) * Math.sin(theta);
          s1[i3 + 2] = c[2] + cr * Math.cos(phi);
        } else {
          // Fine affinity thread bridges connecting pairs of clusters
          const cA = clusters[i % clusters.length];
          const cB = clusters[(i + 1 + (i % 2)) % clusters.length];
          const t = Math.random();
          s1[i3] = cA[0] + (cB[0] - cA[0]) * t + (Math.random() - 0.5) * 0.05;
          s1[i3 + 1] = cA[1] + (cB[1] - cA[1]) * t + (Math.random() - 0.5) * 0.05;
          s1[i3 + 2] = cA[2] + (cB[2] - cA[2]) * t + (Math.random() - 0.5) * 0.05;
        }

        // -------------------------------------------------------------
        // SHAPE 2: FRONTEND UI — CRISP MODULAR 3D ARCHITECTURAL GRID CUBE
        // -------------------------------------------------------------
        const half = 1.08;
        if (i < COUNT * 0.36) {
          // Razor-sharp outer cube edges
          const e = cubeEdges[i % cubeEdges.length];
          const t = Math.random();
          s2[i3] = (e[0] + (e[3] - e[0]) * t) * half + (Math.random() - 0.5) * 0.025;
          s2[i3 + 1] = (e[1] + (e[4] - e[1]) * t) * half + (Math.random() - 0.5) * 0.025;
          s2[i3 + 2] = (e[2] + (e[5] - e[2]) * t) * half + (Math.random() - 0.5) * 0.025;
        } else {
          // Structured 3x3 modular grid lines on all 6 faces of the cube
          const face = i % 6;
          const gridStep = (Math.floor(Math.random() * 5) - 2) * 0.5; // -1, -0.5, 0, 0.5, 1
          const span = (Math.random() * 2 - 1);
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

        // -------------------------------------------------------------
        // SHAPE 3: BACKEND APIS — INTERLOCKING TORUS KNOT DATA PIPELINE (p=2, q=3)
        // -------------------------------------------------------------
        const kt = (i / COUNT) * Math.PI * 2 * 3.0 + Math.random() * 0.1;
        const pK = 2;
        const qK = 3;
        const rK = 0.92 + 0.36 * Math.cos(qK * kt);
        const cx = rK * Math.cos(pK * kt);
        const cy = rK * Math.sin(pK * kt);
        const cz = 0.42 * Math.sin(qK * kt);
        const tubeR = 0.18 + Math.random() * 0.12;
        const tubeA = Math.random() * Math.PI * 2;
        s3[i3] = cx + Math.cos(tubeA) * tubeR;
        s3[i3 + 1] = cy + Math.sin(tubeA) * tubeR;
        s3[i3 + 2] = cz + Math.sin(tubeA + kt) * tubeR;

        // -------------------------------------------------------------
        // SHAPE 4: AI & ML — DUAL-HEMISPHERE NEURAL BRAIN WITH FOLDED GYRI
        // -------------------------------------------------------------
        const hemi = i % 2 === 0 ? 1 : -1;
        // Slightly elongated brain lobe ellipsoid with sinusoidal cortical folds
        const bTheta = Math.random() * Math.PI * 2;
        const bPhi = Math.acos(2 * Math.random() - 1);
        let bx = Math.sin(bPhi) * Math.cos(bTheta);
        let by = Math.sin(bPhi) * Math.sin(bTheta);
        let bz = Math.cos(bPhi);
        // Flatten inner medial fissure between left & right hemispheres
        bx = Math.abs(bx) * 0.74 * hemi + hemi * 0.12;
        by *= 0.95;
        bz *= 1.24;
        // Organic cortical folds (gyri ridges)
        const fold =
          1.0 +
          0.11 * Math.sin(bx * 10.0 + bz * 8.0) * Math.cos(by * 9.0) +
          0.07 * Math.cos(bz * 13.0 - by * 7.0);
        const br = (0.95 + Math.pow(Math.random(), 2.0) * 0.25) * fold;
        s4[i3] = bx * br * 1.15;
        s4[i3 + 1] = by * br * 1.05;
        s4[i3 + 2] = bz * br * 1.1;

        // -------------------------------------------------------------
        // SHAPE 5: TESTED & SHIPPED — FACETED BRILLIANT-CUT DIAMOND GEM
        // -------------------------------------------------------------
        // Octahedral / brilliant-cut diamond (flat crown table, crisp girdle, pointed pavilion)
        const dAng = Math.random() * Math.PI * 2;
        // Quantize slightly to 8-fold facet symmetry for razor-sharp diamond facets
        const facetAng = Math.round(dAng / (Math.PI / 4)) * (Math.PI / 4);
        const blendAng = dAng + (facetAng - dAng) * 0.22;
        const zone = Math.random();
        let dy, dr;
        if (zone < 0.16) {
          // Flat crown table on top
          dy = 0.72;
          dr = Math.sqrt(Math.random()) * 0.74;
        } else if (zone < 0.45) {
          // Upper crown bevel (table -> girdle)
          const f = Math.random();
          dy = 0.72 - f * 0.48;
          dr = 0.74 + f * 0.56;
        } else {
          // Lower pavilion cone (girdle -> culet point)
          const f = Math.pow(Math.random(), 0.72);
          dy = 0.24 - f * 1.62;
          dr = 1.30 * (1.0 - f);
        }
        // Crisp 8-sided polygonal cross-section
        const polyCos = Math.cos(((blendAng % (Math.PI / 4)) - Math.PI / 8));
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
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));

      const uniforms = {
        uTime: { value: 0 },
        uMorph: { value: 0 }, // continuous 0..5
        uPixelRatio: { value: dpr },
        uColorA: { value: new THREE.Color(0.93, 0.75, 0.40) },
        uColorB: { value: new THREE.Color(0.95, 0.65, 0.24) },
        uColorMix: { value: 0 },
        uOpacity: { value: 1 },
      };

      const vertexShader = /* glsl */ `
        attribute vec3 aPos1;
        attribute vec3 aPos2;
        attribute vec3 aPos3;
        attribute vec3 aPos4;
        attribute vec3 aPos5;
        attribute vec3 aSeed;

        uniform float uTime;
        uniform float uMorph;
        uniform float uPixelRatio;

        varying float vShade;
        varying float vSpark;
        varying float vTone;

        void main() {
          // Select the two adjacent 3D shapes based on continuous uMorph (0..5)
          float seg = floor(clamp(uMorph, 0.0, 4.9999));
          float frac = clamp(uMorph - seg, 0.0, 1.0);
          float t = frac * frac * (3.0 - 2.0 * frac);

          vec3 pA = position;
          vec3 pB = aPos1;
          if (seg < 0.5) {
            pA = position; pB = aPos1;
          } else if (seg < 1.5) {
            pA = aPos1; pB = aPos2;
          } else if (seg < 2.5) {
            pA = aPos2; pB = aPos3;
          } else if (seg < 3.5) {
            pA = aPos3; pB = aPos4;
          } else {
            pA = aPos4; pB = aPos5;
          }

          vec3 pos = mix(pA, pB, t);

          // Dramatic 3D vortex swirl mid-transition so every morph feels alive!
          float swirlAmt = sin(frac * 3.14159265);
          float angle = swirlAmt * (1.25 + aSeed.z * 0.9);
          float ca = cos(angle);
          float sa = sin(angle);
          pos.xz = mat2(ca, -sa, sa, ca) * pos.xz;
          pos += normalize(pos + vec3(0.001)) * swirlAmt * (0.28 + 0.35 * sin(aSeed.x + uTime * 2.0));

          // Subtle living micro-breathing & data/synapse pulse
          float pulse = sin(uTime * 2.4 + aSeed.x * 2.0 + pos.y * 3.0) * 0.5 + 0.5;
          pos += vec3(
            sin(uTime * 0.9 + aSeed.x) * 0.02,
            cos(uTime * 0.8 + aSeed.x) * 0.02,
            sin(uTime * 0.7 + aSeed.x) * 0.02
          );

          // Upper-left studio directional shading for real 3D sculptural depth
          vec3 n = normalize(pos + vec3(0.0001));
          vec3 lightDir = normalize(vec3(-0.55, 0.72, 0.52));
          vShade = clamp(dot(n, lightDir) * 0.5 + 0.55, 0.18, 1.0);
          vSpark = pow(pulse, 4.0);
          vTone = aSeed.z;

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;

          float ptSize = (aSeed.y * 7.8 * uPixelRatio) / max(1.5, -mv.z);
          gl_PointSize = clamp(ptSize + vSpark * 1.4, 1.15, 5.2);
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

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;

          float bead = smoothstep(0.5, 0.1, d);
          vec3 base = mix(uColorA, uColorB, uColorMix);
          vec3 ivory = vec3(0.98, 0.96, 0.92);
          vec3 deep = base * 0.24;

          vec3 col = mix(deep, base, vShade);
          col = mix(col, ivory, clamp(vSpark * 0.45 + vTone * 0.16, 0.0, 0.65));

          gl_FragColor = vec4(col, bead * (0.62 + 0.34 * vShade) * uOpacity);
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

      // Subtle background micro-starfield for depth
      const BG_COUNT = isMobile ? 600 : 1400;
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
        size: 0.02,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      });
      const bgField = new THREE.Points(bgGeo, bgMat);
      scene.add(bgField);

      let mx = 0;
      let my = 0;
      let curX = 1.65;
      let curY = 0.08;
      let curScale = 1;
      let curMorph = 0;

      const onPointer = (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
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
      window.addEventListener("resize", onResize);

      const clock = new THREE.Clock();
      let raf = 0;

      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (document.hidden) return;

        const t = reduced ? 0 : clock.getElapsedTime();
        const p = progressRef?.current ?? 0;

        const targetMorph = scrollToMorph(p);
        curMorph += (targetMorph - curMorph) * (reduced ? 1 : 0.09);

        const [kfX, kfY, kfScale, kfOp] = samplePos(p);
        const isNarrow = window.innerWidth < 1024;
        curX += ((isNarrow ? 0 : kfX) - curX) * 0.09;
        curY += (kfY - curY) * 0.09;
        curScale += ((isNarrow ? kfScale * 0.78 : kfScale) - curScale) * 0.09;

        sculpture.position.set(curX, curY + Math.sin(t * 0.85) * 0.05, 0);
        sculpture.scale.setScalar(curScale);
        sculpture.rotation.y = t * 0.24 + p * Math.PI * 1.8 + mx * 0.35;
        sculpture.rotation.x = Math.sin(t * 0.35) * 0.12 + my * 0.28;

        uniforms.uTime.value = t;
        uniforms.uMorph.value = curMorph;
        uniforms.uOpacity.value = kfOp * (isNarrow ? 0.42 : 0.96);

        const seg = Math.min(4, Math.floor(curMorph));
        const frac = curMorph - seg;
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
