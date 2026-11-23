"use client";
import { useEffect, useRef } from "react";

/**
 * Subtle, atmospheric Cinematic 3D Background.
 * Positions the studio-lit glass-prism & titanium ring architecture deep in the
 * right-hand background with soft fog and gentle pointer/scroll parallax so
 * foreground typography remains the unmistakable focal point.
 */
export function Cinematic3DHero() {
  const hostRef = useRef(null);

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let disposed = false;
    let teardown = () => {};

    Promise.all([
      import("three"),
      import("three/examples/jsm/environments/RoomEnvironment.js"),
    ]).then(([THREE, { RoomEnvironment }]) => {
      if (disposed || !hostRef.current) return;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#050608");
      scene.fog = new THREE.FogExp2("#050608", 0.088);

      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(0, 0.35, 7.8);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      container.appendChild(renderer.domElement);

      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      const keyLight = new THREE.DirectionalLight("#fff0da", 2.0);
      keyLight.position.set(6, 7, 5);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight("#3b6bff", 2.8);
      rimLight.position.set(-5, 2, -4);
      scene.add(rimLight);

      const accentLight = new THREE.PointLight("#5a86ff", 4.2, 14, 1.8);
      accentLight.position.set(2.4, 0.2, -1.5);
      scene.add(accentLight);

      const disposables = [envTex];

      // Offset deep into the right background so foreground copy stays crystal clear
      const monolith = new THREE.Group();
      monolith.position.set(2.35, 0.1, -1.6);
      monolith.scale.setScalar(0.84);
      scene.add(monolith);

      const coreGeo = new THREE.IcosahedronGeometry(1.05, 1);
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#b8ccff"),
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.88,
        thickness: 2.0,
        ior: 1.5,
        iridescence: 0.65,
        clearcoat: 1.0,
        envMapIntensity: 1.2,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      monolith.add(coreMesh);
      disposables.push(coreGeo, coreMat);

      const cageGeo = new THREE.EdgesGeometry(coreGeo);
      const cageMat = new THREE.LineBasicMaterial({
        color: "#8aa4ff",
        transparent: true,
        opacity: 0.22,
      });
      const cage = new THREE.LineSegments(cageGeo, cageMat);
      cage.scale.setScalar(1.02);
      monolith.add(cage);
      disposables.push(cageGeo, cageMat);

      const titaniumMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#181b22"),
        metalness: 0.92,
        roughness: 0.2,
      });
      const cobaltRingMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#2448c4"),
        emissive: new THREE.Color("#16318f"),
        emissiveIntensity: 0.4,
        metalness: 0.85,
        roughness: 0.25,
      });
      disposables.push(titaniumMat, cobaltRingMat);

      const ring1Geo = new THREE.TorusGeometry(1.75, 0.036, 28, 150);
      const ring1 = new THREE.Mesh(ring1Geo, titaniumMat);
      ring1.rotation.set(Math.PI * 0.36, Math.PI * 0.12, 0);
      monolith.add(ring1);

      const ring2Geo = new THREE.TorusGeometry(2.35, 0.014, 20, 180);
      const ring2 = new THREE.Mesh(ring2Geo, cobaltRingMat);
      ring2.rotation.set(-Math.PI * 0.3, Math.PI * 0.2, 0);
      monolith.add(ring2);

      disposables.push(ring1Geo, ring2Geo);

      // Subtle atmospheric depth particles
      const nodeCount = 90;
      const nodePositions = new Float32Array(nodeCount * 3);
      for (let i = 0; i < nodeCount; i++) {
        nodePositions[i * 3] = (Math.random() - 0.35) * 14;
        nodePositions[i * 3 + 1] = (Math.random() - 0.5) * 7;
        nodePositions[i * 3 + 2] = -Math.random() * 7;
      }
      const nodesGeo = new THREE.BufferGeometry();
      nodesGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
      const nodesMat = new THREE.PointsMaterial({
        color: "#9db4ff",
        size: 0.032,
        transparent: true,
        opacity: 0.38,
      });
      const dust = new THREE.Points(nodesGeo, nodesMat);
      scene.add(dust);
      disposables.push(nodesGeo, nodesMat);

      // Grounded dark architectural plane
      const floorGeo = new THREE.PlaneGeometry(40, 40);
      const floorMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#06070a"),
        metalness: 0.8,
        roughness: 0.28,
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -2.6;
      scene.add(floor);
      disposables.push(floorGeo, floorMat);

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

        const t = reduced ? 0 : clock.getElapsedTime();

        camera.position.x += (mx * 0.45 - camera.position.x) * 0.04;
        camera.position.y += (0.35 - my * 0.28 - scrollP * 0.5 - camera.position.y) * 0.04;
        camera.position.z += (7.8 - scrollP * 2.2 - camera.position.z) * 0.05;
        camera.lookAt(0.4, 0, -1.6);

        coreMesh.rotation.y = t * 0.14;
        coreMesh.rotation.x = Math.sin(t * 0.2) * 0.18;
        cage.rotation.copy(coreMesh.rotation);

        ring1.rotation.z = t * 0.16;
        ring2.rotation.y = Math.PI * 0.2 + t * 0.1;
        dust.rotation.y = t * 0.02;

        monolith.position.y = 0.1 + Math.sin(t * 0.6) * 0.07;

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
        pmrem.dispose();
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
