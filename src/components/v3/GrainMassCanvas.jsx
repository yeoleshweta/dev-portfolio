"use client";
import { useEffect, useRef } from "react";

/**
 * GrainMassCanvas — GPU-accelerated Three.js WebGL particle cloud inspired by
 * OriginKit's Grain Mass: tens of thousands of shaded micro-grains marbled in
 * molten gold, electric violet, and glacial mineral blue, churned by 3D curl
 * turbulence, lit from the upper-left with volumetric self-shadowing, and
 * pushed aside smoothly by the cursor.
 */
export function GrainMassCanvas() {
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
      camera.position.set(0, 0, 5.4);

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      });
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      renderer.setClearColor(0x0b0a0f, 1);
      container.appendChild(renderer.domElement);

      // Dense volumetric particle cloud with organic lumpy core + fraying outer dust
      const COUNT = isMobile ? 42000 : 96000;
      const positions = new Float32Array(COUNT * 3);
      const seeds = new Float32Array(COUNT * 4); // [phase, size, frayFactor, pigmentBias]

      for (let i = 0; i < COUNT; i++) {
        // Uniform random direction on unit sphere
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const sinPhi = Math.sin(phi);
        const dx = sinPhi * Math.cos(theta);
        const dy = sinPhi * Math.sin(theta);
        const dz = Math.cos(phi);

        // 84% dense sculpted cloud mass + 16% loose fraying dust halo
        const isFray = Math.random() > 0.84;
        let radius;
        if (isFray) {
          radius = 1.48 + Math.pow(Math.random(), 1.6) * 1.45;
        } else {
          // Concentrate density near the organic outer shell and mid-volume
          radius = 0.25 + Math.pow(Math.random(), 0.48) * 1.38;
        }

        // Organic multi-lobe sculptural lumpiness (matches Grain Mass silhouette)
        const lobe =
          1.0 +
          0.26 * Math.sin(dx * 2.6 + dy * 1.8) * Math.cos(dz * 2.2) +
          0.16 * Math.cos(dy * 3.4 - dz * 2.5) +
          0.12 * Math.sin(dx * 4.1 - dy * 3.1);

        const r = radius * lobe;
        // Slight vertical stretch for sculptural presence
        positions[i * 3] = dx * r * 1.08;
        positions[i * 3 + 1] = dy * r * 1.18;
        positions[i * 3 + 2] = dz * r * 0.96;

        seeds[i * 4] = Math.random() * 6.28318; // phase
        seeds[i * 4 + 1] = isFray
          ? 0.65 + Math.random() * 1.35
          : 0.95 + Math.random() * 1.85; // grain size
        seeds[i * 4 + 2] = isFray ? 1.0 : 0.0; // fray flag
        seeds[i * 4 + 3] = Math.random(); // micro pigment jitter
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));

      const uniforms = {
        uTime: { value: 0 },
        uPixelRatio: { value: dpr },
        uPointer: { value: new THREE.Vector3(99, 99, 0) },
        uPointerStrength: { value: 0 },
        uScroll: { value: 0 },
        uShiftX: { value: isMobile ? 0.0 : 0.82 },
      };

      const vertexShader = /* glsl */ `
        attribute vec4 aSeed;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec3 uPointer;
        uniform float uPointerStrength;
        uniform float uScroll;
        uniform float uShiftX;

        varying vec3 vColor;
        varying float vAlpha;
        varying float vShade;

        // Compact 3D Simplex Noise
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

        // Approximate divergence-free curl displacement for organic churning
        vec3 curlFlow(vec3 p, float t) {
          float n1 = snoise(p * 0.72 + vec3(0.0, t, 0.0));
          float n2 = snoise(p * 0.72 + vec3(4.3, -t * 0.85, 2.1));
          float n3 = snoise(p * 0.72 + vec3(-3.1, 1.7, t * 0.7));
          return vec3(n2 - n3, n3 - n1, n1 - n2);
        }

        void main() {
          float t = uTime * 0.16;
          vec3 pos = position;

          // Slow sculptural rotation around Y and gentle X tilt
          float rotY = uTime * 0.055;
          float cY = cos(rotY);
          float sY = sin(rotY);
          pos.xz = mat2(cY, -sY, sY, cY) * pos.xz;

          // 3D curl-noise churning (stronger on loose fraying dust)
          vec3 flow = curlFlow(pos, t);
          float churnAmp = mix(0.26, 0.56, aSeed.z);
          pos += flow * churnAmp;

          // Subtle breathing pulse
          pos *= 1.0 + 0.03 * sin(uTime * 0.45 + aSeed.x);

          // Shift cloud slightly right on desktop to frame left-aligned editorial type
          pos.x += uShiftX;
          pos.y += uScroll * 0.55;
          pos.z -= uScroll * 0.9;

          // Cursor repulsion field (scatters grains cleanly aside)
          vec3 toGrain = pos - uPointer;
          float dist = length(toGrain.xy);
          float radius = 1.15;
          if (dist < radius && uPointerStrength > 0.001) {
            float push = pow(1.0 - dist / radius, 2.0) * 0.85 * uPointerStrength;
            vec2 dir = dist > 0.0001 ? normalize(toGrain.xy) : vec2(1.0, 0.0);
            pos.xy += dir * push;
            pos.z += push * 0.45;
          }

          // Marbled 3-pigment mineral field (Gold, Electric Violet, Glacial Blue)
          vec3 marbleCoord = position * 0.88 + flow * 0.65 + vec3(t * 0.35, -t * 0.2, 0.0);
          float mA = snoise(marbleCoord);
          float mB = snoise(marbleCoord * 1.35 + vec3(7.2, -3.4, 5.1));

          vec3 colGold   = vec3(0.93, 0.66, 0.17); // Molten ochre gold
          vec3 colViolet = vec3(0.49, 0.14, 0.94); // Electric mineral violet
          vec3 colBlue   = vec3(0.47, 0.72, 0.89); // Glacial slate blue
          vec3 colDark   = vec3(0.07, 0.05, 0.11); // Deep obsidian shadow core

          // Marbled veins blending between violet, gold, and glacial blue
          float wGold = smoothstep(-0.18, 0.48, mA);
          float wBlue = smoothstep(0.05, 0.62, mB) * (1.0 - wGold * 0.55);

          vec3 baseCol = mix(colViolet, colGold, wGold);
          baseCol = mix(baseCol, colBlue, wBlue);

          // Micro grain shimmer variation
          baseCol *= 0.86 + 0.28 * aSeed.w;

          // Upper-left key lighting + lower-right volumetric self-shadowing
          vec3 lightDir = normalize(vec3(-0.62, 0.68, 0.48));
          vec3 approxNormal = normalize(pos - vec3(uShiftX, 0.0, 0.0) + flow * 0.4);
          float ndl = dot(approxNormal, lightDir) * 0.5 + 0.5;
          float rim = pow(1.0 - clamp(abs(approxNormal.z), 0.0, 1.0), 1.8) * 0.35;
          float shade = smoothstep(0.14, 0.92, ndl) + rim;

          // Blend shadowed back/lower-right grains into dark obsidian core
          vColor = mix(colDark, baseCol, clamp(shade * 1.08, 0.08, 1.0));
          vShade = shade;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float perspectiveSize = (aSeed.y * 11.5 * uPixelRatio) / max(1.2, -mvPosition.z);
          gl_PointSize = clamp(perspectiveSize, 1.15, 5.8);

          // Fray dust particles are slightly more delicate
          vAlpha = mix(0.88, 0.55, aSeed.z) * smoothstep(0.02, 0.28, shade + 0.15);
        }
      `;

      const fragmentShader = /* glsl */ `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vShade;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;

          // Shaded spherical micro-bead falloff (not flat square sprites)
          float bead = smoothstep(0.5, 0.12, d);
          float highlight = smoothstep(0.32, 0.0, length(uv - vec2(-0.12, -0.12))) * 0.25 * vShade;

          gl_FragColor = vec4(vColor + highlight, bead * vAlpha);
        }
      `;

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const targetPointer = new THREE.Vector3(99, 99, 0);
      let pointerActive = 0;
      let scrollP = 0;
      let visible = true;

      const onPointerMove = (e) => {
        const rect = container.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        // Project normalized pointer into the z=0 world plane
        const vFov = (camera.fov * Math.PI) / 180;
        const planeH = 2 * Math.tan(vFov / 2) * camera.position.z;
        const planeW = planeH * camera.aspect;
        targetPointer.set(nx * (planeW * 0.5), ny * (planeH * 0.5), 0);
        pointerActive = 1;
      };

      const onPointerLeave = () => {
        pointerActive = 0;
      };

      const onScroll = () => {
        scrollP = Math.min(1.4, Math.max(0, window.scrollY / window.innerHeight));
      };

      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        uniforms.uShiftX.value = w < 768 ? 0.0 : 0.82;
      };

      const obs = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { rootMargin: "200px" }
      );
      obs.observe(container);

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      container.addEventListener("pointerleave", onPointerLeave, { passive: true });
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

        uniforms.uPointer.value.lerp(targetPointer, 0.1);
        uniforms.uPointerStrength.value +=
          (pointerActive - uniforms.uPointerStrength.value) * 0.08;
        uniforms.uScroll.value += (scrollP - uniforms.uScroll.value) * 0.08;

        renderer.render(scene, camera);
      };

      animate();

      teardown = () => {
        cancelAnimationFrame(raf);
        obs.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerLeave);
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

  return <div ref={hostRef} className="v3GrainCanvas" aria-hidden="true" />;
}
