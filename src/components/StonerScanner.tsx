import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const SCAN_LOCATIONS = [
  'AMSTERDAM', 'LOS ANGELES', 'TOKYO', 'BERLIN', 'TEL AVIV',
  'LONDON', 'DUBAI', 'TORONTO', 'PARIS', 'SEATTLE',
  'BANGKOK', 'MELBOURNE', 'LAGOS', 'SÃO PAULO',
];

function stdMat(color: number, emissive = 0x000000, emissiveIntensity = 0, roughness = 0.8, metalness = 0.1) {
  return new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity, roughness, metalness });
}
function box(w: number, h: number, d: number, mat: THREE.Material) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
}
function cyl(rt: number, rb: number, h: number, segs: number, mat: THREE.Material) {
  return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, segs), mat);
}

function createSmokeSystem(scene: THREE.Scene, getPos: () => THREE.Vector3) {
  const particles: Array<{ mesh: THREE.Mesh; vel: THREE.Vector3; life: number; maxLife: number }> = [];
  function spawn() {
    const pos = getPos();
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.04 + Math.random() * 0.03, 4, 4),
      new THREE.MeshBasicMaterial({ color: 0xbbbbbb, transparent: true, opacity: 0.15, depthWrite: false })
    );
    m.position.copy(pos);
    scene.add(m);
    particles.push({
      mesh: m,
      vel: new THREE.Vector3((Math.random() - 0.5) * 0.007, 0.02 + Math.random() * 0.01, (Math.random() - 0.5) * 0.007),
      life: 0, maxLife: 45 + Math.floor(Math.random() * 25),
    });
  }
  function update(frame: number) {
    if (frame % 7 === 0) spawn();
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]; p.life++;
      p.mesh.position.add(p.vel);
      p.mesh.scale.setScalar(1 + p.life * 0.05);
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = 0.15 * (1 - p.life / p.maxLife);
      if (p.life >= p.maxLife) { scene.remove(p.mesh); particles.splice(i, 1); }
    }
  }
  function dispose() { particles.forEach(p => scene.remove(p.mesh)); particles.length = 0; }
  return { update, dispose };
}

function createBuilding(scene: THREE.Scene, x: number, z: number, w: number, d: number, h: number, label?: string) {
  const group = new THREE.Group();
  const bColor = new THREE.Color().setHSL(Math.random(), 0.07, 0.07 + Math.random() * 0.06);
  const body = box(w, h, d, stdMat(bColor.getHex(), 0, 0, 0.9));
  body.position.y = h / 2; body.castShadow = true; body.receiveShadow = true;
  group.add(body);
  const rows = Math.max(1, Math.floor(h / 0.65));
  const cols = Math.max(1, Math.floor(w / 0.55));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() > 0.3) {
        const lit = Math.random() > 0.35;
        const wc = lit ? (Math.random() > 0.5 ? 0xffdd88 : 0x88ccff) : 0x111111;
        const wm = new THREE.MeshStandardMaterial({ color: wc, emissive: lit ? wc : 0, emissiveIntensity: lit ? 0.9 : 0 });
        const win = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.28), wm);
        win.position.set((c - cols / 2 + 0.5) * (w / cols), 0.4 + r * 0.6, d / 2 + 0.01);
        group.add(win);
      }
    }
  }
  const roof = box(w + 0.1, 0.12, d + 0.1, stdMat(0x1a1a1a));
  roof.position.y = h + 0.06; group.add(roof);
  const blinkMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1 });
  const blink = new THREE.Mesh(new THREE.SphereGeometry(0.07, 5, 5), blinkMat);
  blink.position.y = h + 0.25; group.add(blink);
  if (Math.random() > 0.55) {
    const tank = cyl(0.25, 0.25, 0.5, 8, stdMat(0x553311));
    tank.position.set(w * 0.3, h + 0.35, 0); group.add(tank);
  }
  if (label) {
    const lc = label === 'WEED' ? 0x00cc44 : label === 'STUNUR' ? 0xcc0000 : 0x0044cc;
    const lm = new THREE.MeshStandardMaterial({ color: lc, emissive: lc, emissiveIntensity: 1.2 });
    const sign = box(w * 0.8, 0.3, 0.06, lm);
    sign.position.set(0, 0.8, d / 2 + 0.05); group.add(sign);
    const sl = new THREE.PointLight(lc, 1.5, 4);
    sl.position.set(0, 0.8, d / 2 + 0.5); group.add(sl);
  }
  group.position.set(x, 0, z);
  scene.add(group);
  return { blink };
}

