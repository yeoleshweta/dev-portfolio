import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

import { hand, ribbonGeometry } from "./sculptureGeometry.mjs";
import { lastStoryStage, storyStages, storyWeights } from "./storyStages.mjs";

export function createSculpture(host, getProgress, isReduced, getInteraction = () => ({ x: 0, y: 0, wire: false })) {
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
  const camera = new THREE.OrthographicCamera(-2.5, 2.5, 2.5, -2.5, 0.1, 30);
  camera.position.set(0, 0, 7.8);
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(environment, 0.035);
  scene.environment = env.texture;
  const geometry = ribbonGeometry(0);
  const targets = storyStages
    .slice(1)
    .map((_, index) => ribbonGeometry(index + 1));
  geometry.morphAttributes.position = targets.map(
    (target) => target.attributes.position,
  );
  geometry.morphAttributes.normal = targets.map(
    (target) => target.attributes.normal,
  );
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xb1858c,
    metalness: 1,
    roughness: 0.23,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
    side: THREE.DoubleSide,
    envMapIntensity: 1.5,
    transparent: true,
    forceSinglePass: true,
  });
  const technicalColor = new THREE.Color(0x5a3048);
  const ribbon = new THREE.Mesh(geometry, material);
  const group = new THREE.Group();
  group.add(ribbon);
  const wireMaterial = new THREE.MeshBasicMaterial({ color: 0x674153, wireframe: true, transparent: true, opacity: 0, depthWrite: false });
  const wireMesh = new THREE.Mesh(geometry, wireMaterial);
  group.add(wireMesh);
  scene.add(group);
  const nodeGeometry = new THREE.SphereGeometry(0.036, 16, 12);
  const nodeMaterial = new THREE.MeshStandardMaterial({
    color: 0x643b4c,
    metalness: 0.15,
    roughness: 0.55,
    transparent: true,
    opacity: 0,
  });
  const nodes = hand.map((point) => {
    const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
    mesh.position.copy(point);
    group.add(mesh);
    return mesh;
  });
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
    const viewWidth = Math.max(5, (width / height) * 4.6);
    camera.left = -viewWidth / 2;
    camera.right = viewWidth / 2;
    camera.top = ((viewWidth / 2) * height) / width;
    const stage = host.closest(".continuousStage");
    stage?.style.setProperty("--world-unit", `${width / viewWidth}px`);
    stage?.style.setProperty("--frame-width", `${(3.5 / viewWidth) * 100}%`);
    stage?.style.setProperty(
      "--frame-bottom",
      `${(width * 1.16) / viewWidth}px`,
    );
    camera.bottom = -camera.top;
    camera.updateProjectionMatrix();
    draw(true);
  };
  let frame = 0,
    visible = false,
    dead = false,
    pointerX = 0,
    pointerY = 0,
    phase = 0,
    hoverX = 0, hoverY = 0,
    rotationX = 0, rotationY = 0, wireAmount = 0,
    lastRotationX = 0, lastRotationY = 0, lastWire = 0,
    lastPhase = -1,
    lastPointerX = 99,
    lastPointerY = 99;
  function draw(force = false) {
    if (dead) return;
    const p = getProgress() * lastStoryStage;
    phase = isReduced() ? Math.round(p) : p;
    const input = getInteraction();
    const damping = isReduced() ? 1 : .12;
    hoverX += (pointerX - hoverX) * damping;
    hoverY += (pointerY - hoverY) * damping;
    rotationX += (input.x - rotationX) * damping;
    rotationY += (input.y - rotationY) * damping;
    const wireTarget = input.wire ? Math.max(0, 1 - phase * 2) : 0;
    wireAmount += (wireTarget - wireAmount) * damping;
    if (
      !force &&
      Math.abs(phase - lastPhase) < 0.00005 &&
      Math.abs(hoverX - lastPointerX) < .00005 &&
      Math.abs(hoverY - lastPointerY) < .00005 &&
      Math.abs(rotationX - lastRotationX) < .00005 &&
      Math.abs(rotationY - lastRotationY) < .00005 &&
      Math.abs(wireAmount - lastWire) < .00005
    )
      return;
    lastPhase = phase;
    lastPointerX = hoverX;
    lastPointerY = hoverY;
    lastRotationX = rotationX;
    lastRotationY = rotationY;
    lastWire = wireAmount;
    const weights = storyWeights(phase);
    for (let i = 0; i < targets.length; i++) {
      ribbon.morphTargetInfluences[i] = weights[i + 1];
      wireMesh.morphTargetInfluences[i] = weights[i + 1];
    }
    wireMaterial.opacity = wireAmount * .7;
    wireMesh.visible = wireAmount > .001;
    material.opacity = 1 - wireAmount;
    ribbon.visible = wireAmount < .999;
    const hero = weights[0],
      gesture = weights[2],
      evidence = weights[3],
      lens = weights[4],
      forecast = weights[5];
    group.rotation.set(
      hero * (0.35 + rotationX + (isReduced() ? 0 : hoverY * 0.14)),
      hero * (-0.4 + rotationY + (isReduced() ? 0 : hoverX * 0.2)),
      hero * -0.25,
    );
    group.position.set(
      0,
      gesture * 0.36 + evidence * 1.15 + forecast * 0.25,
      0,
    );
    group.scale.setScalar(1 - gesture * 0.08);
    core.scale.setScalar(hero + 0.23 * (1 - hero));
    core.position.set(
      weights[1] * 1.8 + lens * 1.42 + forecast * 1.8,
      weights[1] * 1.16 - gesture * 0.9 + forecast * 0.9,
      0,
    );
    nodeMaterial.opacity = gesture;
    for (const node of nodes) node.visible = gesture > 0.005;
    // A deeper, less reflective line keeps fine geometry legible on the paper stage.
    const technical = gesture + evidence + forecast + lens * 0.65;
    material.color.setRGB(0.69, 0.52, 0.55).lerp(technicalColor, technical);
    material.metalness = 1 - technical * 0.8;
    material.roughness = 0.23 + technical * 0.32;
    material.emissiveIntensity = 0;
    renderer.toneMappingExposure = 1.65 - technical * 0.5;
    light.intensity = 4 - technical * 2;
    fill.intensity = 2 - technical;
    renderer.render(scene, camera);
  }
  function loop() {
    frame = 0;
    if (!visible || dead || document.hidden) return;
    draw();
    // Poll progress even with reduced motion; draw() skips identical frames.
    // This keeps discrete chapter changes visible without a morph animation.
    frame = requestAnimationFrame(loop);
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
  const leave = () => { pointerX = 0; pointerY = 0; };
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
  host.addEventListener("pointerleave", leave);
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
    host.removeEventListener("pointerleave", leave);
    document.removeEventListener("visibilitychange", visibility);
    preference.removeEventListener("change", change);
    renderer.domElement.removeEventListener("webglcontextlost", lost);
    geometry.dispose();
    targets.forEach((target) => target.dispose());
    nodeGeometry.dispose();
    nodeMaterial.dispose();
    material.dispose();
    wireMaterial.dispose();
    core.geometry.dispose();
    core.material.dispose();
    env.dispose();
    environment.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
