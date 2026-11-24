"use client";
import { useEffect, useRef } from "react";

/**
 * AccretionCanvas — OriginKit-inspired Three.js WebGL Accretion Disc.
 * Renders a tilted relativistic plasma ring of swirling molten tungsten amber,
 * warm copper, and spectral bone-white filaments + orbital micro-dust around a
 * gravitational dark core. Reacts smoothly to pointer tilt and scroll depth.
 */
export function AccretionCanvas() {
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
      camera.position.set(0, 1.35, 6.2);
      camera.lookAt(0, -0.1, 0);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      renderer.setClearColor(0x0a0a0c, 1);
      container.appendChild(renderer.domElement);

      // Group so pointer parallax smoothly tilts the entire accretion system
      const rig = new THREE.Group();
      rig.position.set(isMobile ? 0 : 1.15, -0.12, 0);
      rig.rotation.x = 0.34;
      rig.rotation.z = -0.22;
      scene.add(rig);

      // 1. Volumetric Accretion Disc Shader Plane
      const discGeo = new THREE.PlaneGeometry(7.2, 7.2, 1, 1);
      discGeo.rotateX(-Math.PI / 2);

      const discUniforms = {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
      };

      const discVert = /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv * 2.0 - 1.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

      const discFrag = /* glsl */ `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uPointer;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p = rot * p * 2.04;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 p = vUv;
          float r = length(p);
          if (r > 1.0 || r < 0.22) discard;

          float angle = atan(p.y, p.x);
          // Differential Keplerian orbital swirl (inner ring spins faster)
          float swirl = angle + (1.85 / (r + 0.12)) - uTime * 0.42;

          vec2 polarCoord = vec2(cos(swirl) * r * 3.2, sin(swirl) * r * 3.2);
          float n1 = fbm(polarCoord + vec2(uTime * 0.14, -uTime * 0.1));
          float n2 = fbm(polarCoord * 2.1 - vec2(uTime * 0.22, uTime * 0.15));

          // Concentric filament bands
          float rings = sin(r * 34.0 - uTime * 1.4 + n1 * 5.2) * 0.5 + 0.5;
          float filaments = pow(clamp(n1 * 0.7 + n2 * 0.45 + rings * 0.32, 0.0, 1.0), 1.65);

          // Inner photon ring sharp glow + soft outer fade
          float innerEdge = smoothstep(0.22, 0.30, r);
          float outerEdge = smoothstep(1.0, 0.42, r);
          float photonRing = exp(-pow((r - 0.285) * 26.0, 2.0)) * 1.35;

          // Subtle Doppler beaming (brighter on approaching left-upper arc)
          float doppler = 0.72 + 0.42 * cos(angle + 2.35 + uPointer.x * 0.5);

          vec3 colCopper = vec3(0.68, 0.24, 0.12);
          vec3 colAmber  = vec3(0.96, 0.63, 0.22);
          vec3 colBone   = vec3(0.98, 0.94, 0.86);
          vec3 colIce    = vec3(0.72, 0.82, 0.92);

          vec3 col = mix(colCopper, colAmber, smoothstep(0.18, 0.68, filaments));
          col = mix(col, colBone, smoothstep(0.65, 1.0, filaments + photonRing * 0.55));
          col = mix(col, colIce, smoothstep(0.62, 0.95, r) * 0.28);

          float alpha = clamp((filaments * 0.95 + photonRing) * innerEdge * outerEdge * doppler, 0.0, 1.0);
          gl_FragColor = vec4(col * (0.9 + photonRing * 0.6), alpha * 0.92);
        }
      `;

      const discMat = new THREE.ShaderMaterial({
        vertexShader: discVert,
        fragmentShader: discFrag,
        uniforms: discUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const discMesh = new THREE.Mesh(discGeo, discMat);
      rig.add(discMesh);

      // 2. Dark Gravitational Core + Crisp Photon Halo Sphere
      const coreGeo = new THREE.SphereGeometry(0.92, 48, 48);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x070709 });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      rig.add(coreMesh);

      // 3. Orbital Micro-Dust Field (28,000 crisp golden/ice orbital particles)
      const DUST_COUNT = isMobile ? 12000 : 28000;
      const dustPos = new Float32Array(DUST_COUNT * 3);
      const dustAttr = new Float32Array(DUST_COUNT * 3); // [radius, angle, speed]

      for (let i = 0; i < DUST_COUNT; i++) {
        const radius = 1.08 + Math.pow(Math.random(), 1.35) * 3.1;
        const angle = Math.random() * Math.PI * 2;
        const thickness = (Math.random() - 0.5) * (0.08 + (radius - 1.0) * 0.14);
        dustPos[i * 3] = Math.cos(angle) * radius;
        dustPos[i * 3 + 1] = thickness;
        dustPos[i * 3 + 2] = Math.sin(angle) * radius;
        dustAttr[i * 3] = radius;
        dustAttr[i * 3 + 1] = angle;
        dustAttr[i * 3 + 2] = 0.22 / Math.pow(radius, 1.25);
      }

      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
      dustGeo.setAttribute("aOrbit", new THREE.BufferAttribute(dustAttr, 3));

      const dustUniforms = {
        uTime: { value: 0 },
        uPixelRatio: { value: dpr },
      };

      const dustVert = /* glsl */ `
        attribute vec3 aOrbit;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vHeat;
        varying float vAlpha;

        void main() {
          float r = aOrbit.x;
          float ang = aOrbit.y + uTime * aOrbit.z;
          vec3 pos = vec3(cos(ang) * r, position.y, sin(ang) * r);
          vHeat = smoothstep(3.8, 1.12, r);
          vAlpha = smoothstep(4.2, 1.2, r) * 0.72;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp((7.5 * uPixelRatio) / max(1.4, -mv.z), 1.0, 3.6);
        }
      `;

      const dustFrag = /* glsl */ `
        varying float vHeat;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float soft = smoothstep(0.5, 0.1, d);
          vec3 col = mix(vec3(0.72, 0.82, 0.92), vec3(0.98, 0.72, 0.34), vHeat);
          gl_FragColor = vec4(col, soft * vAlpha);
        }
      `;

      const dustMat = new THREE.ShaderMaterial({
        vertexShader: dustVert,
        fragmentShader: dustFrag,
        uniforms: dustUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const dustPoints = new THREE.Points(dustGeo, dustMat);
      rig.add(dustPoints);

      let mx = 0;
      let my = 0;
      let scrollP = 0;
      let visible = true;

      const onPointerMove = (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
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
        rig.position.x = w < 768 ? 0 : 1.15;
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
          const step = Math.min(dt, 0.05);
          discUniforms.uTime.value += step;
          dustUniforms.uTime.value += step;
        }

        discUniforms.uPointer.value.x += (mx - discUniforms.uPointer.value.x) * 0.06;
        discUniforms.uPointer.value.y += (my - discUniforms.uPointer.value.y) * 0.06;

        rig.rotation.x += (0.34 + my * 0.14 + scrollP * 0.25 - rig.rotation.x) * 0.05;
        rig.rotation.z += (-0.22 - mx * 0.14 - rig.rotation.z) * 0.05;
        rig.position.y += (-0.12 + scrollP * 0.7 - rig.position.y) * 0.06;

        renderer.render(scene, camera);
      };

      animate();

      teardown = () => {
        cancelAnimationFrame(raf);
        obs.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        discGeo.dispose();
        discMat.dispose();
        coreGeo.dispose();
        coreMat.dispose();
        dustGeo.dispose();
        dustMat.dispose();
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