function createWeedStore(scene: THREE.Scene, x: number, z: number) {
  const group = new THREE.Group();
  const body = box(3.5, 2.2, 3, stdMat(0x1a2e1a, 0, 0, 0.9));
  body.position.y = 1.1; group.add(body);
  const awning = box(4, 0.12, 1.2, stdMat(0x2d7a2d, 0x1a4a1a, 0.3));
  awning.position.set(0, 2.35, 1.8); group.add(awning);
  const neonMat = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00ff44, emissiveIntensity: 2.5 });
  const neon = box(2.2, 0.28, 0.06, neonMat);
  neon.position.set(0, 1.9, 1.55); group.add(neon);
  const nl = new THREE.PointLight(0x00ff44, 2, 6);
  nl.position.set(0, 1.9, 2); group.add(nl);
  const lm = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00ff44, emissiveIntensity: 1.5 });
  const l1 = box(0.08, 0.5, 0.06, lm); l1.position.set(0, 1.3, 1.56); group.add(l1);
  const l2 = box(0.5, 0.08, 0.06, lm); l2.position.set(0, 1.3, 1.56); group.add(l2);
  const door = box(0.7, 1.5, 0.05, stdMat(0x2a5a2a, 0, 0, 0.7));
  door.position.set(0, 0.75, 1.53); group.add(door);
  group.position.set(x, 0, z);
  scene.add(group);
  return { neonLight: nl, neonMat };
}

function createStreetLight(scene: THREE.Scene, x: number, z: number) {
  const pm = stdMat(0x333333);
  const pole = cyl(0.04, 0.04, 2.4, 5, pm); pole.position.set(x, 1.2, z); scene.add(pole);
  const arm = cyl(0.022, 0.022, 0.55, 4, pm); arm.rotation.z = Math.PI / 2; arm.position.set(x + 0.27, 2.35, z); scene.add(arm);
  const bm = new THREE.MeshStandardMaterial({ color: 0xfffde0, emissive: 0xfffde0, emissiveIntensity: 1.8 });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), bm); bulb.position.set(x + 0.54, 2.35, z); scene.add(bulb);
  const light = new THREE.PointLight(0xffee88, 1.0, 5); light.position.set(x + 0.54, 2.3, z); scene.add(light);
  return { light, bulbMat: bm };
}

function createCar(scene: THREE.Scene, x: number, z: number, color: number, axis: 'x' | 'z', dir: number) {
  const group = new THREE.Group();
  group.add(Object.assign(box(0.85, 0.3, 1.7, stdMat(color, 0, 0, 0.3, 0.7)), { position: new THREE.Vector3(0, 0.22, 0) }));
  group.add(Object.assign(box(0.68, 0.24, 0.9, stdMat(color, 0, 0, 0.3, 0.7)), { position: new THREE.Vector3(0, 0.49, -0.05) }));
  [[-0.44, 0.14, 0.52], [0.44, 0.14, 0.52], [-0.44, 0.14, -0.52], [0.44, 0.14, -0.52]].forEach(([wx, wy, wz]) => {
    const w = cyl(0.13, 0.13, 0.1, 8, stdMat(0x111111, 0, 0, 1)); w.rotation.z = Math.PI / 2; w.position.set(wx, wy, wz); group.add(w);
  });
  const hm = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 });
  const tm = new THREE.MeshStandardMaterial({ color: 0xff1100, emissive: 0xff1100, emissiveIntensity: 1 });
  [[-0.26, 0.22, 0.86], [0.26, 0.22, 0.86]].forEach(([hx, hy, hz]) => { const h = box(0.13, 0.07, 0.02, hm); h.position.set(hx, hy, hz); group.add(h); });
  [[-0.26, 0.22, -0.86], [0.26, 0.22, -0.86]].forEach(([tx, ty, tz]) => { const t = box(0.13, 0.07, 0.02, tm); t.position.set(tx, ty, tz); group.add(t); });
  group.position.set(x, 0, z);
  if (axis === 'x') group.rotation.y = dir > 0 ? 0 : Math.PI;
  else group.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
  scene.add(group);
  return group;
}

