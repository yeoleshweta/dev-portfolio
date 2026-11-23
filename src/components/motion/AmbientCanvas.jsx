"use client";
import { useEffect, useRef } from "react";

export function AmbientCanvas() {
  const host = useRef(null);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !host.current) return;

    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed || !host.current) return;

      const container = host.current;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
      camera.position.set(0, 1.4, 5.2);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      const cols = 54;
      const rows = 32;
      const count = cols * rows;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const baseColor = new THREE.Color("#f4f1ea");
      const accentColor = new THREE.Color("#ff4d2e");

      let i = 0;
      for (let x = 0; x < cols; x++) {
        for (let z = 0; z < rows; z++) {
          const px = (x / (cols - 1) - 0.5) * 12;
          const pz = (z / (rows - 1) - 0.5) * 7;
          positions[i * 3] = px;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = pz;

          const mix = Math.max(0, 1 - Math.hypot(px * 0.22, pz * 0.3));
          const c = baseColor.clone().lerp(accentColor, mix * 0.65);
          colors[i * 3] = c.r;
          colors[i * 3 + 1] = c.g;
          colors[i * 3 + 2] = c.b;
          i++;
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.042,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
      });

      const points = new THREE.Points(geometry, material);
      points.rotation.x = 0.25;
      scene.add(points);

      let mx = 0;
      let my = 0;
      const onPointerMove = (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      let raf = 0;
      const clock = new THREE.Clock();
      const posAttr = geometry.attributes.position;

      const animate = () => {
        const t = clock.getElapsedTime() * 0.65;
        let idx = 0;
        for (let x = 0; x < cols; x++) {
          for (let z = 0; z < rows; z++) {
            const px = posAttr.getX(idx);
            const pz = posAttr.getZ(idx);
            const wave =
              Math.sin(px * 0.55 + t) * 0.24 +
              Math.cos(pz * 0.75 + t * 0.9) * 0.2;
            posAttr.setY(idx, wave);
            idx++;
          }
        }
        posAttr.needsUpdate = true;

        points.rotation.y += (mx * 0.14 - points.rotation.y) * 0.04;
        points.rotation.x += (0.24 + my * 0.08 - points.rotation.x) * 0.04;

        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("resize", onResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={host} className="ambientCanvasWrap" aria-hidden="true" />;
}
