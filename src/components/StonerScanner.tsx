import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const CITY_NAMES = ['AMSTERDAM','LOS ANGELES','TOKYO','BERLIN','TEL AVIV','LONDON','DUBAI','TORONTO','PARIS','SEATTLE'];

function createStickFigure(scene: THREE.Scene, x: number, z: number, color: number) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.3 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x111111 });

  // Body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6), mat);
  body.position.y = 0.85;
  group.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), mat);
  head.position.y = 1.25;
  group.add(head);

  // Eyes (little glowing dots)
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1 });
  [-0.05, 0.05].forEach(ex => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 4, 4), eyeMat);
    eye.position.set(ex, 1.27, 0.1);
    group.add(eye);
  });

  // Arms
  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 4), mat);
  leftArm.position.set(-0.2, 0.92, 0);
  leftArm.rotation.z = Math.PI / 4;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 4), mat);
  rightArm.position.set(0.2, 0.92, 0);
  rightArm.rotation.z = -Math.PI / 4;
  group.add(rightArm);

  // Legs
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 4), mat);
  leftLeg.position.set(-0.08, 0.4, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 4), mat);
  rightLeg.position.set(0.08, 0.4, 0);
  group.add(rightLeg);

  // Cigarette
  const cigMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e8 });
  const cig = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 4), cigMat);
  cig.rotation.z = Math.PI / 2.5;
  cig.position.set(0.28, 0.96, 0.05);
  group.add(cig);

  // Cigarette ember glow
  const emberMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff4400, emissiveIntensity: 2 });
  const ember = new THREE.Mesh(new THREE.SphereGeometry(0.025, 4, 4), emberMat);
  ember.position.set(0.34, 0.91, 0.05);
  group.add(ember);

  // Smoke particles above cigarette
  for (let i = 0; i < 4; i++) {
    const smokeMat = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa, transparent: true, opacity: 0.15 - i * 0.03
    });
    const smoke = new THREE.Mesh(new THREE.SphereGeometry(0.04 + i * 0.03, 4, 4), smokeMat);
    smoke.position.set(0.34 + i * 0.04, 0.91 + i * 0.18, 0.05);
    group.add(smoke);
  }

  group.position.set(x, 0, z);
  group.scale.setScalar(0.8 + Math.random() * 0.4);
  scene.add(group);

  return {
    group,
    leftLeg, rightLeg, leftArm, rightArm,
    speed: 0.012 + Math.random() * 0.018,
    angle: Math.random() * Math.PI * 2,
    walkPhase: Math.random() * Math.PI * 2,
    paused: false,
    pauseTimer: 0,
    targetAngle: Math.random() * Math.PI * 2,
    ember,
    leftArmBase: leftArm.position.clone(),
    rightArmBase: rightArm.position.clone(),
  };
}

function createBuilding(scene: THREE.Scene, x: number, z: number, w: number, d: number, h: number) {
  // Building body
  const geo = new THREE.BoxGeometry(w, h, d);
  const hue = Math.random();
  const lightness = 0.06 + Math.random() * 0.08;
  const color = new THREE.Color().setHSL(hue, 0.1, lightness);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.1 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, h / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // Windows
  const rows = Math.floor(h / 0.6);
  const cols = Math.floor(w / 0.5);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() > 0.35) {
        const isLit = Math.random() > 0.3;
        const winColor = isLit
          ? (Math.random() > 0.5 ? 0xffdd88 : 0x88ddff)
          : 0x111111;
        const winMat = new THREE.MeshStandardMaterial({
          color: winColor,
          emissive: isLit ? winColor : 0x000000,
          emissiveIntensity: isLit ? 0.8 : 0,
        });
        const win = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.25), winMat);
        win.position.set(
          x + (c - cols / 2 + 0.5) * (w / cols),
          0.5 + r * 0.55,
          z + d / 2 + 0.01
        );
        scene.add(win);
      }
    }
  }

  // Rooftop detail
  if (Math.random() > 0.5) {
    const topGeo = new THREE.BoxGeometry(w * 0.3, 0.3, d * 0.3);
    const topMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.set(x, h + 0.15, z);
    scene.add(top);
  }

  // Rooftop red blinky
  if (Math.random() > 0.6) {
    const blinkMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1 });
    const blink = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 4), blinkMat);
    blink.position.set(x, h + 0.3, z);
    scene.add(blink);
    return { blink };
  }

  return null;
}

