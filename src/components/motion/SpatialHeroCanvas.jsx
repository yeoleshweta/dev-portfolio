"use client";
import { useEffect, useRef } from "react";

/**
 * Full-bleed Three.js 3D Spatial Exhibition Ring.
 * Orbits 6 architectural project plates in 3D space around the hero camera.
 * Pointer movement glides the camera with spring-damped parallax; vertical scroll
 * smoothly flies the camera forward through the ring into the next act.
 */
function makeEditorialTexture(THREE, { code, title, sub, bg, accent }) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 900, 600);

  // Architectural hairline grid
  ctx.strokeStyle = "rgba(243, 239, 231, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 60; x < 900; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 600);
    ctx.stroke();
  }
  for (let y = 60; y < 600; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(900, y);
    ctx.stroke();
  }

  // Border frame
  ctx.strokeStyle = "rgba(243, 239, 231, 0.22)";
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, 852, 552);

  // Code eyebrow
  ctx.fillStyle = accent;
  ctx.font = "500 18px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(code, 56, 84);

  // Title
  ctx.fillStyle = "#f3efe7";
  ctx.font = "500 62px 'Helvetica Neue', Avenir, sans-serif";
  ctx.fillText(title, 56, 310);

  // Subtitle
  ctx.fillStyle = "rgba(243, 239, 231, 0.65)";
  ctx.font = "italic 30px Georgia, serif";
  ctx.fillText(sub, 56, 368);

  // Accent rule
  ctx.fillStyle = accent;
  ctx.fillRect(56, 510, 120, 3);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function SpatialHeroCanvas() {
  const hostRef = useRef(null);

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed || !hostRef.current) return;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0d0d0c, 0.055);

      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0.15, 7.6);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      container.appendChild(renderer.domElement);

      const ringGroup = new THREE.Group();
      scene.add(ringGroup);

      const loader = new THREE.TextureLoader();

      const plateConfigs = [
        { type: "image", src: "/urbanfit.jpg", y: 0.55 },
        {
          type: "canvas",
          code: "01 / HEALTHCARE AI",
          title: "Bias Checker",
          sub: "RoBERTa + LoRA · GPT-4o · Flask",
          bg: "#15161a",
          accent: "#8aa4ff",
          y: -0.45,
        },
        { type: "image", src: "/gesturepro.jpg", y: 0.35 },
        {
          type: "canvas",
          code: "04 / FORECASTING",
          title: "PocketSaver",
          sub: "Next.js · Node · Postgres · Python",
          bg: "#141816",
          accent: "#d1c19c",
          y: -0.5,
        },
        { type: "image", src: "/abim.jpg", y: 0.45 },
        { type: "image", src: "/mountains.jpg", y: -0.35 },
      ];

      const radius = 5.4;
      const planeGeo = new THREE.PlaneGeometry(2.55, 1.65, 16, 16);
      const borderGeo = new THREE.EdgesGeometry(planeGeo);
      const borderMat = new THREE.LineBasicMaterial({
        color: 0xf3efe7,
        transparent: true,
        opacity: 0.24,
      });

      const disposables = [planeGeo, borderGeo, borderMat];
      const meshes = [];

      plateConfigs.forEach((cfg, idx) => {
        const angle = (idx / plateConfigs.length) * Math.PI * 2 + 0.35;
        let tex;
        if (cfg.type === "image") {
          tex = loader.load(cfg.src);
          tex.colorSpace = THREE.SRGBColorSpace;
        } else {
          tex = makeEditorialTexture(THREE, cfg);
        }
        disposables.push(tex);

        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.88,
          side: THREE.DoubleSide,
        });
        disposables.push(mat);

        const holder = new THREE.Group();
        const mesh = new THREE.Mesh(planeGeo, mat);
        const border = new THREE.LineSegments(borderGeo, borderMat);
        holder.add(mesh);
        holder.add(border);

        holder.position.set(
          Math.cos(angle) * radius,
          cfg.y,
          Math.sin(angle) * radius - 1.2
        );
        holder.lookAt(0, cfg.y * 0.4, 2.2);

        ringGroup.add(holder);
        meshes.push({ holder, baseY: cfg.y, phase: idx * 1.1 });
      });

      // Subtle architectural horizon meridian
      const meridianGeo = new THREE.RingGeometry(radius - 0.015, radius + 0.015, 128);
      const meridianMat = new THREE.MeshBasicMaterial({
        color: 0xf3efe7,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
      });
      const meridian = new THREE.Mesh(meridianGeo, meridianMat);
      meridian.rotation.x = Math.PI / 2;
      meridian.position.y = -1.35;
      ringGroup.add(meridian);
      disposables.push(meridianGeo, meridianMat);

      let mx = 0;
      let my = 0;
      let scrollRatio = 0;
      let visible = true;

      const onPointerMove = (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      };

      const onScroll = () => {
        scrollRatio = Math.min(1.4, Math.max(0, window.scrollY / window.innerHeight));
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

      const render = () => {
        raf = requestAnimationFrame(render);
        if (!visible || document.hidden) return;

        const t = reduced ? 0 : clock.getElapsedTime();

        // Gentle orbital rotation + scroll acceleration
        ringGroup.rotation.y = t * 0.075 + scrollRatio * 0.95;

        // Smooth camera parallax + scroll zoom-through
        const targetCamX = mx * 0.85;
        const targetCamY = 0.15 - my * 0.45;
        const targetCamZ = 7.6 - scrollRatio * 3.4;

        camera.position.x += (targetCamX - camera.position.x) * 0.045;
        camera.position.y += (targetCamY - camera.position.y) * 0.045;
        camera.position.z += (targetCamZ - camera.position.z) * 0.06;
        camera.lookAt(0, 0, -1.2);

        meshes.forEach(({ holder, baseY, phase }) => {
          holder.position.y = baseY + Math.sin(t * 0.65 + phase) * 0.12;
        });

        renderer.render(scene, camera);
      };

      render();

      cleanup = () => {
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
      cleanup();
    };
  }, []);

  return <div ref={hostRef} className="spatialHeroCanvas" aria-hidden="true" />;
}
