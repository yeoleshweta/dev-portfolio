"use client";
import { useEffect, useRef } from "react";

// Continuous lifecycle keyframes across page scroll 0..1:
// [p, xWorld, yWorld, scale, wireOp, solidOp, cloudSpread, researchLines, ringExplode, coreGlow, scanSweep, goldFinish, stageOp]
const KEYFRAMES = [
  [0.00,  1.65,  0.10, 0.98, 0.42, 0.36, 0.14, 0.08, 0.06, 0.22, 0.00, 0.18, 1.00], // 01 Intro — Raw latent prism (right)
  [0.14, -1.65,  0.12, 1.02, 0.06, 0.03, 1.00, 1.00, 0.04, 0.14, 0.00, 0.00, 1.00], // 02 UX Research — Raw signal cloud + affinity threads (left)
  [0.29,  1.65,  0.10, 1.04, 0.98, 0.46, 0.04, 0.00, 0.12, 0.22, 0.00, 0.12, 1.00], // 03 Frontend UI — Crisp geometric lattice + frosted surface (right)
  [0.44, -1.60,  0.10, 0.96, 0.58, 0.22, 0.12, 0.00, 1.00, 0.36, 0.00, 0.08, 1.00], // 04 Backend APIs — Exploded concentric data rings + beads (left)
  [0.58,  1.60,  0.10, 1.04, 0.68, 0.32, 0.28, 0.45, 0.68, 1.00, 0.00, 0.14, 1.00], // 05 AI & ML — Ignited neural core + synaptic rays (right)
  [0.72, -1.65,  0.10, 1.06, 0.28, 0.96, 0.00, 0.00, 0.04, 0.42, 1.00, 1.00, 1.00], // 06 Testing & Shipped — Calibration sweep + brushed gold monolith (left)
  [0.85,  1.75,  0.08, 0.84, 0.24, 0.88, 0.04, 0.00, 0.12, 0.32, 0.20, 0.92, 0.78], // 07 Trajectory — Companion finished seal (right)
  [0.93,  0.00,  0.10, 0.86, 0.18, 0.46, 0.08, 0.00, 0.08, 0.18, 0.00, 0.72, 0.18], // Off-screen gallery breathing room
  [1.00,  0.00,  0.04, 1.12, 0.32, 0.92, 0.03, 0.00, 0.10, 0.42, 0.35, 1.00, 0.52], // 08 Colophon — Centered finished artifact
];

const PHASE_COLORS = [
  [0.91, 0.72, 0.35], // 01 Intro — Warm Gold
  [0.91, 0.66, 0.28], // 02 UX Research — Blueprint Amber
  [0.44, 0.71, 1.00], // 03 Frontend UI — Ice Cobalt
  [0.24, 0.88, 0.61], // 04 Backend APIs — Terminal Mint
  [0.65, 0.42, 1.00], // 05 AI & ML — Neural Violet
  [0.93, 0.74, 0.38], // 06 Testing & Shipped — Champagne Gold
  [0.85, 0.57, 0.71], // 07 Trajectory — Dusk Rose
  [0.93, 0.74, 0.38], // 08 Colophon — Champagne Gold
];

function sampleKF(p) {
  const c = Math.max(0, Math.min(1, p));
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (c >= a[0] && c <= b[0]) {
      const raw = (c - a[0]) / Math.max(0.0001, b[0] - a[0]);
      const t = raw * raw * (3 - 2 * raw);
      const out = [];
      for (let k = 1; k < a.length; k++) out.push(a[k] + (b[k] - a[k]) * t);
      return out;
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1].slice(1);
}

