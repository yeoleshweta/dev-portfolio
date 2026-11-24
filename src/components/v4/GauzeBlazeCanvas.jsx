"use client";
import { useEffect, useRef } from "react";

/**
 * GauzeBlazeCanvas — OriginKit-inspired "Gauze Blaze" WebGL particle-mesh ribbon.
 * Renders twisting dotted mesh sheets burning across a dark obsidian void:
 * white-hot core cooling through neon rose-pink to deep indigo edges, with
 * drifting embers, cursor-driven heat flare, and click sparks.
 */
export function GauzeBlazeCanvas() {
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
      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0.3, 6.2);

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      renderer.setClearColor(0x07060a, 1);
      container.appendChild(renderer.domElement);

      // 1. Twisting Dotted Gauze Mesh Sheets (2 layered woven ribbons)
      const cols = isMobile ? 160 : 260;
      const rows = isMobile ? 54 : 84;
      const sheets = 2;
      const meshCount = cols * rows * sheets;

      const uvGrid = new Float32Array(meshCount * 3); // [u, v, sheetIdx]
      const positions = new Float32Array(meshCount * 3);
      let idx = 0;

      for (let s = 0; s < sheets; s++) {
        for (let r = 0; r < rows; r++) {
          const v = r / (rows - 1) - 0.5; // -0.5 .. 0.5 across ribbon width
          for (let c = 0; c < cols; c++) {
            const u = c / (cols - 1) - 0.5; // -0.5 .. 0.5 along ribbon length
            positions[idx * 3] = u * 10.5;
            positions[idx * 3 + 1] = v * 2.4;
            positions[idx * 3 + 2] = 0;

            uvGrid[idx * 3] = u;
            uvGrid[idx * 3 + 1] = v;
            uvGrid[idx * 3 + 2] = s;
            idx++;
          }
        }
      }

      const gauzeGeo = new THREE.BufferGeometry();
      gauzeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      gauzeGeo.setAttribute("aGrid", new THREE.BufferAttribute(uvGrid, 3));

      const uniforms = {
        uTime: { value: 0 },
        uPixelRatio: { value: dpr },
        uPointer: { value: new THREE.Vector3(99, 99, 0) },
        uHeat: { value: 0 },
        uPulsePos: { value: new THREE.Vector3(99, 99, 0) },
        uPulseAge: { value: 10 },
      };

      const gauzeVert = /* glsl */ `
        attribute vec3 aGrid;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec3 uPointer;
        uniform float uHeat;
        uniform vec3 uPulsePos;
        uniform float uPulseAge;

        varying float vTemp;
        varying float vAlpha;

        void main() {
          float u = aGrid.x; // -0.5..0.5 along ribbon
          float v = aGrid.y; // -0.5..0.5 across width
          float sheet = aGrid.z;
          float t = uTime * 0.55;

          // Diagonal sweeping ribbon spine
          float x = u * 10.4 + 0.65;
          float spineY = sin(u * 4.4 - t * 0.85 + sheet * 1.4) * 1.15
                       + cos(u * 2.1 + t * 0.4) * 0.45
                       + u * 1.35;
          float spineZ = cos(u * 3.6 - t * 0.7 + sheet * 1.1) * 1.1 - 0.4 - sheet * 0.35;

          // Twisting gauze angle along the ribbon
          float twist = u * 5.6 + t * 0.65 + sheet * 2.1 + sin(u * 6.0 - t) * 0.5;
          float width = mix(1.95, 1.45, sheet) * (0.78 + 0.35 * cos(u * 3.2 + t * 0.5));
          float localV = v * width;

          // Fine woven ripple across the mesh
          float wave = sin(u * 22.0 + v * 12.0 - t * 2.2) * 0.08;

          vec3 pos = vec3(
            x + sin(twist) * localV * 0.25,
            spineY + cos(twist) * localV + wave,
            spineZ + sin(twist) * localV
          );

          // Cursor-driven heat & slight thermal lift
          float pDist = length(pos.xy - uPointer.xy);
          float cursorHeat = exp(-pDist * pDist * 0.75) * uHeat;
          pos.z += cursorHeat * 0.55;
          pos.y += cursorHeat * 0.18;

          // Click spark shockwave
          float cDist = length(pos.xy - uPulsePos.xy);
          float ring = exp(-pow((cDist - uPulseAge * 3.2) * 3.0, 2.0)) * exp(-uPulseAge * 1.8);
          pos.z += ring * 0.45;

          // Core-to-edge thermal gradient (white-hot center -> neon pink -> deep indigo)
          float edgeDist = abs(v) * 2.0; // 0 at center, 1 at edge
          float coreHeat = pow(clamp(1.0 - edgeDist, 0.0, 1.0), 1.45);
          float neonEdge = smoothstep(0.72, 1.0, edgeDist) * 0.42;
          float flicker = 0.88 + 0.18 * sin(u * 18.0 - t * 3.2 + v * 10.0);

          vTemp = clamp(coreHeat * flicker + neonEdge + cursorHeat * 0.95 + ring * 0.85, 0.0, 1.35);

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;

          float baseSize = mix(2.3, 1.8, sheet) + cursorHeat * 2.2 + neonEdge * 1.2;
          gl_PointSize = clamp((baseSize * 5.2 * uPixelRatio) / max(1.4, -mv.z), 1.0, 5.2);

          // Fade softly at far left/right tips
          float endFade = smoothstep(0.5, 0.36, abs(u));
          vAlpha = endFade * mix(0.88, 0.58, sheet);
        }
      `;

      const gauzeFrag = /* glsl */ `
        varying float vTemp;
        varying float vAlpha;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;

          float dotGlow = smoothstep(0.5, 0.06, d);

          // Indigo -> Electric Violet -> Neon Pink -> White-hot Core
          vec3 cIndigo = vec3(0.14, 0.10, 0.48);
          vec3 cViolet = vec3(0.52, 0.14, 0.88);
          vec3 cPink   = vec3(1.00, 0.28, 0.64);
          vec3 cHot    = vec3(1.00, 0.95, 0.90);

          vec3 col = mix(cIndigo, cViolet, smoothstep(0.05, 0.38, vTemp));
          col = mix(col, cPink, smoothstep(0.36, 0.74, vTemp));
          col = mix(col, cHot, smoothstep(0.72, 1.12, vTemp));

          // Soft filmic tone lift
          col *= 1.15;
          gl_FragColor = vec4(col, dotGlow * vAlpha);
        }
      `;

      const gauzeMat = new THREE.ShaderMaterial({
        vertexShader: gauzeVert,
        fragmentShader: gauzeFrag,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const gauzePoints = new THREE.Points(gauzeGeo, gauzeMat);
      scene.add(gauzePoints);

      // 2. Drifting Embers & Spark Field
      const EMBER_COUNT = isMobile ? 350 : 750;
      const emberPos = new Float32Array(EMBER_COUNT * 3);
      const emberSeed = new Float32Array(EMBER_COUNT * 3);
      for (let i = 0; i < EMBER_COUNT; i++) {
        emberPos[i * 3] = (Math.random() - 0.5) * 11.5;
        emberPos[i * 3 + 1] = (Math.random() - 0.5) * 6.0;
        emberPos[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
        emberSeed[i * 3] = Math.random() * 6.28;
        emberSeed[i * 3 + 1] = 0.25 + Math.random() * 0.75;
        emberSeed[i * 3 + 2] = Math.random();
      }

      const emberGeo = new THREE.BufferGeometry();
      emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPos, 3));
      emberGeo.setAttribute("aSeed", new THREE.BufferAttribute(emberSeed, 3));

      const emberMat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          attribute vec3 aSeed;
          uniform float uTime;
          uniform float uPixelRatio;
          varying float vHot;
          void main() {
            vec3 p = position;
            float rise = mod(p.y + uTime * aSeed.y * 0.55 + 3.0, 6.0) - 3.0;
            p.y = rise;
            p.x += sin(uTime * 0.9 + aSeed.x) * 0.35;
            vHot = aSeed.z;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = clamp((10.0 * (0.6 + aSeed.z) * uPixelRatio) / max(1.5, -mv.z), 1.2, 4.4);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vHot;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float g = smoothstep(0.5, 0.05, d);
            vec3 col = mix(vec3(1.0, 0.32, 0.65), vec3(1.0, 0.88, 0.72), vHot);
            gl_FragColor = vec4(col, g * 0.8);
          }
        `,
      });
      const embers = new THREE.Points(emberGeo, emberMat);
      scene.add(embers);

      const targetPtr = new THREE.Vector3(99, 99, 0);
      let heatTarget = 0;
      let visible = true;

      const projectPointer = (clientX, clientY, out) => {
        const rect = container.getBoundingClientRect();
        const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
        const vFov = (camera.fov * Math.PI) / 180;
        const planeH = 2 * Math.tan(vFov / 2) * camera.position.z;
        const planeW = planeH * camera.aspect;
        out.set(nx * planeW * 0.5, ny * planeH * 0.5, 0);
      };

      const onPointerMove = (e) => {
        projectPointer(e.clientX, e.clientY, targetPtr);
        heatTarget = 1;
      };
      const onPointerLeave = () => {
        heatTarget = 0;
      };
      const onPointerDown = (e) => {
        projectPointer(e.clientX, e.clientY, uniforms.uPulsePos.value);
        uniforms.uPulseAge.value = 0;
      };
      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      const obs = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { rootMargin: "200px" }
      );
      obs.observe(container);

      container.addEventListener("pointermove", onPointerMove, { passive: true });
      container.addEventListener("pointerleave", onPointerLeave, { passive: true });
      container.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("resize", onResize);

      const clock = new THREE.Clock();
      let raf = 0;

      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (!visible || document.hidden) return;

        const dt = Math.min(clock.getDelta(), 0.05);
        if (!reduced) {
          uniforms.uTime.value += dt;
          uniforms.uPulseAge.value += dt;
        }
        uniforms.uPointer.value.lerp(targetPtr, 0.12);
        uniforms.uHeat.value += (heatTarget - uniforms.uHeat.value) * 0.08;

        renderer.render(scene, camera);
      };

      animate();

      teardown = () => {
        cancelAnimationFrame(raf);
        obs.disconnect();
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerLeave);
        container.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("resize", onResize);
        gauzeGeo.dispose();
        gauzeMat.dispose();
        emberGeo.dispose();
        emberMat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      teardown();
    };
  }, []);

  return <div ref={hostRef} className="v4CanvasHost" aria-hidden="true" />;
}
