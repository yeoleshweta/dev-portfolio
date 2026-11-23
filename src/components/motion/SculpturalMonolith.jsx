"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Studio-lit Three.js physical sculpture using RoomEnvironment IBL.
 * Responds to pointer inertia, click-and-drag inspection, and vertical scroll.
 */
export function SculpturalMonolith() {
  const hostRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let disposed = false;
    let teardown = () => {};

    Promise.all([
      import("three"),
      import("three/examples/jsm/environments/RoomEnvironment.js"),
    ])
      .then(([THREE, { RoomEnvironment }]) => {
        if (disposed || !hostRef.current) return;

        const width = container.clientWidth || 640;
        const height = container.clientHeight || 640;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
        camera.position.set(0, 0, 5.4);

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        container.appendChild(renderer.domElement);

        // Procedural studio IBL environment for realistic ceramic/chrome reflections
        const pmrem = new THREE.PMREMGenerator(renderer);
        const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envTex;

        // Soft studio key + warm rim + cool fill
        const keyLight = new THREE.DirectionalLight(0xfffaf0, 2.2);
        keyLight.position.set(4, 5, 5);
        scene.add(keyLight);

        const rimLight = new THREE.DirectionalLight(0x2854d8, 1.8);
        rimLight.position.set(-5, -2, -3);
        scene.add(rimLight);

        const group = new THREE.Group();
        scene.add(group);

        // Primary organic sculptural form: brushed obsidian-ceramic Mobius knot
        const knotGeo = new THREE.TorusKnotGeometry(1.08, 0.27, 240, 48, 2, 3);
        const knotMat = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#1c1b19"),
          metalness: 0.78,
          roughness: 0.18,
          clearcoat: 1.0,
          clearcoatRoughness: 0.08,
          iridescence: 0.45,
          iridescenceIOR: 1.35,
          envMapIntensity: 1.4,
        });
        const knotMesh = new THREE.Mesh(knotGeo, knotMat);
        group.add(knotMesh);

        // Delicate architectural orbital ring in archival cobalt-steel
        const ringGeo = new THREE.TorusGeometry(1.92, 0.014, 24, 140);
        const ringMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#1b3b99"),
          metalness: 0.85,
          roughness: 0.25,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI * 0.34;
        ringMesh.rotation.y = Math.PI * 0.14;
        group.add(ringMesh);

        // Secondary hair-thin warm brass meridian
        const ring2Geo = new THREE.TorusGeometry(1.62, 0.008, 16, 120);
        const ring2Mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#b8a88a"),
          metalness: 0.9,
          roughness: 0.2,
        });
        const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
        ring2Mesh.rotation.x = -Math.PI * 0.42;
        ring2Mesh.rotation.z = Math.PI * 0.22;
        group.add(ring2Mesh);

        // Spring-damped pointer & drag state
        let targetRotX = 0.25;
        let targetRotY = -0.35;
        let currentRotX = targetRotX;
        let currentRotY = targetRotY;
        let pointerX = 0;
        let pointerY = 0;
        let isDragging = false;
        let dragStart = { x: 0, y: 0 };
        let dragOffset = { x: 0, y: 0 };
        let scrollRatio = 0;
        let visible = true;

        const onPointerMove = (e) => {
          pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
          pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
          if (isDragging) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            dragOffset.y += dx * 0.006;
            dragOffset.x += dy * 0.006;
            dragStart = { x: e.clientX, y: e.clientY };
          }
        };

        const onPointerDown = (e) => {
          if (e.button !== 0) return;
          isDragging = true;
          dragStart = { x: e.clientX, y: e.clientY };
          container.dataset.dragging = "true";
        };

        const onPointerUp = () => {
          isDragging = false;
          delete container.dataset.dragging;
        };

        const onScroll = () => {
          scrollRatio = Math.min(1.5, Math.max(0, window.scrollY / window.innerHeight));
        };

        const onResize = () => {
          if (!container) return;
          const w = container.clientWidth || 640;
          const h = container.clientHeight || 640;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };

        const observer = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
          },
          { rootMargin: "200px" }
        );
        observer.observe(container);

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        container.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);

        const clock = new THREE.Clock();
        let raf = 0;

        const renderFrame = () => {
          raf = requestAnimationFrame(renderFrame);
          if (!visible || document.hidden) return;

          const t = reduced ? 0 : clock.getElapsedTime();

          targetRotY = -0.35 + pointerX * 0.35 + dragOffset.y + t * 0.14 + scrollRatio * 1.4;
          targetRotX = 0.25 + pointerY * 0.22 + dragOffset.x + Math.sin(t * 0.4) * 0.08 + scrollRatio * 0.5;

          currentRotX += (targetRotX - currentRotX) * 0.065;
          currentRotY += (targetRotY - currentRotY) * 0.065;

          group.rotation.x = currentRotX;
          group.rotation.y = currentRotY;

          // Subtle scale & vertical drift as user scrolls past cover
          const s = 1 - Math.min(0.22, scrollRatio * 0.16);
          group.scale.setScalar(s);
          group.position.y = Math.sin(t * 0.7) * 0.06 - scrollRatio * 0.28;

          ringMesh.rotation.z = t * 0.08;
          ring2Mesh.rotation.y = -t * 0.12;

          renderer.render(scene, camera);
        };

        setReady(true);
        renderFrame();

        teardown = () => {
          cancelAnimationFrame(raf);
          observer.disconnect();
          window.removeEventListener("pointermove", onPointerMove);
          container.removeEventListener("pointerdown", onPointerDown);
          window.removeEventListener("pointerup", onPointerUp);
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onResize);
          knotGeo.dispose();
          knotMat.dispose();
          ringGeo.dispose();
          ringMat.dispose();
          ring2Geo.dispose();
          ring2Mat.dispose();
          envTex.dispose();
          pmrem.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch(() => setReady(false));

    return () => {
      disposed = true;
      teardown();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="monolithStage"
      data-ready={ready}
      data-cursor="SPIN"
      role="img"
      aria-label="Interactive 3D architectural sculpture"
    />
  );
}