/**
 * SculpturalArtifactCanvas — One persistent, iconic 3D WebGL sculpture visualizing
 * the entire product lifecycle:
 *   01 Latent Prism -> 02 UX Research (Signal Cloud + Affinity Threads) ->
 *   03 Frontend UI (Crisp Geometric Lattice) -> 04 Backend APIs (Exploded Data Rings) ->
 *   05 AI & ML (Ignited Neural Core + Synaptic Filaments) ->
 *   06 Testing & Shipped (Calibration Sweep Ring + Brushed Gold Monolith).
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
      camera.position.set(0, 0, 6.6);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      renderer.setClearColor(0x0b0c10, 1);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;
      container.appendChild(renderer.domElement);

      const disposables = [];

      // Studio lighting rig
      const ambient = new THREE.AmbientLight(0xd8dce8, 0.45);
      scene.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xfff4df, 2.3);
      keyLight.position.set(-4, 5, 6);
      scene.add(keyLight);

      const accentLight = new THREE.PointLight(0xe8b85a, 16, 18, 1.5);
      accentLight.position.set(3.2, 2.2, 3.6);
      scene.add(accentLight);

      const rimLight = new THREE.PointLight(0x6fb6ff, 10, 16, 1.6);
      rimLight.position.set(-3.5, -2.6, -2.5);
      scene.add(rimLight);

      // Ambient Background Dust
      const DUST_COUNT = isMobile ? 1400 : 3000;
      const dustPos = new Float32Array(DUST_COUNT * 3);
      for (let i = 0; i < DUST_COUNT; i++) {
        dustPos[i * 3] = (Math.random() - 0.5) * 16;
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
        dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2.0;
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
      const dustMat = new THREE.PointsMaterial({
        color: 0xe8b85a,
        size: 0.026,
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const dustField = new THREE.Points(dustGeo, dustMat);
      scene.add(dustField);
      disposables.push(dustGeo, dustMat);

      // ================================================================
      // THE ONE PERSISTENT LIFECYCLE SCULPTURE
      // ================================================================
      const artifact = new THREE.Group();
      scene.add(artifact);

      // 1. Primary Faceted Polyhedron Shell (obsidian -> frosted UI -> brushed gold)
      const shellGeo = new THREE.IcosahedronGeometry(1.16, 1);
      const shellMat = new THREE.MeshStandardMaterial({
        color: 0x1a1c26,
        emissive: 0x221a0f,
        emissiveIntensity: 0.25,
        metalness: 0.78,
        roughness: 0.26,
        flatShading: true,
        transparent: true,
        opacity: 0.45,
      });
      const shellMesh = new THREE.Mesh(shellGeo, shellMat);
      artifact.add(shellMesh);
      disposables.push(shellGeo, shellMat);

      // 2. Crisp Architectural Wireframe Cage (Phase 03 Frontend UI)
      const wireGeo = new THREE.IcosahedronGeometry(1.23, 1);
      const wireEdges = new THREE.EdgesGeometry(wireGeo);
      const wireMat = new THREE.LineBasicMaterial({
        color: 0x6fb6ff,
        transparent: true,
        opacity: 0.45,
      });
      const wireMesh = new THREE.LineSegments(wireEdges, wireMat);
      artifact.add(wireMesh);
      disposables.push(wireGeo, wireEdges, wireMat);

      // 3. Discovery Signal Cloud (Phase 02 UX Research)
      const CLOUD_COUNT = isMobile ? 1800 : 4200;
      const cloudBase = new Float32Array(CLOUD_COUNT * 3);
      const cloudRand = new Float32Array(CLOUD_COUNT * 3);
      for (let i = 0; i < CLOUD_COUNT; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * Math.PI * 2;
        const phi = Math.acos(2 * v - 1);
        const r = 1.02 + Math.random() * 0.28;
        cloudBase[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        cloudBase[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        cloudBase[i * 3 + 2] = r * Math.cos(phi);

        const sr = 1.55 + Math.random() * 1.45;
        cloudRand[i * 3] = sr * Math.sin(phi) * Math.cos(theta + (Math.random() - 0.5) * 0.8);
        cloudRand[i * 3 + 1] = sr * Math.sin(phi) * Math.sin(theta + (Math.random() - 0.5) * 0.8);
        cloudRand[i * 3 + 2] = sr * Math.cos(phi + (Math.random() - 0.5) * 0.6);
      }
      const cloudGeo = new THREE.BufferGeometry();
      cloudGeo.setAttribute("position", new THREE.BufferAttribute(cloudBase, 3));
      cloudGeo.setAttribute("aScatter", new THREE.BufferAttribute(cloudRand, 3));

      const cloudUniforms = {
        uTime: { value: 0 },
        uSpread: { value: 0.14 },
        uPixelRatio: { value: dpr },
        uColor: { value: new THREE.Color(0xe8a848) },
        uOpacity: { value: 0.85 },
      };

      const cloudMat = new THREE.ShaderMaterial({
        uniforms: cloudUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          attribute vec3 aScatter;
          uniform float uTime;
          uniform float uSpread;
          uniform float uPixelRatio;
          varying float vGlow;

          void main() {
            vec3 p = mix(position, aScatter, uSpread);
            float t = uTime * 0.85;
            p.x += sin(t + position.y * 2.4) * (0.04 + uSpread * 0.14);
            p.y += cos(t * 0.9 + position.z * 2.4) * (0.04 + uSpread * 0.14);
            p.z += sin(t * 0.7 + position.x * 2.4) * (0.04 + uSpread * 0.12);

            vGlow = 0.5 + 0.5 * sin(position.x * 4.0 + t * 1.4);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = clamp(((2.0 + uSpread * 2.6) * 4.8 * uPixelRatio) / max(1.6, -mv.z), 1.1, 5.2);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uOpacity;
          varying float vGlow;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float soft = smoothstep(0.5, 0.08, d);
            vec3 col = mix(uColor, vec3(0.98, 0.96, 0.92), vGlow * 0.38);
            gl_FragColor = vec4(col, soft * uOpacity);
          }
        `,
      });
      const cloudPoints = new THREE.Points(cloudGeo, cloudMat);
      artifact.add(cloudPoints);
      disposables.push(cloudGeo, cloudMat);

      // 4. Affinity Constellation Threads / Synaptic Filaments (Phase 02 UX Research & Phase 05 AI)
      const nodeCount = 26;
      const nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        const theta = (i / nodeCount) * Math.PI * 2 * 3.7;
        const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);
        const r = 1.65 + (i % 3) * 0.25;
        nodes.push(
          new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
          )
        );
      }
      const lineVerts = [];
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          if (nodes[i].distanceTo(nodes[j]) < 1.65) {
            lineVerts.push(nodes[i].x, nodes[i].y, nodes[i].z);
            lineVerts.push(nodes[j].x, nodes[j].y, nodes[j].z);
          }
        }
      }
      const threadGeo = new THREE.BufferGeometry();
      threadGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(lineVerts, 3)
      );
      const threadMat = new THREE.LineBasicMaterial({
        color: 0xe8a848,
        transparent: true,
        opacity: 0.0,
      });
      const threadLines = new THREE.LineSegments(threadGeo, threadMat);
      artifact.add(threadLines);
      disposables.push(threadGeo, threadMat);

      // 5. Concentric Orbital API Rings + Data Beads (Phase 04 Backend APIs)
      const ringsGroup = new THREE.Group();
      artifact.add(ringsGroup);
      const rings = [];
      const ringSpecs = [
        { r: 1.50, tube: 0.015, tiltX: 0.65, tiltY: 0.2, speed: 0.50 },
        { r: 1.74, tube: 0.012, tiltX: -0.75, tiltY: 0.9, speed: -0.38 },
        { r: 1.98, tube: 0.010, tiltX: 1.15, tiltY: -0.5, speed: 0.30 },
      ];
      ringSpecs.forEach((spec) => {
        const rg = new THREE.TorusGeometry(spec.r, spec.tube, 12, 96);
        const rm = new THREE.MeshBasicMaterial({
          color: 0x3ee09c,
          transparent: true,
          opacity: 0.12,
        });
        const mesh = new THREE.Mesh(rg, rm);
        mesh.rotation.set(spec.tiltX, spec.tiltY, 0);

        const beadGeo = new THREE.SphereGeometry(0.058, 16, 16);
        const beadMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.15,
        });
        const bead = new THREE.Mesh(beadGeo, beadMat);
        bead.position.set(spec.r, 0, 0);
        mesh.add(bead);

        ringsGroup.add(mesh);
        rings.push({ mesh, rm, beadMat, speed: spec.speed });
        disposables.push(rg, rm, beadGeo, beadMat);
      });

      // 6. Inner Neural Core (Phase 05 AI & ML)
      const coreGeo = new THREE.OctahedronGeometry(0.62, 2);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xa76bff,
        emissive: 0x7b35ff,
        emissiveIntensity: 0.5,
        metalness: 0.4,
        roughness: 0.2,
        transparent: true,
        opacity: 0.85,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      artifact.add(coreMesh);
      disposables.push(coreGeo, coreMat);

      // 7. Calibration Verification Sweep Ring (Phase 06 Testing & Shipped)
      const scanGeo = new THREE.TorusGeometry(1.42, 0.018, 12, 96);
      scanGeo.rotateX(Math.PI / 2);
      const scanMat = new THREE.MeshBasicMaterial({
        color: 0xf7d688,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
      });
      const scanRing = new THREE.Mesh(scanGeo, scanMat);
      artifact.add(scanRing);
      disposables.push(scanGeo, scanMat);

      let mx = 0;
      let my = 0;
      let curX = 1.65;
      let curY = 0.1;
      let curScale = 1;
      const targetColor = new THREE.Color();
      const curColor = new THREE.Color(0xe8b85a);
      const obsidianCol = new THREE.Color(0x181a24);
      const goldCol = new THREE.Color(0xd1a44d);

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

        const dt = Math.min(clock.getDelta(), 0.05);
        const t = reduced ? 0 : clock.getElapsedTime();
        const p = progressRef?.current ?? 0;

        const [
          kfX, kfY, kfScale, wireOp, solidOp,
          cloudSpread, researchLines, ringExplode, coreGlow, scanSweep, goldFinish, stageOp,
        ] = sampleKF(p);

        const isNarrow = window.innerWidth < 1024;
        const targetX = isNarrow ? 0 : kfX;
        const targetScale = isNarrow ? kfScale * 0.76 : kfScale;

        curX += (targetX - curX) * 0.09;
        curY += (kfY - curY) * 0.09;
        curScale += (targetScale - curScale) * 0.09;

        artifact.position.set(curX, curY + Math.sin(t * 0.9) * 0.06, 0);
        artifact.scale.setScalar(curScale);
        artifact.rotation.y = t * 0.22 + p * Math.PI * 2.6 + mx * 0.35;
        artifact.rotation.x = Math.sin(t * 0.4) * 0.14 + my * 0.28;

        const colorIdx = p * (PHASE_COLORS.length - 1);
        const c0 = PHASE_COLORS[Math.floor(colorIdx)];
        const c1 = PHASE_COLORS[Math.min(PHASE_COLORS.length - 1, Math.ceil(colorIdx))];
        const cf = colorIdx - Math.floor(colorIdx);
        targetColor.setRGB(
          c0[0] + (c1[0] - c0[0]) * cf,
          c0[1] + (c1[1] - c0[1]) * cf,
          c0[2] + (c1[2] - c0[2]) * cf
        );
        curColor.lerp(targetColor, 0.08);

        // 1. Shell
        shellMat.color.copy(obsidianCol).lerp(goldCol, goldFinish * 0.88);
        shellMat.emissive.copy(curColor);
        shellMat.emissiveIntensity = 0.08 + coreGlow * 0.28 + goldFinish * 0.14;
        shellMat.metalness = 0.65 + goldFinish * 0.3;
        shellMat.roughness = 0.36 - goldFinish * 0.22;
        shellMat.opacity = solidOp * stageOp;

        // 2. Wireframe Lattice
        wireMat.color.copy(curColor);
        wireMat.opacity = wireOp * stageOp;
        wireMesh.scale.setScalar(1.0 + ringExplode * 0.14);

        // 3. Discovery Signal Cloud
        cloudUniforms.uTime.value = t;
        cloudUniforms.uSpread.value += (cloudSpread - cloudUniforms.uSpread.value) * 0.09;
        cloudUniforms.uColor.value.copy(curColor);
        cloudUniforms.uOpacity.value = (0.3 + cloudSpread * 0.7) * stageOp;

        // 4. Affinity Threads / Synaptic Filaments
        threadMat.color.copy(curColor);
        threadMat.opacity = researchLines * 0.48 * stageOp;
        threadLines.scale.setScalar(0.86 + researchLines * 0.22);

        // 5. Exploded API Rings
        ringsGroup.scale.setScalar(0.82 + ringExplode * 0.42);
        rings.forEach((r) => {
          r.mesh.rotation.z += dt * r.speed * (0.6 + ringExplode * 1.5);
          r.rm.color.copy(curColor);
          r.rm.opacity = (0.06 + ringExplode * 0.76) * stageOp;
          r.beadMat.opacity = (0.08 + ringExplode * 0.92) * stageOp;
        });

        // 6. Neural Core
        const corePulse = 0.52 + coreGlow * 0.36 + Math.sin(t * 2.8) * 0.045 * coreGlow;
        coreMesh.scale.setScalar(corePulse);
        coreMesh.rotation.y = -t * 0.55;
        coreMat.color.copy(curColor);
        coreMat.emissive.copy(curColor);
        coreMat.emissiveIntensity = 0.25 + coreGlow * 2.5;
        coreMat.opacity = (0.22 + coreGlow * 0.78) * stageOp;

        // 7. Calibration Verification Sweep Ring (oscillates smoothly top <-> bottom in Phase 06)
        const sweepY = Math.sin(t * 1.9) * 1.25;
        scanRing.position.y = sweepY;
        const ringRadiusFactor = Math.sqrt(Math.max(0.18, 1.0 - (sweepY * sweepY) / 2.2));
        scanRing.scale.set(ringRadiusFactor, 1, ringRadiusFactor);
        scanMat.opacity = scanSweep * 0.85 * stageOp;

        accentLight.color.copy(curColor);
        accentLight.intensity = (10 + coreGlow * 14 + goldFinish * 12) * stageOp;
        dustMat.color.copy(curColor);
        dustField.rotation.y = t * 0.025 + p * 0.4;

        renderer.render(scene, camera);
      };

      animate();

      teardown = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("resize", onResize);
        disposables.forEach((d) => d.dispose?.());
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