type CharType = 'stunur' | 'wojak' | 'pepe' | 'doge';

function createCharacter(scene: THREE.Scene, x: number, z: number, type: CharType) {
  const group = new THREE.Group();
  const C = {
    stunur: { body: 0xeeeeee, head: 0xd4b896, eye: 0xff0000 },
    wojak:  { body: 0x4455cc, head: 0xf5d5b8, eye: 0x334499 },
    pepe:   { body: 0x33aa33, head: 0x55cc33, eye: 0x111100 },
    doge:   { body: 0xddaa55, head: 0xddaa55, eye: 0x332200 },
  }[type];
  const bm = stdMat(C.body, C.body, 0.2);
  const hm = stdMat(C.head, C.head, 0.1);
  const em = new THREE.MeshStandardMaterial({ color: C.eye, emissive: C.eye, emissiveIntensity: 0.8 });
  const dm = stdMat(0x222222);

  const bodyMesh = cyl(0.1, 0.12, 0.55, 6, bm); bodyMesh.position.y = 0.9; group.add(bodyMesh);

  let head: THREE.Mesh;
  if (type === 'pepe') {
    head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 8, 8), hm);
    head.scale.set(1, 0.85, 1.1);
    const lip = box(0.18, 0.06, 0.05, stdMat(0x228822)); lip.position.set(0, 1.2, 0.14); group.add(lip);
  } else if (type === 'doge') {
    head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), hm);
    head.scale.set(1.2, 0.9, 1.3);
    [[-0.14, 1.46, 0], [0.14, 1.46, 0]].forEach(([ex, ey, ez]) => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.06, 5, 5), hm); ear.scale.set(1, 1.5, 0.5); ear.position.set(ex, ey, ez); group.add(ear);
    });
  } else {
    head = new THREE.Mesh(new THREE.SphereGeometry(0.155, 8, 8), hm);
  }
  head.position.y = 1.32; group.add(head);

  if (type === 'wojak') {
    const tearMat = new THREE.MeshStandardMaterial({ color: 0x88aaff, emissive: 0x88aaff, emissiveIntensity: 0.5 });
    const tear = new THREE.Mesh(new THREE.SphereGeometry(0.025, 4, 4), tearMat); tear.position.set(0.07, 1.22, 0.14); group.add(tear);
  }
  if (type === 'stunur') {
    const hairMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.15 });
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const spike = cyl(0.0, 0.04, 0.18, 4, hairMat);
      spike.position.set(Math.cos(a) * 0.1, 1.52, Math.sin(a) * 0.08);
      spike.rotation.z = Math.cos(a) * 0.5; spike.rotation.x = Math.sin(a) * 0.5;
      group.add(spike);
    }
  }

  [[-0.06, 0], [0.06, 0]].forEach(([ex]) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.028, 5, 5), em); eye.position.set(ex, 1.34, 0.14); group.add(eye);
  });

  const leftArm = cyl(0.028, 0.028, 0.38, 4, bm); leftArm.position.set(-0.19, 0.95, 0); leftArm.rotation.z = Math.PI / 4; group.add(leftArm);
  const rightArm = cyl(0.028, 0.028, 0.38, 4, bm); rightArm.position.set(0.19, 0.95, 0); rightArm.rotation.z = -Math.PI / 5; group.add(rightArm);
  const leftLeg = cyl(0.035, 0.035, 0.45, 4, dm); leftLeg.position.set(-0.09, 0.42, 0); group.add(leftLeg);
  const rightLeg = cyl(0.035, 0.035, 0.45, 4, dm); rightLeg.position.set(0.09, 0.42, 0); group.add(rightLeg);

  const cig = cyl(0.016, 0.016, 0.2, 4, stdMat(0xf0ead6, 0, 0, 0.9));
  cig.rotation.z = Math.PI / 2.2; cig.position.set(0.3, 0.98, 0.06); group.add(cig);

  const emberMat = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xff4400, emissiveIntensity: 3 });
  const ember = new THREE.Mesh(new THREE.SphereGeometry(0.022, 4, 4), emberMat);
  ember.position.set(0.37, 0.92, 0.06); group.add(ember);
  const emberLight = new THREE.PointLight(0xff4400, 0.6, 1.2);
  emberLight.position.set(0.37, 0.92, 0.06); group.add(emberLight);

  group.position.set(x, 0, z);
  group.scale.setScalar(0.75 + Math.random() * 0.3);
  scene.add(group);

  return {
    group, leftLeg, rightLeg, leftArm, ember, emberMat, emberLight,
    speed: 0.01 + Math.random() * 0.018,
    angle: Math.random() * Math.PI * 2,
    targetAngle: Math.random() * Math.PI * 2,
    walkPhase: Math.random() * Math.PI * 2,
    paused: false, pauseTimer: 0,
  };
}