function createStreetLight(scene: THREE.Scene, x: number, z: number) {
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 5), poleMat);
  pole.position.set(x, 1.1, z);
  scene.add(pole);

  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 4), poleMat);
  arm.rotation.z = Math.PI / 2;
  arm.position.set(x + 0.25, 2.2, z);
  scene.add(arm);

  const bulbMat = new THREE.MeshStandardMaterial({ color: 0xffee99, emissive: 0xffee99, emissiveIntensity: 1.5 });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), bulbMat);
  bulb.position.set(x + 0.5, 2.2, z);
  scene.add(bulb);

  const light = new THREE.PointLight(0xffee88, 0.8, 4);
  light.position.set(x + 0.5, 2.1, z);
  scene.add(light);
}

function createCar(scene: THREE.Scene, x: number, z: number, color: number) {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.6 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.28, 1.6), bodyMat);
  body.position.y = 0.22;
  group.add(body);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.22, 0.85), bodyMat);
  cabin.position.set(0, 0.47, -0.05);
  group.add(cabin);

  // Wheels
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  [[-0.42, 0.14, 0.5], [0.42, 0.14, 0.5], [-0.42, 0.14, -0.5], [0.42, 0.14, -0.5]].forEach(([wx, wy, wz]) => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.1, 8), wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(wx, wy, wz);
    group.add(wheel);
  });

  // Headlights
  const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 });
  [[-0.25, 0.22, 0.81], [0.25, 0.22, 0.81]].forEach(([hx, hy, hz]) => {
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.07, 0.02), headMat);
    light.position.set(hx, hy, hz);
    group.add(light);
  });

  // Taillights
  const tailMat = new THREE.MeshStandardMaterial({ color: 0xff1100, emissive: 0xff1100, emissiveIntensity: 1 });
  [[-0.25, 0.22, -0.81], [0.25, 0.22, -0.81]].forEach(([tx, ty, tz]) => {
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.07, 0.02), tailMat);
    tail.position.set(tx, ty, tz);
    group.add(tail);
  });

  group.position.set(x, 0, z);
  scene.add(group);
  return group;
}

function createStreetSign(scene: THREE.Scene, x: number, z: number, text: string) {
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4, 4), poleMat);
  pole.position.set(x, 0.7, z);
  scene.add(pole);
  const signMat = new THREE.MeshStandardMaterial({ color: 0x008800, emissive: 0x003300, emissiveIntensity: 0.5 });
  const sign = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.05), signMat);
  sign.position.set(x, 1.5, z);
  scene.add(sign);
}

