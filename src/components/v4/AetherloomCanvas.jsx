"use client";
import { useEffect, useRef } from "react";

/**
 * AetherloomCanvas — OriginKit-inspired full-bleed GLSL woven light & fluid silk shader.
 * Renders continuous, domain-warped currents of smoked obsidian, molten tungsten amber,
 * warm copper, and delicate silver-ice caustics with zero central orb or sphere.
 * Reacts smoothly to pointer ripples and vertical scroll.
 */
export function AetherloomCanvas() {
  const hostRef = useRef(null);

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let teardown = () => {};

    import("three").then((THREE) => {
      if (disposed || !hostRef.current) return;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      const uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uPointer: { value: new THREE.Vector2(0.65, 0.45) },
        uScroll: { value: 0 },
      };

      const vertexShader = /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `;

      const fragmentShader = /* glsl */ `
        precision highp float;
        varying vec2 vUv;

        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uPointer;
        uniform float uScroll;

        // Smooth 2D simplex-style value noise
        vec2 hash2(vec2 p) {
          p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
          return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
        }

        float gnoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
            mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
          for (int i = 0; i < 5; i++) {
            v += a * gnoise(p);
            p = m * p * 2.02;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 aspect = vec2(uResolution.x / max(1.0, uResolution.y), 1.0);
          vec2 uv = (vUv - 0.5) * aspect;
          vec2 ptr = (uPointer - 0.5) * aspect;

          float t = uTime * 0.14;

          // Subtle pointer fluid refraction
          vec2 toPtr = uv - ptr;
          float pDist = length(toPtr);
          vec2 pWarp = toPtr * exp(-pDist * 2.6) * 0.18;

          // Multi-stage domain warping for woven silk / liquid glass folds
          vec2 q = vec2(
            fbm(uv * 1.35 + vec2(t * 0.7, -t * 0.45) + pWarp),
            fbm(uv * 1.35 + vec2(-t * 0.55, t * 0.65) + vec2(4.2, 1.7))
          );

          vec2 r = vec2(
            fbm(uv * 1.65 + 2.2 * q + vec2(1.7, 9.2) + vec2(t * 0.35, -uScroll * 0.35)),
            fbm(uv * 1.65 + 2.2 * q + vec2(8.3, 2.8) + vec2(-t * 0.3, uScroll * 0.25))
          );

          float f = fbm(uv * 1.4 + 2.4 * r);

          // Woven optical light ridges (Aetherloom sheen)
          float silk = sin((uv.x * 2.4 - uv.y * 1.6 + f * 3.8 + r.x * 2.1) * 3.14159);
          float ridge = pow(clamp(1.0 - abs(silk), 0.0, 1.0), 4.5);

          // Directional lighting biased cleanly to the right & upper-right so left text stays ultra-legible
          float spatialGlow = smoothstep(-0.65, 0.85, uv.x * 0.85 + uv.y * 0.25);

          vec3 colObsidian = vec3(0.039, 0.039, 0.047); // #0a0a0c
          vec3 colSmoked   = vec3(0.085, 0.072, 0.088); // deep smoked slate
          vec3 colCopper   = vec3(0.46, 0.19, 0.10);    // warm bronze/copper fold
          vec3 colAmber    = vec3(0.95, 0.62, 0.24);    // molten tungsten amber
          vec3 colIce      = vec3(0.76, 0.84, 0.92);    // subtle spectral silver caustic

          vec3 col = mix(colObsidian, colSmoked, smoothstep(-0.35, 0.45, f));
          col = mix(col, colCopper, smoothstep(0.05, 0.62, length(q)) * 0.65 * (0.35 + 0.65 * spatialGlow));
          col = mix(col, colAmber, smoothstep(0.28, 0.82, r.x * 0.65 + f * 0.55) * 0.58 * (0.25 + 0.75 * spatialGlow));

          // Fine luminous silk caustic filaments along the folds
          col += colAmber * ridge * 0.34 * (0.3 + 0.7 * spatialGlow);
          col += colIce * pow(ridge, 2.2) * 0.22 * smoothstep(-0.2, 0.6, r.y);

          // Subtle micro film-dither to prevent 8-bit banding
          float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
          col += (dither - 0.5) * 0.008;

          gl_FragColor = vec4(col, 1.0);
        }
      `;

      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        depthWrite: false,
        depthTest: false,
      });

      const quad = new THREE.Mesh(geometry, material);
      scene.add(quad);

      let tx = 0.65;
      let ty = 0.45;
      let scrollP = 0;
      let visible = true;

      const onPointerMove = (e) => {
        tx = e.clientX / Math.max(1, window.innerWidth);
        ty = 1.0 - e.clientY / Math.max(1, window.innerHeight);
      };
      const onScroll = () => {
        scrollP = Math.min(1.5, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)));
      };
      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        renderer.setSize(w, h);
        uniforms.uResolution.value.set(w, h);
      };

      const obs = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { rootMargin: "200px" }
      );
      obs.observe(container);

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);

      const clock = new THREE.Clock();
      let raf = 0;

      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (!visible || document.hidden) return;

        const dt = clock.getDelta();
        if (!reduced) {
          uniforms.uTime.value += Math.min(dt, 0.05);
        }

        uniforms.uPointer.value.x += (tx - uniforms.uPointer.value.x) * 0.05;
        uniforms.uPointer.value.y += (ty - uniforms.uPointer.value.y) * 0.05;
        uniforms.uScroll.value += (scrollP - uniforms.uScroll.value) * 0.08;

        renderer.render(scene, camera);
      };

      animate();

      teardown = () => {
        cancelAnimationFrame(raf);
        obs.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      teardown();
    };
  }, []);

  return <div ref={hostRef} className="v4AccretionHost" aria-hidden="true" />;
}
