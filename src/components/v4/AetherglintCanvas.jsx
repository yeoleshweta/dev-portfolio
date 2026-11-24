"use client";
import { useEffect, useRef } from "react";

/**
 * AetherglintCanvas — OriginKit-inspired "Aetherglint" WebGL violet dusk meadow.
 * Renders a sloped violet twilight hillside with thousands of instanced grass blades
 * swaying in looping wind gusts, dark basalt rocks, small pink dusk flower clumps,
 * atmospheric depth haze, and grass that smoothly parts around the cursor.
 */
export function AetherglintCanvas() {
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
      scene.fog = new THREE.FogExp2(0x191228, 0.072);

      const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 80);
      camera.position.set(0, 2.25, 7.2);
      camera.lookAt(0.4, 0.55, -5.0);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      renderer.setClearColor(0x161024, 1);
      container.appendChild(renderer.domElement);

      const disposables = [];

      // Hillside height helper so grass, rocks, and flowers sit seamlessly on the slope
      const hillY = (x, z) =>
        Math.sin(x * 0.24 + 0.6) * 0.55 +
        Math.cos(z * 0.22) * 0.45 +
        (-z) * 0.14 -
        0.75;

      // 1. Dusk Violet Sky Gradient Backdrop
      const skyGeo = new THREE.PlaneGeometry(80, 36);
      const skyMat = new THREE.ShaderMaterial({
        depthWrite: false,
        uniforms: {},
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vec3 horizon = vec3(0.24, 0.14, 0.33);
            vec3 midSky  = vec3(0.11, 0.08, 0.20);
            vec3 zenith  = vec3(0.05, 0.04, 0.10);
            vec3 glow    = vec3(0.55, 0.26, 0.45) * exp(-pow((vUv.x - 0.72) * 2.4, 2.0)) * smoothstep(0.7, 0.22, vUv.y) * 0.42;
            vec3 col = mix(horizon, midSky, smoothstep(0.2, 0.58, vUv.y));
            col = mix(col, zenith, smoothstep(0.55, 0.95, vUv.y)) + glow;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      });
      const skyMesh = new THREE.Mesh(skyGeo, skyMat);
      skyMesh.position.set(0, 7.5, -24);
      scene.add(skyMesh);
      disposables.push(skyGeo, skyMat);

      // 2. Dark Violet-Earth Hillside Ground Mesh
      const groundGeo = new THREE.PlaneGeometry(34, 26, 64, 48);
      groundGeo.rotateX(-Math.PI / 2);
      const gPos = groundGeo.attributes.position;
      for (let i = 0; i < gPos.count; i++) {
        const gx = gPos.getX(i);
        const gz = gPos.getZ(i) - 4.0;
        gPos.setZ(i, gz);
        gPos.setY(i, hillY(gx, gz) - 0.05);
      }
      groundGeo.computeVertexNormals();
      const groundMat = new THREE.MeshStandardMaterial({
        color: 0x161022,
        roughness: 0.95,
        metalness: 0.05,
      });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      scene.add(ground);
      disposables.push(groundGeo, groundMat);

      // 3. Sculpted Dark Basalt Rocks nestled on the hillside
      const rockGeo = new THREE.DodecahedronGeometry(0.45, 1);
      const rockMat = new THREE.MeshStandardMaterial({
        color: 0x1e182c,
        roughness: 0.88,
        metalness: 0.08,
        flatShading: true,
      });
      const rockSpots = [
        [2.6, -1.6, 1.35, 0.65, 1.1],
        [-3.2, -3.4, 1.6, 0.72, 1.2],
        [4.8, -5.2, 1.9, 0.8, 1.4],
        [0.8, -4.6, 1.15, 0.55, 1.0],
        [-1.8, -0.8, 0.9, 0.45, 0.85],
        [6.2, -2.5, 1.4, 0.6, 1.1],
      ];
      rockSpots.forEach(([rx, rz, sx, sy, sz], i) => {
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.position.set(rx, hillY(rx, rz) + sy * 0.15, rz);
        rock.scale.set(sx, sy, sz);
        rock.rotation.set(i * 0.7, i * 1.3, i * 0.4);
        scene.add(rock);
      });
      disposables.push(rockGeo, rockMat);

      // Soft Dusk Lights for rocks & ground
      const hemi = new THREE.HemisphereLight(0x8862b8, 0x160f24, 1.1);
      scene.add(hemi);
      const duskKey = new THREE.DirectionalLight(0xe596c4, 1.25);
      duskKey.position.set(8, 9, -6);
      scene.add(duskKey);

      // 4. Instanced Wind-Blown Grass Blades (Parting around cursor!)
      const BLADE_COUNT = isMobile ? 9000 : 18000;
      const bladeGeo = new THREE.PlaneGeometry(0.055, 1.0, 1, 5);
      bladeGeo.translate(0, 0.5, 0);
      // Taper blade width smoothly to a fine tip
      const bPos = bladeGeo.attributes.position;
      for (let i = 0; i < bPos.count; i++) {
        const y = bPos.getY(i);
        const taper = Math.pow(1.0 - y, 0.75);
        bPos.setX(i, bPos.getX(i) * taper);
      }

      const offsets = new Float32Array(BLADE_COUNT * 3);
      const bladeParams = new Float32Array(BLADE_COUNT * 4); // [height, yaw, lean, colorVar]

      for (let i = 0; i < BLADE_COUNT; i++) {
        const x = (Math.random() - 0.5) * 24.0;
        const z = -Math.random() * 16.5 + 3.5;
        offsets[i * 3] = x;
        offsets[i * 3 + 1] = hillY(x, z);
        offsets[i * 3 + 2] = z;

        bladeParams[i * 4] = 0.55 + Math.random() * 0.95; // height
        bladeParams[i * 4 + 1] = Math.random() * Math.PI * 2; // yaw
        bladeParams[i * 4 + 2] = 0.15 + Math.random() * 0.35; // natural lean
        bladeParams[i * 4 + 3] = Math.random(); // hue shift
      }

      bladeGeo.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 3));
      bladeGeo.setAttribute("aParams", new THREE.InstancedBufferAttribute(bladeParams, 4));

      const grassUniforms = {
        uTime: { value: 0 },
        uCursor: { value: new THREE.Vector3(99, 0, 99) },
        uCursorActive: { value: 0 },
      };

      const grassMat = new THREE.ShaderMaterial({
        uniforms: grassUniforms,
        side: THREE.DoubleSide,
        vertexShader: /* glsl */ `
          attribute vec3 aOffset;
          attribute vec4 aParams;

          uniform float uTime;
          uniform vec3 uCursor;
          uniform float uCursorActive;

          varying float vY;
          varying float vGust;
          varying float vDepth;
          varying float vTint;

          void main() {
            float h = aParams.x;
            float yaw = aParams.y;
            float lean = aParams.z;
            vTint = aParams.w;
            vY = position.y;

            // Rotate blade around Y
            float cy = cos(yaw);
            float sy = sin(yaw);
            vec3 local = vec3(
              position.x * cy - position.z * sy,
              position.y * h,
              position.x * sy + position.z * cy
            );

            // Traveling looping wind gusts across the hillside
            float gustWave = sin(aOffset.x * 0.42 + aOffset.z * 0.28 - uTime * 1.75) * 0.5 + 0.5;
            float microFlutter = sin(aOffset.x * 1.9 - uTime * 3.8 + yaw) * 0.12;
            float bend = (lean + gustWave * 0.62 + microFlutter) * (vY * vY);

            local.x += bend * 0.72;
            local.z += bend * 0.28;
            local.y -= bend * 0.22;

            vec3 worldPos = aOffset + local;

            // Cursor parting field — radially pushes grass blades open around pointer
            vec2 toBlade = aOffset.xz - uCursor.xz;
            float dist = length(toBlade);
            float partRadius = 2.4;
            if (dist < partRadius && uCursorActive > 0.001) {
              float strength = pow(1.0 - dist / partRadius, 2.0) * uCursorActive * (vY * vY);
              vec2 dir = dist > 0.001 ? normalize(toBlade) : vec2(1.0, 0.0);
              worldPos.xz += dir * strength * 1.45;
              worldPos.y -= strength * 0.45;
            }

            vGust = gustWave;
            vec4 mv = modelViewMatrix * vec4(worldPos, 1.0);
            vDepth = -mv.z;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vY;
          varying float vGust;
          varying float vDepth;
          varying float vTint;

          void main() {
            // Deep plum-indigo base -> dusky violet mid -> soft lavender-pink wind-lit tips
            vec3 cBase = vec3(0.08, 0.05, 0.14);
            vec3 cMid  = mix(vec3(0.24, 0.17, 0.38), vec3(0.30, 0.19, 0.42), vTint);
            vec3 cTip  = mix(vec3(0.58, 0.44, 0.76), vec3(0.84, 0.54, 0.74), vGust * 0.65 + vTint * 0.35);

            vec3 col = mix(cBase, cMid, smoothstep(0.0, 0.55, vY));
            col = mix(col, cTip, smoothstep(0.45, 1.0, vY));

            // Atmospheric dusk violet depth haze
            float fogFactor = 1.0 - exp(-pow(vDepth * 0.068, 2.0));
            vec3 fogCol = vec3(0.11, 0.08, 0.18);
            col = mix(col, fogCol, clamp(fogFactor, 0.0, 0.92));

            gl_FragColor = vec4(col, 1.0);
          }
        `,
      });

      const grassMesh = new THREE.InstancedMesh(bladeGeo, grassMat, BLADE_COUNT);
      grassMesh.frustumCulled = false;
      scene.add(grassMesh);
      disposables.push(bladeGeo, grassMat);

      // 5. Small Glowing Pink Dusk Flower Clumps nestled in the meadow
      const FLOWER_COUNT = isMobile ? 220 : 480;
      const flowerPos = new Float32Array(FLOWER_COUNT * 3);
      const flowerSeed = new Float32Array(FLOWER_COUNT * 2);
      const clumpCenters = [
        [2.2, -1.2], [-2.5, -2.8], [4.1, -4.4], [-0.4, -3.5], [1.4, -5.8],
        [5.5, -2.0], [-4.2, -5.0], [3.0, -7.2], [-1.2, -1.4],
      ];
      for (let i = 0; i < FLOWER_COUNT; i++) {
        const [cx, cz] = clumpCenters[i % clumpCenters.length];
        const fx = cx + (Math.random() - 0.5) * 2.1;
        const fz = cz + (Math.random() - 0.5) * 2.1;
        flowerPos[i * 3] = fx;
        flowerPos[i * 3 + 1] = hillY(fx, fz) + 0.52 + Math.random() * 0.35;
        flowerPos[i * 3 + 2] = fz;
        flowerSeed[i * 2] = Math.random() * 6.28;
        flowerSeed[i * 2 + 1] = Math.random();
      }

      const flowerGeo = new THREE.BufferGeometry();
      flowerGeo.setAttribute("position", new THREE.BufferAttribute(flowerPos, 3));
      flowerGeo.setAttribute("aSeed", new THREE.BufferAttribute(flowerSeed, 2));

      const flowerMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: grassUniforms.uTime,
          uPixelRatio: { value: dpr },
        },
        transparent: true,
        depthWrite: false,
        vertexShader: /* glsl */ `
          attribute vec2 aSeed;
          uniform float uTime;
          uniform float uPixelRatio;
          varying float vHue;
          varying float vDepth;
          void main() {
            vec3 p = position;
            float sway = sin(p.x * 0.42 + p.z * 0.28 - uTime * 1.75) * 0.24;
            p.x += sway;
            vHue = aSeed.y;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            vDepth = -mv.z;
            gl_Position = projectionMatrix * mv;
            gl_PointSize = clamp((24.0 * (0.7 + aSeed.y * 0.5) * uPixelRatio) / max(1.8, -mv.z), 2.0, 8.5);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vHue;
          varying float vDepth;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float petal = smoothstep(0.5, 0.14, d);
            vec3 col = mix(vec3(0.95, 0.48, 0.72), vec3(1.0, 0.76, 0.88), vHue);
            float fog = 1.0 - exp(-pow(vDepth * 0.068, 2.0));
            col = mix(col, vec3(0.14, 0.09, 0.22), clamp(fog, 0.0, 0.85));
            gl_FragColor = vec4(col, petal * 0.92);
          }
        `,
      });
      const flowers = new THREE.Points(flowerGeo, flowerMat);
      scene.add(flowers);
      disposables.push(flowerGeo, flowerMat);

      // Raycast pointer onto the hillside plane for accurate grass parting
      const raycaster = new THREE.Raycaster();
      const pointerNdc = new THREE.Vector2(99, 99);
      const hitPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.5);
      const targetCursor = new THREE.Vector3(99, 0, 99);
      let cursorTargetActive = 0;
      let visible = true;

      const onPointerMove = (e) => {
        const rect = container.getBoundingClientRect();
        pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerNdc.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        raycaster.setFromCamera(pointerNdc, camera);
        raycaster.ray.intersectPlane(hitPlane, targetCursor);
        cursorTargetActive = 1;
      };
      const onPointerLeave = () => {
        cursorTargetActive = 0;
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
      window.addEventListener("resize", onResize);

      const clock = new THREE.Clock();
      let raf = 0;

      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (!visible || document.hidden) return;

        const dt = Math.min(clock.getDelta(), 0.05);
        if (!reduced) {
          grassUniforms.uTime.value += dt;
        }
        grassUniforms.uCursor.value.lerp(targetCursor, 0.14);
        grassUniforms.uCursorActive.value +=
          (cursorTargetActive - grassUniforms.uCursorActive.value) * 0.08;

        renderer.render(scene, camera);
      };

      animate();

      teardown = () => {
        cancelAnimationFrame(raf);
        obs.disconnect();
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerLeave);
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
  }, []);

  return <div ref={hostRef} className="v4CanvasHost" aria-hidden="true" />;
}