export function StonerScanner() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── SCENE ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050810);
    scene.fog = new THREE.Fog(0x050810, 18, 40);

    // ── RENDERER ──
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // ── CAMERA ──
    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 7, 14);
    camera.lookAt(0, 0, 0);

    // ── LIGHTS ──
    scene.add(new THREE.AmbientLight(0x111122, 0.8));
    const moonLight = new THREE.DirectionalLight(0x334466, 1.2);
    moonLight.position.set(-10, 20, 10);
    moonLight.castShadow = true;
    scene.add(moonLight);

    // Neon glow lights around the city
    const redLight = new THREE.PointLight(0xff0033, 1.5, 12);
    redLight.position.set(-5, 3, -5);
    scene.add(redLight);
    const blueLight = new THREE.PointLight(0x0033ff, 1.2, 12);
    blueLight.position.set(5, 3, -5);
    scene.add(blueLight);
    const greenLight = new THREE.PointLight(0x00ff44, 0.8, 10);
    greenLight.position.set(0, 2, 5);
    scene.add(greenLight);

    // ── GROUND ──
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1 });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Road markings
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    // Main roads
    [
      { x: 0, z: 0, w: 60, d: 4.5 },
      { x: 0, z: 0, w: 4.5, d: 60 },
      { x: -12, z: 0, w: 2, d: 60 },
      { x: 12, z: 0, w: 2, d: 60 },
    ].forEach(({ x, z, w, d }) => {
      const road = new THREE.Mesh(new THREE.PlaneGeometry(w, d), roadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(x, 0.01, z);
      scene.add(road);
    });

    // Road center lines
    const lineMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffcc00, emissiveIntensity: 0.3 });
    for (let i = -8; i <= 8; i++) {
      if (Math.abs(i) % 2 === 0) continue;
      const line = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.06), lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(i * 2, 0.02, 0);
      scene.add(line);
    }
    for (let i = -8; i <= 8; i++) {
      if (Math.abs(i) % 2 === 0) continue;
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 1.5), lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, 0.02, i * 2);
      scene.add(line);
    }

    // Sidewalks
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.95 });
    [
      { x: 0, z: 0, w: 60, d: 5.5, offZ: 3.5 },
      { x: 0, z: 0, w: 60, d: 5.5, offZ: -3.5 },
    ].forEach(({ x, z, w, d, offZ }) => {
      const sw = new THREE.Mesh(new THREE.PlaneGeometry(w, d), sidewalkMat);
      sw.rotation.x = -Math.PI / 2;
      sw.position.set(x, 0.01, offZ);
      scene.add(sw);
    });

    // ── BUILDINGS ──
    const blockPositions = [
      [-8,-8],[-8,-14],[-8,8],[-8,14],
      [8,-8],[8,-14],[8,8],[8,14],
      [-16,-8],[-16,8],[16,-8],[16,8],
      [-8,-20],[8,-20],[-8,20],[8,20],
    ];

    const blinkingLights: Array<{ blink: THREE.Mesh }> = [];
    blockPositions.forEach(([bx, bz]) => {
      const w = 2 + Math.random() * 3;
      const d = 2 + Math.random() * 3;
      const h = 2 + Math.random() * 8;
      const result = createBuilding(scene, bx, bz, w, d, h);
      if (result?.blink) blinkingLights.push(result as { blink: THREE.Mesh });
    });

    // ── STREET LIGHTS ──
    [[-3.5,6],[-3.5,-6],[3.5,6],[3.5,-6],
     [-3.5,12],[3.5,12],[-3.5,-12],[3.5,-12],
     [-9,3],[9,3],[-9,-3],[9,-3]].forEach(([lx, lz]) => {
      createStreetLight(scene, lx, lz);
    });

    // ── STREET SIGNS ──
    CITY_NAMES.slice(0, 6).forEach((name, i) => {
      const angle = (i / 6) * Math.PI * 2;
      createStreetSign(scene, Math.cos(angle) * 7, Math.sin(angle) * 7, name);
    });

    // ── CARS ──
    const carColors = [0xcc2200, 0x002299, 0x229900, 0xccaa00, 0x888888, 0xffffff];
    const cars: Array<{ mesh: THREE.Group; speed: number; lane: number; axis: 'x'|'z'; dir: number }> = [];
    for (let i = 0; i < 8; i++) {
      const axis: 'x'|'z' = Math.random() > 0.5 ? 'x' : 'z';
      const lane = (Math.random() > 0.5 ? 1 : -1) * 1.2;
      const startPos = -18 + Math.random() * 36;
      const x = axis === 'x' ? startPos : lane;
      const z = axis === 'z' ? startPos : lane;
      const dir = Math.random() > 0.5 ? 1 : -1;
      const color = carColors[Math.floor(Math.random() * carColors.length)];
      const carMesh = createCar(scene, x, z, color);
      if (axis === 'x') carMesh.rotation.y = dir > 0 ? 0 : Math.PI;
      else carMesh.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      cars.push({ mesh: carMesh, speed: 0.04 + Math.random() * 0.06, lane, axis, dir });
    }

    // ── STICK FIGURES ──
    const figColors = [0x00ff88, 0xff4466, 0xffb700, 0x00d9ff, 0xcc44ff, 0xff8800, 0x44ffcc, 0xffff00];
    const figures = [];
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 8;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const color = figColors[i % figColors.length];
      figures.push(createStickFigure(scene, x, z, color));
    }

    // ── MOON ──
    const moonMat = new THREE.MeshStandardMaterial({ color: 0xddddcc, emissive: 0x443322, emissiveIntensity: 0.3 });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), moonMat);
    moon.position.set(-12, 18, -20);
    scene.add(moon);

    // ── STARS ──
    const starGeo = new THREE.BufferGeometry();
    const starVerts = [];
    for (let i = 0; i < 600; i++) {
      starVerts.push((Math.random() - 0.5) * 80, 10 + Math.random() * 30, (Math.random() - 0.5) * 80);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, sizeAttenuation: true });
    scene.add(new THREE.Points(starGeo, starMat));

    // ── NEON SIGN ──
    const signGeom = new THREE.BoxGeometry(4, 0.5, 0.1);
    const signMat = new THREE.MeshStandardMaterial({ color: 0xff0033, emissive: 0xff0033, emissiveIntensity: 2 });
    const neonSign = new THREE.Mesh(signGeom, signMat);
    neonSign.position.set(0, 5, -8);
    scene.add(neonSign);
    const neonLight = new THREE.PointLight(0xff0033, 2, 8);
    neonLight.position.set(0, 5, -7.5);
    scene.add(neonLight);

    // ── CAMERA ORBIT ──
    let camAngle = 0;
    let isDragging = false;
    let lastMouse = { x: 0, y: 0 };
    let camTheta = 0.45;
    let camPhi = 0.35;
    let camRadius = 14;
    let autoOrbit = true;

    const onMouseDown = (e: MouseEvent) => { isDragging = true; autoOrbit = false; lastMouse = { x: e.clientX, y: e.clientY }; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = (e.clientX - lastMouse.x) * 0.005;
      const dy = (e.clientY - lastMouse.y) * 0.005;
      camTheta -= dx;
      camPhi = Math.max(0.1, Math.min(1.2, camPhi + dy));
      lastMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camRadius = Math.max(5, Math.min(30, camRadius + e.deltaY * 0.02));
    };
    const onTouchStart = (e: TouchEvent) => { isDragging = true; autoOrbit = false; lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const dx = (e.touches[0].clientX - lastMouse.x) * 0.005;
      const dy = (e.touches[0].clientY - lastMouse.y) * 0.005;
      camTheta -= dx; camPhi = Math.max(0.1, Math.min(1.2, camPhi + dy));
      lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging = false; };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.addEventListener('touchstart', onTouchStart);
    renderer.domElement.addEventListener('touchmove', onTouchMove);
    renderer.domElement.addEventListener('touchend', onTouchEnd);

    // ── ANIMATION LOOP ──
    let frameId: number;
    let frame = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      frame++;

      // Auto orbit
      if (autoOrbit) { camTheta += 0.002; }

      // Update camera
      camera.position.x = camRadius * Math.sin(camTheta) * Math.cos(camPhi);
      camera.position.y = camRadius * Math.sin(camPhi) + 1;
      camera.position.z = camRadius * Math.cos(camTheta) * Math.cos(camPhi);
      camera.lookAt(0, 1, 0);

      // Animate stick figures
      figures.forEach(fig => {
        if (fig.paused) {
          fig.pauseTimer--;
          if (fig.pauseTimer <= 0) fig.paused = false;
          return;
        }

        // Random turn
        if (Math.random() < 0.005) {
          fig.targetAngle = Math.random() * Math.PI * 2;
          if (Math.random() < 0.1) { fig.paused = true; fig.pauseTimer = 60 + Math.floor(Math.random() * 120); }
        }

        // Smooth turn
        let diff = fig.targetAngle - fig.angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        fig.angle += diff * 0.05;

        // Move
        fig.group.position.x += Math.sin(fig.angle) * fig.speed;
        fig.group.position.z += Math.cos(fig.angle) * fig.speed;

        // Boundary bounce
        const { x, z } = fig.group.position;
        const boundary = 14;
        if (Math.abs(x) > boundary || Math.abs(z) > boundary) {
          fig.targetAngle = Math.atan2(-x, -z) + (Math.random() - 0.5) * 1.5;
        }

        // Face direction
        fig.group.rotation.y = fig.angle;

        // Walk animation
        fig.walkPhase += 0.12;
        fig.leftLeg.rotation.x = Math.sin(fig.walkPhase) * 0.4;
        fig.rightLeg.rotation.x = -Math.sin(fig.walkPhase) * 0.4;
        fig.leftArm.rotation.x = -Math.sin(fig.walkPhase) * 0.3;

        // Ember flicker
        fig.ember.material.emissiveIntensity = 1.5 + Math.sin(frame * 0.15 + fig.walkPhase) * 0.5;
      });

      // Animate cars
      cars.forEach(car => {
        if (car.axis === 'x') {
          car.mesh.position.x += car.speed * car.dir;
          if (Math.abs(car.mesh.position.x) > 20) car.mesh.position.x = -20 * car.dir;
        } else {
          car.mesh.position.z += car.speed * car.dir;
          if (Math.abs(car.mesh.position.z) > 20) car.mesh.position.z = -20 * car.dir;
        }
      });

      // Blink rooftop lights
      blinkingLights.forEach(b => {
        b.blink.material.emissiveIntensity = Math.floor(frame / 40) % 2 === 0 ? 1 : 0;
      });

      // Neon sign pulse
      neonSign.material.emissiveIntensity = 1.5 + Math.sin(frame * 0.05) * 0.5;
      neonLight.intensity = 1.5 + Math.sin(frame * 0.05) * 0.5;

      // Ambient color shift
      redLight.intensity = 1 + Math.sin(frame * 0.02) * 0.4;
      blueLight.intensity = 1 + Math.cos(frame * 0.018) * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    // Resize
    const onResize = () => {
      if (!container) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section id="stoner-scanner" style={{ padding: '48px 16px', background: '#080808' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');`}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ color: '#cc0000', fontSize: 18 }}>🛸</span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.4rem,3vw,2rem)', letterSpacing: '0.15em', color: '#fff' }}>
          GLOBAL STUNUR SCANNER
        </span>
      </div>
      <p style={{ textAlign: 'center', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: 16 }}>
        DRAG TO ORBIT · SCROLL TO ZOOM · 18 STUNURS ACTIVE WORLDWIDE
      </p>

      <div style={{ position: 'relative', width: '100%', maxWidth: 900, margin: '0 auto' }}>
        {/* Canvas */}
        <div
          ref={mountRef}
          style={{
            width: '100%', height: 520,
            border: '1px solid rgba(0,255,80,0.2)',
            boxShadow: '0 0 60px rgba(0,255,80,0.05), 0 0 30px rgba(255,0,50,0.05)',
            borderRadius: 2, overflow: 'hidden', cursor: 'grab',
          }}
        />

        {/* Corner brackets */}
        {[
          { top:0, left:0, borderTop:'2px solid rgba(0,255,80,0.6)', borderLeft:'2px solid rgba(0,255,80,0.6)' },
          { top:0, right:0, borderTop:'2px solid rgba(0,255,80,0.6)', borderRight:'2px solid rgba(0,255,80,0.6)' },
          { bottom:0, left:0, borderBottom:'2px solid rgba(0,255,80,0.6)', borderLeft:'2px solid rgba(0,255,80,0.6)' },
          { bottom:0, right:0, borderBottom:'2px solid rgba(0,255,80,0.6)', borderRight:'2px solid rgba(0,255,80,0.6)' },
        ].map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...s }} />
        ))}

        {/* HUD labels */}
        <div style={{ position: 'absolute', top: 12, left: 20, fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'rgba(0,255,80,0.7)', letterSpacing: '0.2em', pointerEvents: 'none' }}>
          ◈ STUNUR CITY · LIVE FEED
        </div>
        <div style={{ position: 'absolute', top: 12, right: 20, fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'rgba(0,255,80,0.5)', letterSpacing: '0.15em', pointerEvents: 'none', textAlign: 'right' }}>
          {CITY_NAMES[Math.floor(Date.now() / 5000) % CITY_NAMES.length]}
        </div>

        {/* Bottom live strip */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(0,3,0,0.85)', borderTop: '1px solid rgba(0,255,80,0.15)',
          padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden',
          pointerEvents: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88', animation: 'blink 1s infinite' }} />
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 8, color: '#00ff88', letterSpacing: '0.2em' }}>LIVE</span>
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 18s linear infinite' }}>
              {[...CITY_NAMES, ...CITY_NAMES].map((c, i) => (
                <span key={i} style={{ marginRight: 28, fontFamily: "'Share Tech Mono', monospace", fontSize: 8, color: 'rgba(0,255,80,0.45)', letterSpacing: '0.1em' }}>
                  ◆ {c}: STUNURS ACTIVE
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
