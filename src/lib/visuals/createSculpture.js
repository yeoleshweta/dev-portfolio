import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// One continuous ribbon, swept along a trefoil. Two morph targets unfold the
// same topology into a halo and a rising coil; no downloaded 3D assets.
function ribbonGeometry(mode) {
  const segments = 360,
    sides = 12;
  const curvePoints = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    if (mode === 0)
      curvePoints.push(
        new THREE.Vector3(
          (1.22 + 0.42 * Math.cos(3 * t)) * Math.cos(2 * t),
          (1.22 + 0.42 * Math.cos(3 * t)) * Math.sin(2 * t),
          0.52 * Math.sin(3 * t),
        ),
      );
    else if (mode === 1)
      curvePoints.push(
        new THREE.Vector3(
          1.35 * Math.cos(t),
          1.35 * Math.sin(t),
          0.32 * Math.sin(3 * t),
        ),
      );
    else
      curvePoints.push(
        new THREE.Vector3(
          1.1 * Math.cos(t * 2.6),
          (i / segments - 0.5) * 2.6,
          1.1 * Math.sin(t * 2.6),
        ),
      );
  }
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  const frames = curve.computeFrenetFrames(segments, mode !== 2);
  const positions = [],
    indices = [];
  for (let i = 0; i <= segments; i++) {
    const center = curvePoints[i],
      twist = (i / segments) * Math.PI * 2;
    const normal = frames.normals[i],
      binormal = frames.binormals[i];
    for (let j = 0; j <= sides; j++) {
      const a = (j / sides) * Math.PI * 2;
      const wide = Math.cos(a) * 0.245,
        thin = Math.sin(a) * 0.055;
      const u = wide * Math.cos(twist) - thin * Math.sin(twist),
        v = wide * Math.sin(twist) + thin * Math.cos(twist);
      positions.push(
        center.x + normal.x * u + binormal.x * v,
        center.y + normal.y * u + binormal.y * v,
        center.z + normal.z * u + binormal.z * v,
      );
      if (i < segments && j < sides) {
        const n = i * (sides + 1) + j;
        indices.push(
          n,
          n + sides + 1,
          n + 1,
          n + 1,
          n + sides + 1,
          n + sides + 2,
        );
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function createSculpture(host, getProgress, isReduced) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.65;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
  camera.position.set(0, 0, 7.8);
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(environment, 0.035);
  scene.environment = env.texture;
  const geometry = ribbonGeometry(0),
    halo = ribbonGeometry(1),
    coil = ribbonGeometry(2);
  geometry.morphAttributes.position = [
    halo.attributes.position,
    coil.attributes.position,
  ];
  geometry.morphAttributes.normal = [
    halo.attributes.normal,
    coil.attributes.normal,
  ];
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xb1858c,
    metalness: 1,
    roughness: 0.23,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
    side: THREE.DoubleSide,
    envMapIntensity: 1.5,
  });
  const ribbon = new THREE.Mesh(geometry, material);
  const group = new THREE.Group();
  group.add(ribbon);
  scene.add(group);
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 32, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0xf9b25f,
      metalness: 0.65,
      roughness: 0.19,
      emissive: 0x7b3614,
      emissiveIntensity: 0.3,
    }),
  );
  group.add(core);
  const light = new THREE.DirectionalLight(0xffe8ce, 4);
  light.position.set(-3, 4, 5);
  scene.add(light);
  const fill = new THREE.DirectionalLight(0xbda4e0, 2);
  fill.position.set(3, -2, 2);
  scene.add(fill);
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    draw(true);
  };
  let frame = 0,
    visible = false,
    dead = false,
    pointerX = 0,
    pointerY = 0,
    phase = 0,
    lastPhase = -1,
    lastPointerX = 99,
    lastPointerY = 99;
  function draw(force = false) {
    if (dead) return;
    const p = isReduced() ? 0.48 : getProgress();
    phase = isReduced() ? p : phase + (p - phase) * 0.1;
    if (
      !force &&
      Math.abs(phase - lastPhase) < 0.00005 &&
      pointerX === lastPointerX &&
      pointerY === lastPointerY
    )
      return;
    lastPhase = phase;
    lastPointerX = pointerX;
    lastPointerY = pointerY;
    const a = THREE.MathUtils.smoothstep(phase, 0.1, 0.48);
    const b = THREE.MathUtils.smoothstep(phase, 0.52, 0.95);
    ribbon.morphTargetInfluences[0] = a * (1 - b);
    ribbon.morphTargetInfluences[1] = b;
    group.rotation.x =
      0.35 + phase * 0.45 + (isReduced() ? 0 : pointerY * 0.14);
    group.rotation.y =
      -0.4 + phase * Math.PI * 1.5 + (isReduced() ? 0 : pointerX * 0.2);
    group.rotation.z = -0.25 + phase * 0.8;
    core.scale.setScalar(1 + Math.sin(phase * Math.PI) * 0.4);
    renderer.render(scene, camera);
  }
  function loop() {
    frame = 0;
    if (!visible || dead || document.hidden) return;
    draw();
    if (!isReduced()) frame = requestAnimationFrame(loop);
  }
  const start = () => {
    if (!frame && visible && !document.hidden)
      frame = requestAnimationFrame(loop);
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(host);
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const pointer = (event) => {
    const rect = host.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width - 0.5;
    pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    start();
  };
  const visibility = () => {
    if (document.hidden) stop();
    else start();
  };
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const change = () => {
    draw(true);
    start();
  };
  const lost = (event) => {
    event.preventDefault();
    stop();
    host.dataset.failed = "true";
  };
  host.addEventListener("pointermove", pointer);
  document.addEventListener("visibilitychange", visibility);
  preference.addEventListener("change", change);
  renderer.domElement.addEventListener("webglcontextlost", lost);
  resize();
  draw();
  return () => {
    dead = true;
    stop();
    io.disconnect();
    ro.disconnect();
    host.removeEventListener("pointermove", pointer);
    document.removeEventListener("visibilitychange", visibility);
    preference.removeEventListener("change", change);
    renderer.domElement.removeEventListener("webglcontextlost", lost);
    geometry.dispose();
    halo.dispose();
    coil.dispose();
    material.dispose();
    core.geometry.dispose();
    core.material.dispose();
    env.dispose();
    environment.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
