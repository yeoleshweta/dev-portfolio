"use client";
import { useEffect, useRef } from "react";

const PHASE_RGB = [
  [0.91, 0.66, 0.28], // 01 UX Research — Warm Blueprint Amber
  [0.44, 0.71, 1.0],  // 02 Frontend UI — Ice Cobalt
  [0.24, 0.88, 0.61], // 03 Backend API — Terminal Mint
  [0.65, 0.42, 1.0],  // 04 AI & ML — Neural Violet
  [0.93, 0.74, 0.38], // 05 Shipped & Tested — Champagne Gold
];

/**
 * PhaseFieldCanvas — Scroll-reactive ambient Three.js micro-particle field.
 * Continuously shifts color temperature, orbital curl, and depth as the user
 * scrubs through the 5 product-building phases.
 */
export function PhaseFieldCanvas({ progressRef }) {
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
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 6.4);

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      });
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      renderer.setClearColor(0x0b0c10, 1);
      container.appendChild(renderer.domElement);

      const COUNT = isMobile ? 2200 : 5200;
      const pos = new Float32Array(COUNT * 3);
      const seed = new Float32Array(COUNT * 3);

      for (let i = 0; i < COUNT; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 14;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
        seed[i * 3] = Math.random() * 6.2831;
        seed[i * 3 + 1] = 0.6 + Math.random() * 1.4;
        seed[i * 3 + 2] = Math.random();
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));

      const uniforms = {
        uTime: { value: 0 },
        uPixelRatio: { value: dpr },
        uColor: { value: new THREE.Color(0.91, 0.66, 0.28) },
        uProgress: { value: 0 },
      };

      const mat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          attribute vec3 aSeed;
          uniform float uTime;
          uniform float uPixelRatio;
          uniform float uProgress;
          varying float vAlpha;
          varying float vMix;

          void main() {
            vec3 p = position;
            float t = uTime * 0.25 + uProgress * 4.5;
            p.x += sin(t * 0.7 + aSeed.x + p.y * 0.35) * 0.42;
            p.y += cos(t * 0.6 + aSeed.x + p.x * 0.3) * 0.35;
            p.z += sin(t * 0.5 + aSeed.x) * 0.3;

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = clamp((aSeed.y * 10.0 * uPixelRatio) / max(1.8, -mv.z), 1.0, 4.2);

            float radial = smoothstep(7.2, 1.4, length(p.xy));
            vAlpha = radial * (0.28 + 0.45 * aSeed.z);
            vMix = aSeed.z;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          varying float vAlpha;
          varying float vMix;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float soft = smoothstep(0.5, 0.08, d);
            vec3 col = mix(uColor, vec3(0.96, 0.95, 0.93), vMix * 0.35);
            gl_FragColor = vec4(col, soft * vAlpha);
          }
        `,
      });

      const points = new THREE.Points(geo, mat);
      scene.add(points);

      let visible = true;
      const obs = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { rootMargin: "200px" }
      );
      obs.observe(container);

      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      const clock = new THREE.Clock();
      const targetColor = new THREE.Color();
      let raf = 0;

      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (!visible || document.hidden) return;

        const dt = Math.min(clock.getDelta(), 0.05);
        if (!reduced) uniforms.uTime.value += dt;

        const p = progressRef?.current ?? 0;
        uniforms.uProgress.value += (p - uniforms.uProgress.value) * 0.08;

        // Smoothly interpolate color across the 5 phases
        const scaled = Math.max(0, Math.min(4, p * 4));
        const i0 = Math.floor(scaled);
        const i1 = Math.min(4, i0 + 1);
        const f = scaled - i0;
        const c0 = PHASE_RGB[i0];
        const c1 = PHASE_RGB[i1];
        targetColor.setRGB(
          c0[0] + (c1[0] - c0[0]) * f,
          c0[1] + (c1[1] - c0[1]) * f,
          c0[2] + (c1[2] - c0[2]) * f
        );
        uniforms.uColor.value.lerp(targetColor, 0.08);

        renderer.render(scene, camera);
      };

      animate();

      teardown = () => {
        cancelAnimationFrame(raf);
        obs.disconnect();
        window.removeEventListener("resize", onResize);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      teardown();
    };
  }, [progressRef]);

  return <div ref={hostRef} className="v6FieldCanvas" aria-hidden="true" />;
}
