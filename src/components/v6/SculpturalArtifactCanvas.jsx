"use client";
import { useEffect, useRef } from "react";

// Indexed by DOM-measured chapterProgress (0.0 .. 8.0):
// [xFracOfHalfWidth, yWorld, scale, morphIdx, colorIdx, opacity]
// Card alignment:
//   0 Arrival (card LEFT)    -> sculpture RIGHT (+0.50) | Shape 0: Seed Sphere
//   1 Research (card RIGHT)  -> sculpture LEFT  (-0.50) | Shape 1: 6 Affinity Clusters
//   2 Frontend (card LEFT)   -> sculpture RIGHT (+0.50) | Shape 2: Modular 3D Grid Cube
//   3 Backend (card RIGHT)   -> sculpture LEFT  (-0.50) | Shape 3: Flowing Torus Pipeline
//   4 AI & ML (card LEFT)    -> sculpture RIGHT (+0.50) | Shape 4: Dual-Hemisphere Neural Brain
//   5 Shipped (card RIGHT)   -> sculpture LEFT  (-0.50) | Shape 5: Brilliant-Cut Diamond
//   6 Trajectory (card LEFT) -> sculpture RIGHT (+0.50) | Shape 5: Brilliant-Cut Diamond
//   7 Offscreen (full width) -> sculpture CENTER (0.00) | Faded softly so photo desk owns stage
//   8 Contact (centered)     -> sculpture CENTER (0.00) | Glowing behind colophon
const CHAPTER_STATES = [
  [ 0.50,  0.06, 0.96, 0.0, 0, 1.00], // 0 Arrival
  [-0.50,  0.06, 0.98, 1.0, 1, 1.00], // 1 UX Research
  [ 0.50,  0.06, 0.96, 2.0, 2, 1.00], // 2 Frontend UI
  [-0.50,  0.06, 0.96, 3.0, 3, 1.00], // 3 Backend APIs
  [ 0.50,  0.06, 0.98, 4.0, 4, 1.00], // 4 AI & ML
  [-0.50,  0.06, 1.00, 5.0, 5, 1.00], // 5 Shipped & Tested
  [ 0.50,  0.06, 0.88, 5.0, 5, 0.90], // 6 Trajectory
  [ 0.00,  0.08, 0.84, 5.0, 5, 0.14], // 7 Off-screen photo desk
  [ 0.00,  0.02, 1.06, 5.0, 5, 0.45], // 8 Colophon
];

