"use client";
import { useEffect, useRef } from "react";

/**
 * Custom GLSL Liquid-Silk / Brushed-Obsidian Topographic Shader Hero.
 * Reacts smoothly to pointer position, velocity ripple, and scroll progress at 60fps.
 */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uMouseSpeed;
  uniform float uScroll;

  varying vec2 vUv;

  // Classic 2D simplex-style hash & value noise for silky organic folds
  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 1.95 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / max(1.0, uResolution.y);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 mouse = (uMouse - 0.5) * vec2(aspect, 1.0);

    float dist = length(p - mouse);
    float ripple = exp(-dist * 3.2) * (0.28 + uMouseSpeed * 0.45);
    vec2 push = normalize(p - mouse + 0.0001) * ripple * 0.16;

    float t = uTime * 0.16 + uScroll * 0.85;

    // Domain-warped liquid silk folds
    vec2 q = vec2(
      fbm(p * 1.4 + push + vec2(t * 0.6, -t * 0.4)),
      fbm(p * 1.4 - push + vec2(-t * 0.5, t * 0.7))
    );
    float h = fbm(p * 1.8 + 1.6 * q + vec2(t * 0.35, t * 0.25));

    // Compute pseudo-normal from height gradient for studio specular lighting
    float eps = 0.015;
    float hx = fbm((p + vec2(eps, 0.0)) * 1.8 + 1.6 * q + vec2(t * 0.35, t * 0.25));
    float hy = fbm((p + vec2(0.0, eps)) * 1.8 + 1.6 * q + vec2(t * 0.35, t * 0.25));
    vec3 normal = normalize(vec3((h - hx) * 18.0, (h - hy) * 18.0, 1.0));

    // Studio light directions: warm champagne key + archival cobalt rim
    vec3 lightKey = normalize(vec3(0.55 + mouse.x * 0.6, 0.65 - mouse.y * 0.5, 0.9));
    vec3 lightRim = normalize(vec3(-0.8, -0.4, 0.5));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);

    float diffKey = max(dot(normal, lightKey), 0.0);
    vec3 halfKey = normalize(lightKey + viewDir);
    float specKey = pow(max(dot(normal, halfKey), 0.0), 42.0);

    float diffRim = max(dot(normal, lightRim), 0.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

    // Base obsidian silk + champagne specular + deep cobalt edge iridescence
    vec3 baseCol = vec3(0.042, 0.042, 0.046);
    vec3 foldCol = vec3(0.11, 0.108, 0.118);
    vec3 champagne = vec3(0.95, 0.91, 0.84);
    vec3 cobalt = vec3(0.14, 0.30, 0.85);

    vec3 col = mix(baseCol, foldCol, smoothstep(-0.35, 0.55, h));
    col += cobalt * diffRim * 0.28;
    col += cobalt * fresnel * 0.42;
    col += champagne * diffKey * 0.12;
    col += champagne * specKey * 0.65;

    // Subtle cursor aura catchlight
    col += mix(cobalt, champagne, 0.5) * exp(-dist * 4.5) * (0.14 + uMouseSpeed * 0.18);

    // Subtle architectural vignette
    float vig = smoothstep(1.35, 0.22, length(p * vec2(0.75, 0.95)));
    col *= mix(0.62, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function ShaderHero() {
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
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      const uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width * renderer.getPixelRatio(), height * renderer.getPixelRatio()) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseSpeed: { value: 0 },
        uScroll: { value: 0 },
      };

      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        depthWrite: false,
        depthTest: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      let targetX = 0.5;
      let targetY = 0.5;
      let curX = 0.5;
      let curY = 0.5;
      let speed = 0;
      let scrollRatio = 0;
      let visible = true;

      const onPointerMove = (e) => {
        const nx = e.clientX / window.innerWidth;
        const ny = 1.0 - e.clientY / window.innerHeight;
        const delta = Math.hypot(nx - targetX, ny - targetY);
        speed = Math.min(1.5, speed + delta * 6.0);
        targetX = nx;
        targetY = ny;
      };

      const onScroll = () => {
        scrollRatio = Math.min(1.5, Math.max(0, window.scrollY / window.innerHeight));
      };

      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        renderer.setSize(w, h);
        const dpr = renderer.getPixelRatio();
        uniforms.uResolution.value.set(w * dpr, h * dpr);
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

        const dt = clock.getDelta();
        if (!reduced) uniforms.uTime.value += dt;

        curX += (targetX - curX) * 0.065;
        curY += (targetY - curY) * 0.065;
        speed *= 0.92;

        uniforms.uMouse.value.set(curX, curY);
        uniforms.uMouseSpeed.value = speed;
        uniforms.uScroll.value += (scrollRatio - uniforms.uScroll.value) * 0.08;

        renderer.render(scene, camera);
      };

      render();

      cleanup = () => {
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
      cleanup();
    };
  }, []);

  return <div ref={hostRef} className="shaderHeroBg" aria-hidden="true" />;
}
