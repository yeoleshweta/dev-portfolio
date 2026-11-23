"use client";
import { useEffect, useRef } from "react";

/**
 * Full-bleed Cinematic 3D Architectural Monolith & Glass-Prism Sanctuary.
 * Built with Three.js + RoomEnvironment IBL, refractive glass core, machined
 * gyroscopic titanium rings, subtle neural constellation filaments, reflective
 * obsidian floor plane, smooth camera dolly-in, pointer crane parallax,
 * interactive camera-angle presets, and scroll-driven fly-through.
 */
export function Cinematic3DHero({ cameraPreset = 0 }) {
  const hostRef = useRef(null);
  const presetRef = useRef(cameraPreset);

  useEffect(() => {
    presetRef.current = cameraPreset;
  }, [cameraPreset]);

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
      scene.fog = new THREE.FogExp2("#050608", 0.068);

      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      // Start far back for cinematic dolly-in on load
      camera.position.set(0, 1.4, reduced ? 6.6 : 11.5);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      container.appendChild(renderer.domElement);

      // Realistic studio IBL reflections
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      // Cinematic 3-point + floor bounce lighting
      const keyLight = new THREE.DirectionalLight("#fff0da", 2.8);
      keyLight.position.set(5, 7, 5);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight("#3b6bff", 3.6);
      rimLight.position.set(-6, 2.5, -4);
      scene.add(rimLight);

      const accentLight = new THREE.PointLight("#6b96ff", 6.5, 16, 1.6);
      accentLight.position.set(0, 0.2, 0);
      scene.add(accentLight);

      const warmBounce = new THREE.PointLight("#ffcf9e", 2.4, 12, 1.8);
      warmBounce.position.set(3.2, -1.6, 2.5);
      scene.add(warmBounce);

      const disposables = [envTex];
      const monolith = new THREE.Group();
      monolith.position.y = 0.25;
      scene.add(monolith);

      // 1. Inner Refractive Glass-Prism Neural Core
      const coreGeo = new THREE.IcosahedronGeometry(1.12, 1);
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#dbe6ff"),
        metalness: 0.08,
        roughness: 0.06,
        transmission: 0.92,
        thickness: 2.2,
        ior: 1.54,
        iridescence: 0.85,
        iridescenceIOR: 1.38,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        envMapIntensity: 1.6,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      monolith.add(coreMesh);
      disposables.push(coreGeo, coreMat);

      // Inner incandescent architectural wireframe crystal
      const innerGeo = new THREE.OctahedronGeometry(0.62, 0);
      const innerMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#111728"),
        emissive: new THREE.Color("#2b56e6"),
        emissiveIntensity: 1.4,
        metalness: 0.9,
        roughness: 0.2,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      monolith.add(innerMesh);
      disposables.push(innerGeo, innerMat);

      // Crisp faceted crystal edge cage
      const cageGeo = new THREE.EdgesGeometry(coreGeo);
      const cageMat = new THREE.LineBasicMaterial({
        color: "#a7c0ff",
        transparent: true,
        opacity: 0.35,
      });
      const cage = new THREE.LineSegments(cageGeo, cageMat);
      cage.scale.setScalar(1.015);
      monolith.add(cage);
      disposables.push(cageGeo, cageMat);

      // 2. Three Precision-Machined Concentric Gyroscopic Rings
      const titaniumMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1c22"),
        metalness: 0.94,
        roughness: 0.16,
        envMapIntensity: 1.8,
      });
      const champagneMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#cfc2a8"),
        metalness: 0.92,
        roughness: 0.2,
        envMapIntensity: 1.5,
      });
      const cobaltRingMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#2448c4"),
        emissive: new THREE.Color("#16318f"),
        emissiveIntensity: 0.55,
        metalness: 0.85,
        roughness: 0.22,
      });
      disposables.push(titaniumMat, champagneMat, cobaltRingMat);

      const ring1Geo = new THREE.TorusGeometry(1.75, 0.048, 32, 160);
      const ring1 = new THREE.Mesh(ring1Geo, titaniumMat);
      ring1.rotation.set(Math.PI * 0.36, Math.PI * 0.12, 0);
      monolith.add(ring1);

      const ring2Geo = new THREE.TorusGeometry(2.18, 0.024, 24, 180);
      const ring2 = new THREE.Mesh(ring2Geo, champagneMat);
      ring2.rotation.set(-Math.PI * 0.28, Math.PI * 0.24, Math.PI * 0.15);
      monolith.add(ring2);

      const ring3Geo = new THREE.TorusGeometry(2.62, 0.016, 20, 200);
      const ring3 = new THREE.Mesh(ring3Geo, cobaltRingMat);
      ring3.rotation.set(Math.PI * 0.48, -Math.PI * 0.1, 0);
      monolith.add(ring3);

      disposables.push(ring1Geo, ring2Geo, ring3Geo);

      // 3. Architectural Orbital Constellation (140 depth-sorted luminous nodes + neural filaments)
      const nodeCount = 140;
      const nodePositions = new Float32Array(nodeCount * 3);
      const nodeVectors = [];
      for (let i = 0; i < nodeCount; i++) {
        const radius = 3.1 + Math.random() * 3.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi) * 0.62;
        const z = radius * Math.sin(phi) * Math.sin(theta);
        nodePositions[i * 3] = x;
        nodePositions[i * 3 + 1] = y;
        nodePositions[i * 3 + 2] = z;
        nodeVectors.push(new THREE.Vector3(x, y, z));
      }

      const nodesGeo = new THREE.BufferGeometry();
      nodesGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
      const nodesMat = new THREE.PointsMaterial({
        color: "#cfdfff",
        size: 0.045,
        transparent: true,
        opacity: 0.72,
      });
      const constellation = new THREE.Points(nodesGeo, nodesMat);
      monolith.add(constellation);
      disposables.push(nodesGeo, nodesMat);

      // Connect close neighbors with gossamer neural filaments
      const lineCoords = [];
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          if (nodeVectors[i].distanceTo(nodeVectors[j]) < 1.55) {
            lineCoords.push(
              nodeVectors[i].x, nodeVectors[i].y, nodeVectors[i].z,
              nodeVectors[j].x, nodeVectors[j].y, nodeVectors[j].z
            );
          }
        }
      }
      const filamentsGeo = new THREE.BufferGeometry();
      filamentsGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(lineCoords, 3)
      );
      const filamentsMat = new THREE.LineBasicMaterial({
        color: "#6c8eff",
        transparent: true,
        opacity: 0.14,
      });
      const filaments = new THREE.LineSegments(filamentsGeo, filamentsMat);
      monolith.add(filaments);
      disposables.push(filamentsGeo, filamentsMat);

      // 4. Grounded Reflective Obsidian Floor Plane + Subtle Concentric Architectural Rings
      const floorGeo = new THREE.PlaneGeometry(42, 42);
      const floorMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#07080b"),
        metalness: 0.82,
        roughness: 0.24,
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -2.45;
      scene.add(floor);
      disposables.push(floorGeo, floorMat);

      [2.8, 4.6, 6.8].forEach((r, idx) => {
        const g = new THREE.RingGeometry(r - 0.012, r + 0.012, 128);
        const m = new THREE.MeshBasicMaterial({
          color: "#9db4ff",
          transparent: true,
          opacity: 0.14 - idx * 0.035,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(g, m);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = -2.43;
        scene.add(ring);
        disposables.push(g, m);
      });

      // Interactive camera crane + drag + scroll dive state
      const presets = [
        { x: 0.0, y: 0.45, z: 6.5, lookY: 0.1 },   // 01 CORE (Heroic center)
        { x: 2.8, y: -1.1, z: 5.4, lookY: 0.35 },  // 02 ORBIT (Low dramatic angle)
        { x: -1.4, y: 3.6, z: 5.2, lookY: 0.0 },   // 03 TOPOLOGY (Elevated architectural view)
      ];

      let mx = 0;
      let my = 0;
      let scrollP = 0;
      let dragging = false;
      let dragStart = { x: 0, y: 0 };
      let dragYaw = 0;
      let dragPitch = 0;
      let visible = true;

      const onPointerMove = (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
        if (dragging) {
          dragYaw += (e.clientX - dragStart.x) * 0.005;
          dragPitch = Math.max(-0.6, Math.min(0.6, dragPitch + (e.clientY - dragStart.y) * 0.004));
          dragStart = { x: e.clientX, y: e.clientY };
        }
      };

      const onPointerDown = (e) => {
        if (e.button !== 0 || e.target.closest?.("a, button")) return;
        dragging = true;
        dragStart = { x: e.clientX, y: e.clientY };
      };

      const onPointerUp = () => {
        dragging = false;
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
      container.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);

      const clock = new THREE.Clock();
      const lookTarget = new THREE.Vector3(0, 0.1, 0);
      let raf = 0;

      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (!visible || document.hidden) return;

        const t = reduced ? 0 : clock.getElapsedTime();
        const p = presets[presetRef.current] || presets[0];

        // Smooth camera crane + scroll fly-through
        const targetX = p.x + mx * 0.95;
        const targetY = p.y - my * 0.55 - scrollP * 0.7;
        const targetZ = p.z - scrollP * 3.1;

        camera.position.x += (targetX - camera.position.x) * 0.045;
        camera.position.y += (targetY - camera.position.y) * 0.045;
        camera.position.z += (targetZ - camera.position.z) * 0.045;

        lookTarget.y += (p.lookY - scrollP * 0.35 - lookTarget.y) * 0.06;
        camera.lookAt(lookTarget);

        // Sculptural gyroscopic choreography
        coreMesh.rotation.y = t * 0.18 + dragYaw;
        coreMesh.rotation.x = Math.sin(t * 0.25) * 0.22 + dragPitch;
        cage.rotation.copy(coreMesh.rotation);

        innerMesh.rotation.y = -t * 0.35 + dragYaw;
        innerMesh.rotation.z = t * 0.22;

        ring1.rotation.z = t * 0.22;
        ring1.rotation.y = Math.PI * 0.12 + t * 0.09 + dragYaw * 0.6;

        ring2.rotation.x = -Math.PI * 0.28 + Math.sin(t * 0.3) * 0.18 + dragPitch * 0.5;
        ring2.rotation.z = Math.PI * 0.15 - t * 0.16;

        ring3.rotation.y = -Math.PI * 0.1 + t * 0.12;
        ring3.rotation.x = Math.PI * 0.48 + Math.cos(t * 0.22) * 0.12;

        constellation.rotation.y = t * 0.045 + dragYaw * 0.25;
        filaments.rotation.y = constellation.rotation.y;

        monolith.position.y = 0.25 + Math.sin(t * 0.75) * 0.09;
        accentLight.intensity = 6.0 + Math.sin(t * 1.4) * 1.2;

        renderer.render(scene, camera);
      };

      animate();

      teardown = () => {
        cancelAnimationFrame(raf);
        obs.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
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

  return <div ref={hostRef} className="cinema3dCanvas" data-cursor="ORBIT" />;
}