const PHASE_PALETTE = [
  [0.93, 0.75, 0.40], // 0: Warm Champagne Gold (Intro)
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
 * SculpturalArtifactCanvas — True GPU Vertex-Morphing 3D Particle Sculpture
 * strictly synchronized to live DOM chapter centers and camera frustum width
 * so it ALWAYS occupies the open half opposite the narrative card.
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
      renderer.setClearColor(0x0b0c10, 1);
      container.appendChild(renderer.domElement);

      const COUNT = isMobile ? 12000 : 24000;

      const s0 = new Float32Array(COUNT * 3); // 0: Seed Sphere
      const s1 = new Float32Array(COUNT * 3); // 1: 6 Affinity Clusters (UX Research)
      const s2 = new Float32Array(COUNT * 3); // 2: Modular 3D Grid Cube (Frontend UI)
      const s3 = new Float32Array(COUNT * 3); // 3: Flowing Data Torus Knot (Backend APIs)
      const s4 = new Float32Array(COUNT * 3); // 4: Dual-Hemisphere Neural Brain (AI & ML)
      const s5 = new Float32Array(COUNT * 3); // 5: Faceted Brilliant-Cut Diamond (Shipped)
      const seeds = new Float32Array(COUNT * 3);

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
        const u = Math.random();
        const v = Math.random();
        const theta = u * Math.PI * 2;
        const phi = Math.acos(2 * v - 1);

        seeds[i3] = Math.random() * 6.28318;
        seeds[i3 + 1] = 0.75 + Math.random() * 1.45;
        seeds[i3 + 2] = Math.random();

        // Shape 0: Latent Seed Sphere + Equatorial Ring
        if (i < COUNT * 0.82) {
          const r = 1.08 + (Math.random() - 0.5) * 0.14;
          s0[i3] = r * Math.sin(phi) * Math.cos(theta);
          s0[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          s0[i3 + 2] = r * Math.cos(phi);
        } else {
          const ang = Math.random() * Math.PI * 2;
          const rr = 1.54 + (Math.random() - 0.5) * 0.08;
          s0[i3] = Math.cos(ang) * rr;
          s0[i3 + 1] = (Math.random() - 0.5) * 0.06;
          s0[i3 + 2] = Math.sin(ang) * rr;
        }

        // Shape 1: 6 Scattered Affinity Clusters + Bridges
        if (i < COUNT * 0.85) {
          const c = clusters[i % clusters.length];
          const cr = Math.pow(Math.random(), 0.6) * 0.42;
          s1[i3] = c[0] + cr * Math.sin(phi) * Math.cos(theta);
          s1[i3 + 1] = c[1] + cr * Math.sin(phi) * Math.sin(theta);
          s1[i3 + 2] = c[2] + cr * Math.cos(phi);
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
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));

      const uniforms = {
        uTime: { value: 0 },
        uMorph: { value: 0 },
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

          float swirlAmt = sin(frac * 3.14159265);
          float angle = swirlAmt * (1.25 + aSeed.z * 0.9);
          float ca = cos(angle);
          float sa = sin(angle);
          pos.xz = mat2(ca, -sa, sa, ca) * pos.xz;
          pos += normalize(pos + vec3(0.001)) * swirlAmt * (0.26 + 0.32 * sin(aSeed.x + uTime * 2.0));

          float pulse = sin(uTime * 2.4 + aSeed.x * 2.0 + pos.y * 3.0) * 0.5 + 0.5;
          pos += vec3(
            sin(uTime * 0.9 + aSeed.x) * 0.02,
            cos(uTime * 0.8 + aSeed.x) * 0.02,
            sin(uTime * 0.7 + aSeed.x) * 0.02
          );

          vec3 n = normalize(pos + vec3(0.0001));
          vec3 lightDir = normalize(vec3(-0.55, 0.72, 0.52));
          vShade = clamp(dot(n, lightDir) * 0.5 + 0.55, 0.18, 1.0);
          vSpark = pow(pulse, 4.0);
          vTone = aSeed.z;

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;

          float ptSize = (aSeed.y * 7.6 * uPixelRatio) / max(1.5, -mv.z);
          gl_PointSize = clamp(ptSize + vSpark * 1.4, 1.15, 5.0);
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

          gl_FragColor = vec4(col, bead * (0.64 + 0.34 * vShade) * uOpacity);
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
        size: 0.02,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      });
      const bgField = new THREE.Points(bgGeo, bgMat);
      scene.add(bgField);

      let mx = 0;
      let my = 0;
      let curX = 1.6;
      let curY = 0.06;
      let curScale = 0.96;
      let curMorph = 0;
      let curOp = 1;

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
        // progressRef.current is now exact DOM-measured chapterProgress (0.0 .. 8.0)
        const chP = progressRef?.current ?? 0;

        const [xFrac, kfY, kfScale, targetMorph, colorIdx, targetOp] = sampleChapterState(chP);

        // Compute exact world-space half-width at z=0 so sculpture sits dead-center in the open half!
        const vFovRad = (camera.fov * Math.PI) / 180;
        const halfH = Math.tan(vFovRad / 2) * camera.position.z;
        const halfW = halfH * camera.aspect;

        const isNarrow = window.innerWidth < 1024;
        const targetX = isNarrow ? 0 : xFrac * halfW;
        const targetScale = isNarrow ? kfScale * 0.72 : Math.min(1.05, kfScale * Math.min(1, halfW / 3.4));

        curX += (targetX - curX) * (reduced ? 1 : 0.12);
        curY += (kfY - curY) * (reduced ? 1 : 0.12);
        curScale += (targetScale - curScale) * (reduced ? 1 : 0.12);
        curMorph += (targetMorph - curMorph) * (reduced ? 1 : 0.11);
        curOp += (targetOp - curOp) * 0.1;

        sculpture.position.set(curX, curY + Math.sin(t * 0.85) * 0.05, 0);
        sculpture.scale.setScalar(curScale);
        sculpture.rotation.y = t * 0.24 + chP * 0.65 + mx * 0.35;
        sculpture.rotation.x = Math.sin(t * 0.35) * 0.12 + my * 0.28;

        uniforms.uTime.value = t;
        uniforms.uMorph.value = curMorph;
        uniforms.uOpacity.value = curOp * (isNarrow ? 0.34 : 0.96);

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
