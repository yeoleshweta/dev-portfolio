"use client";
import { useEffect, useRef } from "react";

/**
 * Orb-free Atmospheric 3D Architectural Horizon Background.
 * Renders a subtle, receding 3D perspective topographic mesh with fine hairline
 * grid contours and soft volumetric deep oxblood/champagne light sweeping across the
 * right side of the canvas. Reacts smoothly to pointer parallax and scroll.
 */
export function Cinematic3DHero() {
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
      scene.background = new THREE.Color("#050608");
      scene.fog = new THREE.FogExp2("#050608", 0.085);

      const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
      camera.position.set(0, 2.35, 7.6);
      camera.lookAt(0.6, -0.4, -3.0);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);

      const disposables = [];

      // 1. Undulating 3D Architectural Topographic Surface (Solid dark matte + crisp hairline wireframe)
      const segX = 64;
      const segY = 44;
      const terrainGeo = new THREE.PlaneGeometry(34, 24, segX, segY);
      terrainGeo.rotateX(-Math.PI / 2);

      const posAttr = terrainGeo.attributes.position;
      const basePositions = new Float32Array(posAttr.array.length);
      basePositions.set(posAttr.array);

      // Subtle shaded obsidian terrain
      const solidMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#090b10"),
        metalness: 0.72,
        roughness: 0.42,
        flatShading: false,
      });
      const terrainMesh = new THREE.Mesh(terrainGeo, solidMat);
      terrainMesh.position.set(1.2, -1.55, -2.5);
      scene.add(terrainMesh);

      // Crisp architectural hairline grid layered cleanly above the terrain
      const wireMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#8c1d35"),
        wireframe: true,
        transparent: true,
        opacity: 0.24,
      });
      const wireMesh = new THREE.Mesh(terrainGeo, wireMat);
      wireMesh.position.copy(terrainMesh.position);
      wireMesh.position.y += 0.015;
      scene.add(wireMesh);

      disposables.push(terrainGeo, solidMat, wireMat);

      // 2. Flowing Volumetric Light Ribbons (soft sweeping architectural lines along the horizon)
      const ribbonCount = 5;
      const ribbons = [];
      for (let r = 0; r < ribbonCount; r++) {
        const pts = [];
        const steps = 80;
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps - 0.35) * 24;
          pts.push(new THREE.Vector3(x, 0, -4.5 - r * 1.4));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({
          color: r % 2 === 0 ? "#c95b68" : "#e3d6c0",
          transparent: true,
          opacity: 0.34 - r * 0.042,
        });
        const line = new THREE.Line(geo, mat);
        line.position.y = -0.75 + r * 0.14;
        scene.add(line);
        ribbons.push({ line, geo, phase: r * 0.9, z: -4.5 - r * 1.4 });
        disposables.push(geo, mat);
      }

      // 3. Soft Cinematic Directional & Point Light Pools (sweeping across the 3D ridges)
      const burgundyLight = new THREE.PointLight("#781227", 14, 24, 1.5);
      burgundyLight.position.set(4.5, 1.8, -2.0);
      scene.add(burgundyLight);

      const champagneLight = new THREE.PointLight("#f0ddc0", 7, 22, 1.6);
      champagneLight.position.set(-2.5, 2.2, 1.0);
      scene.add(champagneLight);

      const rimLight = new THREE.DirectionalLight("#b84a5a", 1.1);
      rimLight.position.set(5, 6, -6);
      scene.add(rimLight);

      let mx = 0;
      let my = 0;
      let scrollP = 0;
      let visible = true;

      const onPointerMove = (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      const onScroll = () => {
        scrollP = Math.min(1.2, Math.max(0, window.scrollY / window.innerHeight));
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

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);

      const clock = new THREE.Clock();
      let raf = 0;

      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (!visible || document.hidden) return;

        const t = reduced ? 0 : clock.getElapsedTime() * 0.42;

        // Smooth architectural wave ridges across terrain
        for (let i = 0; i < posAttr.count; i++) {
          const bx = basePositions[i * 3];
          const bz = basePositions[i * 3 + 2];
          // Slightly taller ridges on the right half to frame the left-aligned typography
          const rightWeight = THREE.MathUtils.smoothstep(bx, -6, 9);
          const elevation =
            (Math.sin(bx * 0.28 + t) * Math.cos(bz * 0.26 - t * 0.7) * 0.95 +
              Math.sin((bx + bz) * 0.16 - t * 0.5) * 0.55) *
            (0.35 + rightWeight * 0.85);
          posAttr.setY(i, elevation);
        }
        posAttr.needsUpdate = true;
        terrainGeo.computeVertexNormals();

        // Animate soft horizon light ribbons
        ribbons.forEach(({ geo, phase }) => {
          const arr = geo.attributes.position;
          for (let i = 0; i < arr.count; i++) {
            const x = arr.getX(i);
            const y =
              Math.sin(x * 0.24 + t * 1.1 + phase) * 0.42 +
              Math.cos(x * 0.12 - t * 0.6 + phase) * 0.22;
            arr.setY(i, y);
          }
          arr.needsUpdate = true;
        });

        // Subtle pointer-reactive light sweep & camera glide
        burgundyLight.position.x = 4.2 + mx * 2.2;
        burgundyLight.position.z = -2.2 + my * 1.4;

        camera.position.x += (mx * 0.45 - camera.position.x) * 0.04;
        camera.position.y += (2.35 - my * 0.25 - scrollP * 0.65 - camera.position.y) * 0.04;
        camera.position.z += (7.6 - scrollP * 2.6 - camera.position.z) * 0.05;
        camera.lookAt(0.6, -0.45 - scrollP * 0.25, -3.0);

        renderer.render(scene, camera);
      };

      animate();

      teardown = () => {
        cancelAnimationFrame(raf);
        obs.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("scroll", onScroll);
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

  return <div ref={hostRef} className="cinema3dCanvas" aria-hidden="true" />;
}