function drawHUD(ctx: CanvasRenderingContext2D, W: number, H: number, frame: number, location: string, timeOfDay: number) {
  ctx.clearRect(0, 0, W, H);
  const mono = '"Share Tech Mono", monospace';

  // Top-left panel
  ctx.fillStyle = 'rgba(0,5,0,0.78)'; ctx.fillRect(10, 10, 215, 78);
  ctx.strokeStyle = 'rgba(0,255,80,0.55)'; ctx.lineWidth = 1; ctx.strokeRect(10, 10, 215, 78);
  ctx.fillStyle = '#00ff88'; ctx.font = `bold 12px ${mono}`; ctx.fillText('◈ STUNUR CITY · LIVE', 18, 27);
  ctx.fillStyle = 'rgba(0,255,80,0.5)'; ctx.font = `9px ${mono}`;
  const tod = timeOfDay < 0.25 ? 'DAWN 🌅' : timeOfDay < 0.5 ? 'DAY ☀️' : timeOfDay < 0.75 ? 'DUSK 🌆' : 'NIGHT 🌙';
  ctx.fillText(`TIME: ${tod}`, 18, 42);
  ctx.fillText('CHARS: STUNUR · WOJAK · PEPE · DOGE', 18, 56);
  ctx.fillText('WEED STORES: 3  ·  SMOKE: HEAVY', 18, 70);

  // Top-right scan panel
  ctx.fillStyle = 'rgba(0,0,8,0.82)'; ctx.fillRect(W - 205, 10, 195, 78);
  ctx.strokeStyle = 'rgba(204,0,50,0.65)'; ctx.strokeRect(W - 205, 10, 195, 78);
  ctx.fillStyle = '#ff4466'; ctx.font = `bold 9px ${mono}`; ctx.fillText('▶ SCANNING LOCATION', W - 198, 25);
  ctx.fillStyle = '#ffffff'; ctx.font = `bold 14px ${mono}`; ctx.fillText(location, W - 198, 44);
  const scanPct = (frame % 80) / 80;
  ctx.fillStyle = 'rgba(255,68,100,0.12)'; ctx.fillRect(W - 205, 10 + scanPct * 78, 195, 3);
  ctx.fillStyle = 'rgba(255,68,100,0.7)'; ctx.fillRect(W - 205, 10 + scanPct * 78, 195, 1);
  if (Math.floor(frame / 15) % 2 === 0) {
    ctx.beginPath(); ctx.arc(W - 18, 60, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ff4466'; ctx.shadowColor = '#ff4466'; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
  }
  ctx.fillStyle = 'rgba(255,68,100,0.5)'; ctx.font = `8px ${mono}`;
  ctx.fillText(`${Math.floor(28 + Math.sin(frame * 0.04) * 15)} STUNURS DETECTED`, W - 198, 72);

  // Bottom-left radar
  const cx = 55, cy = H - 60, r = 42;
  ctx.strokeStyle = 'rgba(0,255,80,0.25)'; ctx.lineWidth = 0.8;
  for (let ri = 1; ri <= 3; ri++) { ctx.beginPath(); ctx.arc(cx, cy, r * ri / 3, 0, Math.PI * 2); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
  const sa = (frame * 0.045) % (Math.PI * 2);
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, sa - 1.1, sa);
  ctx.fillStyle = 'rgba(0,255,80,0.2)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sa) * r, cy + Math.sin(sa) * r);
  ctx.strokeStyle = 'rgba(0,255,80,0.85)'; ctx.lineWidth = 1.5; ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const ba = (i / 6) * Math.PI * 2 + frame * 0.012;
    const br = r * (0.25 + (i % 3) * 0.24);
    ctx.beginPath(); ctx.arc(cx + Math.cos(ba) * br, cy + Math.sin(ba) * br, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,255,80,${0.35 + Math.sin(frame * 0.1 + i) * 0.3})`;
    ctx.shadowColor = '#00ff88'; ctx.shadowBlur = 5; ctx.fill(); ctx.shadowBlur = 0;
  }

  // Bottom status bar
  ctx.fillStyle = 'rgba(0,3,0,0.88)'; ctx.fillRect(0, H - 22, W, 22);
  ctx.strokeStyle = 'rgba(0,255,80,0.18)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 22); ctx.lineTo(W, H - 22); ctx.stroke();
  const items = ['SYSTEM: ONLINE', 'STUNUR CITY LIVE', 'SMOKE: HEAVY', `SCANNING: ${location}`, 'ALL CHARS ACTIVE'];
  const iw = W / items.length;
  items.forEach((item, i) => {
    ctx.fillStyle = `rgba(0,255,80,${i === 3 ? 0.7 : 0.35})`; ctx.font = `8px ${mono}`;
    ctx.fillText(`· ${item}`, i * iw + 6, H - 7);
  });

  // Corners
  ctx.strokeStyle = 'rgba(0,255,80,0.55)'; ctx.lineWidth = 2;
  [[10, 10, 1, 1], [W - 10, 10, -1, 1], [10, H - 10, 1, -1], [W - 10, H - 10, -1, -1]].forEach(([bx, by, sx, sy]) => {
    ctx.beginPath(); ctx.moveTo(bx, by + sy * 16); ctx.lineTo(bx, by); ctx.lineTo(bx + sx * 16, by); ctx.stroke();
  });
}

export function StonerScanner() {
  const mountRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLCanvasElement>(null);
  const [scanLocation, setScanLocation] = useState(SCAN_LOCATIONS[0]);

  useEffect(() => {
    const container = mountRef.current;
    const hudCanvas = hudRef.current;
    if (!container || !hudCanvas) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(52, container.clientWidth / container.clientHeight, 0.1, 120);
    camera.position.set(0, 9, 16);
    camera.lookAt(0, 1, 0);

    scene.background = new THREE.Color(0x030508);
    scene.fog = new THREE.FogExp2(0x030508, 0.026);

    const ambientLight = new THREE.AmbientLight(0x111122, 0.6); scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xfff5cc, 1.5);
    sunLight.position.set(-15, 25, 10); sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.left = -30; sunLight.shadow.camera.right = 30;
    sunLight.shadow.camera.top = 30; sunLight.shadow.camera.bottom = -30;
    sunLight.shadow.camera.far = 80;
    scene.add(sunLight);

    const redFill = new THREE.PointLight(0xff0033, 1.2, 18); redFill.position.set(-6, 4, -6); scene.add(redFill);
    const blueFill = new THREE.PointLight(0x0033ff, 1.0, 18); blueFill.position.set(6, 4, -6); scene.add(blueFill);
    const greenFill = new THREE.PointLight(0x00ff44, 0.7, 14); greenFill.position.set(0, 3, 6); scene.add(greenFill);

    // Stars
    const sv: number[] = [];
    for (let i = 0; i < 800; i++) sv.push((Math.random() - 0.5) * 100, 12 + Math.random() * 40, (Math.random() - 0.5) * 100);
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sv, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.12 }));
    scene.add(stars);

    const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(1.8, 16, 16), new THREE.MeshStandardMaterial({ color: 0xddddc8, emissive: 0x443322, emissiveIntensity: 0.4 }));
    moonMesh.position.set(-14, 22, -25); scene.add(moonMesh);
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffee88, emissive: 0xffcc44, emissiveIntensity: 2 }));
    sunMesh.position.set(20, 30, -30); scene.add(sunMesh);

    // Ground
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), stdMat(0x0e0e0e, 0, 0, 1));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

    // Roads
    const roadMat = stdMat(0x181818, 0, 0, 0.95);
    [[0, 0, 80, 5], [0, 0, 5, 80], [-14, 0, 2.5, 80], [14, 0, 2.5, 80]].forEach(([rx, rz, rw, rd]) => {
      const r = new THREE.Mesh(new THREE.PlaneGeometry(rw, rd), roadMat);
      r.rotation.x = -Math.PI / 2; r.position.set(rx, 0.005, rz); scene.add(r);
    });
    const lineMat = stdMat(0xffcc00, 0xffcc00, 0.2);
    for (let i = -9; i <= 9; i += 2) {
      const l1 = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.07), lineMat); l1.rotation.x = -Math.PI / 2; l1.position.set(i * 2, 0.01, 0); scene.add(l1);
      const l2 = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 1.6), lineMat); l2.rotation.x = -Math.PI / 2; l2.position.set(0, 0.01, i * 2); scene.add(l2);
    }

    // Buildings
    const bDefs = [
      { x: -9,  z: -9,  w: 3.5, d: 3.5, h: 7,  label: 'STUNUR' },
      { x: -9,  z: -16, w: 2.5, d: 2.5, h: 10 },
      { x: -9,  z: 9,   w: 3,   d: 3,   h: 5  },
      { x: -9,  z: 16,  w: 2.8, d: 2.8, h: 8  },
      { x: 9,   z: -9,  w: 3,   d: 3,   h: 9  },
      { x: 9,   z: -16, w: 3.5, d: 3.5, h: 6  },
      { x: 9,   z: 9,   w: 2.5, d: 2.5, h: 11 },
      { x: 9,   z: 16,  w: 3,   d: 3,   h: 7  },
      { x: -18, z: -9,  w: 3,   d: 3,   h: 5  },
      { x: -18, z: 9,   w: 3.5, d: 3.5, h: 8  },
      { x: 18,  z: -9,  w: 3,   d: 3,   h: 6  },
      { x: 18,  z: 9,   w: 2.5, d: 2.5, h: 9  },
    ];
    const blinkMeshes: THREE.Mesh[] = [];
    bDefs.forEach(({ x, z, w, d, h, label }) => { const { blink } = createBuilding(scene, x, z, w, d, h, label); blinkMeshes.push(blink); });

    const weedStores = [createWeedStore(scene, -5.5, 4.5), createWeedStore(scene, 5.5, -4.5), createWeedStore(scene, 0, -18)];

    const streetLights = [
      [-3.6, 7], [3.6, 7], [-3.6, -7], [3.6, -7],
      [-3.6, 13], [3.6, 13], [-3.6, -13], [3.6, -13],
      [-10, 3], [10, 3], [-10, -3], [10, -3],
    ].map(([lx, lz]) => createStreetLight(scene, lx, lz));

    // STUNUR neon sign
    const neonSignMat = new THREE.MeshStandardMaterial({ color: 0xff0033, emissive: 0xff0033, emissiveIntensity: 2.5 });
    const neonSign = new THREE.Mesh(new THREE.BoxGeometry(5, 0.5, 0.1), neonSignMat);
    neonSign.position.set(0, 9.5, -12.5); scene.add(neonSign);
    const neonSignLight = new THREE.PointLight(0xff0033, 2.5, 10); neonSignLight.position.set(0, 9.5, -12); scene.add(neonSignLight);

    // Characters
    const charTypes: CharType[] = ['stunur', 'stunur', 'stunur', 'wojak', 'wojak', 'pepe', 'pepe', 'doge', 'doge', 'stunur', 'pepe', 'wojak'];
    const characters = charTypes.map((type, i) => {
      const a = (i / charTypes.length) * Math.PI * 2;
      const r = 2 + Math.random() * 9;
      return createCharacter(scene, Math.cos(a) * r, Math.sin(a) * r, type);
    });

    // Smoke systems - follow character positions
    const smokeSystems = characters.map(ch =>
      createSmokeSystem(scene, () => {
        const wp = new THREE.Vector3(); ch.group.getWorldPosition(wp);
        return wp.add(new THREE.Vector3(0.35 * ch.group.scale.x, 1.1 * ch.group.scale.y, 0.06));
      })
    );

    // Cars
    const carColors = [0xcc2200, 0x002299, 0x229900, 0xccaa00, 0x888888, 0xffffff, 0xff8800, 0x6600cc];
    const cars = Array.from({ length: 10 }, (_, i) => {
      const axis: 'x' | 'z' = i % 2 === 0 ? 'x' : 'z';
      const dir = Math.random() > 0.5 ? 1 : -1;
      const lane = (Math.random() > 0.5 ? 1 : -1) * 1.3;
      const start = -20 + Math.random() * 40;
      return { mesh: createCar(scene, axis === 'x' ? start : lane, axis === 'z' ? start : lane, carColors[i % 8], axis, dir), speed: 0.045 + Math.random() * 0.055, axis, dir };
    });

    // Camera
    let camTheta = 0.4, camPhi = 0.38, camRadius = 16;
    let autoOrbit = true, isDragging = false;
    let lastMouse = { x: 0, y: 0 };
    const onMouseDown = (e: MouseEvent) => { isDragging = true; autoOrbit = false; lastMouse = { x: e.clientX, y: e.clientY }; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      camTheta -= (e.clientX - lastMouse.x) * 0.005;
      camPhi = Math.max(0.1, Math.min(1.3, camPhi + (e.clientY - lastMouse.y) * 0.005));
      lastMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e: WheelEvent) => { e.preventDefault(); camRadius = Math.max(5, Math.min(35, camRadius + e.deltaY * 0.02)); };
    const onTouchStart = (e: TouchEvent) => { isDragging = true; autoOrbit = false; lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      camTheta -= (e.touches[0].clientX - lastMouse.x) * 0.005;
      camPhi = Math.max(0.1, Math.min(1.3, camPhi + (e.touches[0].clientY - lastMouse.y) * 0.005));
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

    hudCanvas.width = container.clientWidth;
    hudCanvas.height = container.clientHeight;

    let frame = 0, locTimer = 0, locIdx = 0;
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      frame++;

      // Day/night (1200 frames = full cycle)
      const timeOfDay = (frame % 1200) / 1200;
      const dayT = Math.sin(timeOfDay * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5;
      const skyC = new THREE.Color(0x030508).lerp(new THREE.Color(dayT < 0.5 ? 0x100508 : 0x0d1a2e), Math.min(1, dayT * 2));
      scene.background = skyC; (scene.fog as THREE.FogExp2).color = skyC;
      sunLight.intensity = 0.3 + dayT * 2.0;
      sunLight.color.setHSL(0.1, 0.3 + dayT * 0.4, 0.5 + dayT * 0.4);
      ambientLight.intensity = 0.3 + dayT * 0.8;
      stars.visible = dayT < 0.4; moonMesh.visible = dayT < 0.35; sunMesh.visible = dayT > 0.3;
      sunMesh.position.set(Math.cos(timeOfDay * Math.PI * 2 + Math.PI) * 28, Math.sin(timeOfDay * Math.PI * 2 + Math.PI) * 28, -30);

      const nightOn = dayT < 0.3;
      streetLights.forEach(sl => { sl.light.intensity = nightOn ? 1.0 : 0; sl.bulbMat.emissiveIntensity = nightOn ? 1.8 : 0; });
      weedStores.forEach(ws => { ws.neonLight.intensity = nightOn ? 2.5 : 1.0; });
      neonSignMat.emissiveIntensity = 1.8 + Math.sin(frame * 0.06) * 0.7;
      neonSignLight.intensity = 2.0 + Math.sin(frame * 0.06) * 0.8;
      blinkMeshes.forEach((b, i) => { (b.material as THREE.MeshStandardMaterial).emissiveIntensity = Math.floor((frame + i * 20) / 35) % 2 === 0 ? 1 : 0; });
      redFill.intensity = (0.8 + Math.sin(frame * 0.02) * 0.3) * (1.2 - dayT * 0.7);
      blueFill.intensity = (0.7 + Math.cos(frame * 0.018) * 0.3) * (1.2 - dayT * 0.7);
      greenFill.intensity = (0.5 + Math.sin(frame * 0.015) * 0.2) * (1.2 - dayT * 0.6);

      // Characters
      characters.forEach((ch, i) => {
        smokeSystems[i].update(frame);
        if (ch.paused) { ch.pauseTimer--; if (ch.pauseTimer <= 0) ch.paused = false; return; }
        if (Math.random() < 0.006) {
          ch.targetAngle = Math.random() * Math.PI * 2;
          if (Math.random() < 0.12) { ch.paused = true; ch.pauseTimer = 70 + Math.floor(Math.random() * 150); }
        }
        let diff = ch.targetAngle - ch.angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        ch.angle += diff * 0.04;
        ch.group.position.x += Math.sin(ch.angle) * ch.speed;
        ch.group.position.z += Math.cos(ch.angle) * ch.speed;
        if (Math.abs(ch.group.position.x) > 16 || Math.abs(ch.group.position.z) > 16) {
          ch.targetAngle = Math.atan2(-ch.group.position.x, -ch.group.position.z) + (Math.random() - 0.5);
        }
        ch.group.rotation.y = ch.angle;
        ch.walkPhase += 0.13;
        ch.leftLeg.rotation.x = Math.sin(ch.walkPhase) * 0.45;
        ch.rightLeg.rotation.x = -Math.sin(ch.walkPhase) * 0.45;
        ch.leftArm.rotation.x = -Math.sin(ch.walkPhase) * 0.25;
        ch.emberMat.emissiveIntensity = 2.5 + Math.sin(frame * 0.18 + i) * 0.8;
        ch.emberLight.intensity = 0.5 + Math.sin(frame * 0.18 + i) * 0.2;
      });

      // Cars
      cars.forEach(car => {
        const p = car.mesh.position;
        if (car.axis === 'x') { p.x += car.speed * car.dir; if (Math.abs(p.x) > 22) p.x = -22 * car.dir; }
        else { p.z += car.speed * car.dir; if (Math.abs(p.z) > 22) p.z = -22 * car.dir; }
      });

      // Camera
      if (autoOrbit) camTheta += 0.0015;
      camera.position.x = camRadius * Math.sin(camTheta) * Math.cos(camPhi);
      camera.position.y = camRadius * Math.sin(camPhi) + 1;
      camera.position.z = camRadius * Math.cos(camTheta) * Math.cos(camPhi);
      camera.lookAt(0, 1.5, 0);

      // Scan location
      locTimer++;
      if (locTimer > 200) { locTimer = 0; locIdx = (locIdx + 1) % SCAN_LOCATIONS.length; setScanLocation(SCAN_LOCATIONS[locIdx]); }

      // HUD
      const hCtx = hudCanvas.getContext('2d');
      if (hCtx) drawHUD(hCtx, hudCanvas.width, hudCanvas.height, frame, SCAN_LOCATIONS[locIdx], timeOfDay);

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      hudCanvas.width = container.clientWidth;
      hudCanvas.height = container.clientHeight;
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
      smokeSystems.forEach(s => s.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section id="stoner-scanner" style={{ padding: '48px 16px', background: '#080808' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');`}</style>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ color: '#cc0000', fontSize: 18 }}>🛸</span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.4rem,3vw,2rem)', letterSpacing: '0.15em', color: '#fff' }}>GLOBAL STUNUR SCANNER</span>
      </div>
      <p style={{ textAlign: 'center', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: 16 }}>
        DRAG TO ORBIT · SCROLL TO ZOOM · STUNUR CITY LIVE · NOW SCANNING: {scanLocation}
      </p>
      <div style={{ position: 'relative', width: '100%', maxWidth: 960, margin: '0 auto' }}>
        <div ref={mountRef} style={{ width: '100%', height: 560, borderRadius: 2, overflow: 'hidden', cursor: 'grab', border: '1px solid rgba(0,255,80,0.15)', boxShadow: '0 0 60px rgba(0,255,80,0.04), 0 0 30px rgba(255,0,50,0.04)' }} />
        <canvas ref={hudRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', borderRadius: 2 }} />
        {[
          { top: 0, left: 0, borderTop: '2px solid rgba(0,255,80,0.6)', borderLeft: '2px solid rgba(0,255,80,0.6)' },
          { top: 0, right: 0, borderTop: '2px solid rgba(0,255,80,0.6)', borderRight: '2px solid rgba(0,255,80,0.6)' },
          { bottom: 0, left: 0, borderBottom: '2px solid rgba(0,255,80,0.6)', borderLeft: '2px solid rgba(0,255,80,0.6)' },
          { bottom: 0, right: 0, borderBottom: '2px solid rgba(0,255,80,0.6)', borderRight: '2px solid rgba(0,255,80,0.6)' },
        ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 20, height: 20, pointerEvents: 'none', ...s }} />)}
      </div>
    </section>
  );
}
