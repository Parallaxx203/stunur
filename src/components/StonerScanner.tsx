import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const SCAN_LOCATIONS = [
  'AMSTERDAM', 'LOS ANGELES', 'TOKYO', 'BERLIN', 'TEL AVIV',
  'LONDON', 'DUBAI', 'TORONTO', 'PARIS', 'SEATTLE',
  'BANGKOK', 'MELBOURNE', 'LAGOS', 'SÃO PAULO', 'SINGAPORE',
  'MOSCOW', 'NEW YORK', 'HONG KONG', 'SYDNEY', 'MIAMI',
];

const STUNUR_FACTS = [
  'STUNUR NEVER LEFT', '$STUNUR IS NOT A TOKEN', 'STUNUR NEVER FOLDS',
  'BUILT FROM THE TRENCHES', 'STUNUR TURNS LOSSES INTO MOTION',
  'WE ARE STUNUR', 'STUNUR KEEPS MOVING', 'BECOME STUNUR',
];

// ── HELPERS ──────────────────────────────────────────────────────────────────
function mat(color: number, emissive = 0, ei = 0, rough = 0.8, metal = 0.1) {
  return new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: ei, roughness: rough, metalness: metal });
}
function box(w: number, h: number, d: number, m: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.castShadow = true; mesh.receiveShadow = true;
  return mesh;
}
function cyl(rt: number, rb: number, h: number, s: number, m: THREE.Material) {
  return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, s), m);
}

// ── SMOKE ────────────────────────────────────────────────────────────────────
function makeSmoke(scene: THREE.Scene, getPos: () => THREE.Vector3) {
  const particles: Array<{ m: THREE.Mesh; v: THREE.Vector3; life: number; max: number }> = [];
  function spawn() {
    const p = getPos();
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.04 + Math.random() * 0.03, 4, 4),
      new THREE.MeshBasicMaterial({ color: 0xbbbbbb, transparent: true, opacity: 0.15, depthWrite: false })
    );
    mesh.position.copy(p);
    scene.add(mesh);
    particles.push({ m: mesh, v: new THREE.Vector3((Math.random()-.5)*.007, .02+Math.random()*.01, (Math.random()-.5)*.007), life: 0, max: 50+Math.floor(Math.random()*25) });
  }
  return {
    update(frame: number) {
      if (frame % 14 === 0 && particles.length < 6) spawn();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]; p.life++;
        p.m.position.add(p.v);
        p.m.scale.setScalar(1 + p.life * 0.05);
        (p.m.material as THREE.MeshBasicMaterial).opacity = 0.15 * (1 - p.life / p.max);
        if (p.life >= p.max) { scene.remove(p.m); particles.splice(i, 1); }
      }
    },
    dispose() { particles.forEach(p => scene.remove(p.m)); particles.length = 0; }
  };
}

// ── BUILDING ─────────────────────────────────────────────────────────────────
function makeBuilding(scene: THREE.Scene, x: number, z: number, w: number, d: number, h: number, label?: string) {
  const g = new THREE.Group();
  const bc = new THREE.Color().setHSL(Math.random(), 0.07, 0.07 + Math.random() * 0.06);
  const body = box(w, h, d, mat(bc.getHex(), 0, 0, 0.9));
  body.position.y = h / 2; g.add(body);

  // Windows
  const rows = Math.max(1, Math.floor(h / 0.65));
  const cols = Math.max(1, Math.floor(w / 0.55));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() > 0.3) {
        const lit = Math.random() > 0.35;
        const wc = lit ? (Math.random() > 0.5 ? 0xffdd88 : 0x88ccff) : 0x111111;
        const wm = new THREE.MeshStandardMaterial({ color: wc, emissive: lit ? wc : 0, emissiveIntensity: lit ? 0.9 : 0 });
        const win = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.28), wm);
        win.position.set((c - cols/2 + 0.5)*(w/cols), 0.4 + r*0.6, d/2+0.01);
        g.add(win);
      }
    }
  }

  // Rooftop
  const roof = box(w+0.1, 0.12, d+0.1, mat(0x1a1a1a)); roof.position.y = h+0.06; g.add(roof);
  const blinkMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1 });
  const blink = new THREE.Mesh(new THREE.SphereGeometry(0.07, 5, 5), blinkMat);
  blink.position.y = h+0.25; g.add(blink);

  // Water tower
  if (Math.random() > 0.55) {
    const tank = cyl(0.25, 0.25, 0.5, 8, mat(0x553311)); tank.position.set(w*0.3, h+0.35, 0); g.add(tank);
  }

  // Label sign
  if (label) {
    const lc = label === 'STUNUR' ? 0xcc0000 : label === 'WEED' ? 0x00cc44 : 0x0044cc;
    const lm = new THREE.MeshStandardMaterial({ color: lc, emissive: lc, emissiveIntensity: 1.5 });
    const sign = box(w*0.85, 0.32, 0.07, lm); sign.position.set(0, 0.9, d/2+0.06); g.add(sign);
    const sl = new THREE.PointLight(lc, 2, 5); sl.position.set(0, 0.9, d/2+0.6); g.add(sl);
  }

  g.position.set(x, 0, z); scene.add(g);
  return { blink };
}

// ── WEED STORE ───────────────────────────────────────────────────────────────
function makeWeedStore(scene: THREE.Scene, x: number, z: number) {
  const g = new THREE.Group();
  const body = box(3.5, 2.2, 3, mat(0x1a2e1a, 0, 0, 0.9)); body.position.y = 1.1; g.add(body);
  const awning = box(4, 0.12, 1.2, mat(0x2d7a2d, 0x1a4a1a, 0.3)); awning.position.set(0, 2.35, 1.8); g.add(awning);
  const nm = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00ff44, emissiveIntensity: 2.5 });
  const neon = box(2.2, 0.28, 0.06, nm); neon.position.set(0, 1.9, 1.55); g.add(neon);
  const nl = new THREE.PointLight(0x00ff44, 2.5, 7); nl.position.set(0, 1.9, 2); g.add(nl);
  const lm = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00ff44, emissiveIntensity: 1.5 });
  const l1 = box(0.08, 0.5, 0.06, lm); l1.position.set(0, 1.3, 1.56); g.add(l1);
  const l2 = box(0.5, 0.08, 0.06, lm); l2.position.set(0, 1.3, 1.56); g.add(l2);
  g.position.set(x, 0, z); scene.add(g);
  return { neonLight: nl, neonMat: nm };
}

// ── STREET LIGHT ─────────────────────────────────────────────────────────────
function makeLight(scene: THREE.Scene, x: number, z: number) {
  const pm = mat(0x333333);
  const pole = cyl(0.04, 0.04, 2.4, 5, pm); pole.position.set(x, 1.2, z); scene.add(pole);
  const arm = cyl(0.022, 0.022, 0.55, 4, pm); arm.rotation.z = Math.PI/2; arm.position.set(x+0.27, 2.35, z); scene.add(arm);
  const bm = new THREE.MeshStandardMaterial({ color: 0xfffde0, emissive: 0xfffde0, emissiveIntensity: 1.8 });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), bm); bulb.position.set(x+0.54, 2.35, z); scene.add(bulb);
  const light = new THREE.PointLight(0xffee88, 1.0, 5); light.position.set(x+0.54, 2.3, z); scene.add(light);
  return { light, bulbMat: bm };
}

// ── CAR ───────────────────────────────────────────────────────────────────────
function makeCar(scene: THREE.Scene, x: number, z: number, color: number, axis: 'x'|'z', dir: number) {
  const g = new THREE.Group();
  const b = box(0.85, 0.3, 1.7, mat(color, 0, 0, 0.3, 0.7)); b.position.y = 0.22; g.add(b);
  const c = box(0.68, 0.24, 0.9, mat(color, 0, 0, 0.3, 0.7)); c.position.set(0, 0.49, -0.05); g.add(c);
  const wheelPos: [number,number,number][] = [[-0.44,0.14,0.52],[0.44,0.14,0.52],[-0.44,0.14,-0.52],[0.44,0.14,-0.52]];
  wheelPos.forEach(([wx,wy,wz]) => { const w = cyl(0.13,0.13,0.1,8,mat(0x111111,0,0,1)); w.rotation.z = Math.PI/2; w.position.set(wx,wy,wz); g.add(w); });
  const hm = new THREE.MeshStandardMaterial({ color:0xffffff, emissive:0xffffff, emissiveIntensity:1 });
  const tm = new THREE.MeshStandardMaterial({ color:0xff1100, emissive:0xff1100, emissiveIntensity:1 });
  const headPos: [number,number,number][] = [[-0.26,0.22,0.86],[0.26,0.22,0.86]];
  headPos.forEach(([hx,hy,hz]) => { const h = box(0.13,0.07,0.02,hm); h.position.set(hx,hy,hz); g.add(h); });
  const tailPos: [number,number,number][] = [[-0.26,0.22,-0.86],[0.26,0.22,-0.86]];
  tailPos.forEach(([tx,ty,tz]) => { const t = box(0.13,0.07,0.02,tm); t.position.set(tx,ty,tz); g.add(t); });
  g.position.set(x, 0, z);
  if (axis === 'x') g.rotation.y = dir > 0 ? 0 : Math.PI;
  else g.rotation.y = dir > 0 ? Math.PI/2 : -Math.PI/2;
  scene.add(g);
  return g;
}

// ── CHARACTER ─────────────────────────────────────────────────────────────────
type CharType = 'stunur'|'wojak'|'pepe'|'doge';
function makeChar(scene: THREE.Scene, x: number, z: number, type: CharType) {
  const g = new THREE.Group();
  const C = {
    stunur:{ body:0xeeeeee, head:0xd4b896, eye:0xff0000 },
    wojak: { body:0x4455cc, head:0xf5d5b8, eye:0x334499 },
    pepe:  { body:0x33aa33, head:0x55cc33, eye:0x111100 },
    doge:  { body:0xddaa55, head:0xddaa55, eye:0x332200 },
  }[type];
  const bm = mat(C.body, C.body, 0.2);
  const hm = mat(C.head, C.head, 0.1);
  const em = new THREE.MeshStandardMaterial({ color:C.eye, emissive:C.eye, emissiveIntensity:0.8 });
  const dm = mat(0x222222);

  const torso = cyl(0.1,0.12,0.55,6,bm); torso.position.y = 0.9; g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(type==='doge'?0.16:0.155, 8, 8), hm);
  if (type==='doge') head.scale.set(1.2,0.9,1.3);
  if (type==='pepe') head.scale.set(1,0.85,1.1);
  head.position.y = 1.32; g.add(head);

  if (type==='pepe') { const lip=box(0.18,0.06,0.05,mat(0x228822)); lip.position.set(0,1.2,0.14); g.add(lip); }
  if (type==='doge') {
    const earPos: [number,number,number][] = [[-0.14,1.46,0],[0.14,1.46,0]];
    earPos.forEach(([ex,ey,ez]) => { const ear=new THREE.Mesh(new THREE.SphereGeometry(0.06,5,5),hm); ear.scale.set(1,1.5,0.5); ear.position.set(ex,ey,ez); g.add(ear); });
  }
  if (type==='wojak') { const tm=new THREE.MeshStandardMaterial({color:0x88aaff,emissive:0x88aaff,emissiveIntensity:0.5}); const tear=new THREE.Mesh(new THREE.SphereGeometry(0.025,4,4),tm); tear.position.set(0.07,1.22,0.14); g.add(tear); }
  if (type==='stunur') {
    const hm2 = new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xffffff,emissiveIntensity:0.15});
    for (let i=0;i<7;i++) { const a=(i/7)*Math.PI*2; const sp=cyl(0,0.04,0.18,4,hm2); sp.position.set(Math.cos(a)*0.1,1.52,Math.sin(a)*0.08); sp.rotation.z=Math.cos(a)*0.5; sp.rotation.x=Math.sin(a)*0.5; g.add(sp); }
  }

  const eyeP: [number,number][] = [[-0.06,0],[0.06,0]];
  eyeP.forEach(([ex]) => { const eye=new THREE.Mesh(new THREE.SphereGeometry(0.028,5,5),em); eye.position.set(ex,1.34,0.14); g.add(eye); });

  const lArm = cyl(0.028,0.028,0.38,4,bm); lArm.position.set(-0.19,0.95,0); lArm.rotation.z = Math.PI/4; g.add(lArm);
  const rArm = cyl(0.028,0.028,0.38,4,bm); rArm.position.set(0.19,0.95,0); rArm.rotation.z = -Math.PI/5; g.add(rArm);
  const lLeg = cyl(0.035,0.035,0.45,4,dm); lLeg.position.set(-0.09,0.42,0); g.add(lLeg);
  const rLeg = cyl(0.035,0.035,0.45,4,dm); rLeg.position.set(0.09,0.42,0); g.add(rLeg);

  const cig = cyl(0.016,0.016,0.2,4,mat(0xf0ead6)); cig.rotation.z = Math.PI/2.2; cig.position.set(0.3,0.98,0.06); g.add(cig);
  const emberMat = new THREE.MeshStandardMaterial({color:0xff5500,emissive:0xff4400,emissiveIntensity:3});
  const ember = new THREE.Mesh(new THREE.SphereGeometry(0.022,4,4),emberMat); ember.position.set(0.37,0.92,0.06); g.add(ember);
  const eLight = new THREE.PointLight(0xff4400,0.6,1.2); eLight.position.set(0.37,0.92,0.06); g.add(eLight);

  g.position.set(x,0,z); g.scale.setScalar(0.75+Math.random()*0.3); scene.add(g);
  return { g, lLeg, rLeg, lArm, ember, emberMat, eLight, speed:0.01+Math.random()*0.018, angle:Math.random()*Math.PI*2, targetAngle:Math.random()*Math.PI*2, walkPhase:Math.random()*Math.PI*2, paused:false, pauseTimer:0 };
}

// ── HUD CANVAS ────────────────────────────────────────────────────────────────
function drawHUD(ctx: CanvasRenderingContext2D, W: number, H: number, frame: number, loc: string, tod: number, radarBlips: {x:number,z:number,color:string}[]) {
  ctx.clearRect(0,0,W,H);
  const mono = '"Share Tech Mono",monospace';

  // ── TOP LEFT: STATUS PANEL ──
  ctx.fillStyle='rgba(0,4,0,0.82)'; ctx.fillRect(10,10,230,100);
  ctx.strokeStyle='rgba(0,255,80,0.5)'; ctx.lineWidth=1; ctx.strokeRect(10,10,230,100);
  ctx.fillStyle='#00ff88'; ctx.font=`bold 12px ${mono}`; ctx.fillText('◈ STUNUR CITY · LIVE',18,27);
  ctx.fillStyle='rgba(0,255,80,0.45)'; ctx.font=`9px ${mono}`;
  const todLabel = tod<0.25?'🌅 DAWN':tod<0.5?'☀️  DAY':tod<0.75?'🌆 DUSK':'🌙 NIGHT';
  ctx.fillText(`TIME: ${todLabel}`,18,42);
  ctx.fillText('CHARS: STUNUR · WOJAK · PEPE · DOGE',18,56);
  ctx.fillText('WEED STORES: 3  ·  SMOKE: ACTIVE',18,70);
  ctx.fillText(`FRAME: ${frame}  ·  NODES: ${SCAN_LOCATIONS.length}`,18,84);
  // live dot
  if (Math.floor(frame/15)%2===0) {
    ctx.beginPath(); ctx.arc(220,18,4,0,Math.PI*2);
    ctx.fillStyle='#00ff88'; ctx.shadowColor='#00ff88'; ctx.shadowBlur=6; ctx.fill(); ctx.shadowBlur=0;
  }

  // ── TOP RIGHT: SCAN PANEL ──
  const sw=210, sh=90;
  ctx.fillStyle='rgba(0,0,8,0.85)'; ctx.fillRect(W-sw-10,10,sw,sh);
  ctx.strokeStyle='rgba(204,0,50,0.65)'; ctx.lineWidth=1; ctx.strokeRect(W-sw-10,10,sw,sh);
  ctx.fillStyle='#ff4466'; ctx.font=`bold 9px ${mono}`; ctx.fillText('▶ SCANNING LOCATION',W-sw-2,25);
  ctx.fillStyle='#fff'; ctx.font=`bold 15px ${mono}`; ctx.fillText(loc,W-sw-2,45);
  const scanY = 10+(frame%80)/80*sh;
  ctx.fillStyle='rgba(255,68,100,0.12)'; ctx.fillRect(W-sw-10,scanY,sw,3);
  ctx.fillStyle='rgba(255,68,100,0.7)'; ctx.fillRect(W-sw-10,scanY,sw,1);
  if (Math.floor(frame/15)%2===0) {
    ctx.beginPath(); ctx.arc(W-18,60,5,0,Math.PI*2);
    ctx.fillStyle='#ff4466'; ctx.shadowColor='#ff4466'; ctx.shadowBlur=8; ctx.fill(); ctx.shadowBlur=0;
  }
  ctx.fillStyle='rgba(255,68,100,0.5)'; ctx.font=`8px ${mono}`;
  const det = Math.floor(28+Math.sin(frame*0.04)*15);
  ctx.fillText(`${det} STUNURS DETECTED`,W-sw-2,72);
  // scan progress bar
  ctx.fillStyle='rgba(255,68,100,0.15)'; ctx.fillRect(W-sw-2,80,sw-16,6);
  ctx.fillStyle='rgba(255,68,100,0.8)'; ctx.fillRect(W-sw-2,80,(sw-16)*(frame%120)/120,6);

  // ── BOTTOM LEFT: RADAR ──
  const cx=62, cy=H-68, r=50;
  // Radar bg
  ctx.fillStyle='rgba(0,4,0,0.85)'; ctx.beginPath(); ctx.arc(cx,cy,r+8,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='rgba(0,255,80,0.35)'; ctx.lineWidth=1;
  // Rings
  for (let ri=1;ri<=3;ri++) { ctx.beginPath(); ctx.arc(cx,cy,r*ri/3,0,Math.PI*2); ctx.stroke(); }
  // Cross
  ctx.beginPath(); ctx.moveTo(cx-r,cy); ctx.lineTo(cx+r,cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx,cy-r); ctx.lineTo(cx,cy+r); ctx.stroke();
  // Diagonal lines
  ctx.strokeStyle='rgba(0,255,80,0.12)';
  ctx.beginPath(); ctx.moveTo(cx-r*.7,cy-r*.7); ctx.lineTo(cx+r*.7,cy+r*.7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+r*.7,cy-r*.7); ctx.lineTo(cx-r*.7,cy+r*.7); ctx.stroke();
  // Sweep
  const sa=(frame*0.045)%(Math.PI*2);
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,sa-1.2,sa);
  ctx.fillStyle='rgba(0,255,80,0.18)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(sa)*r,cy+Math.sin(sa)*r);
  ctx.strokeStyle='rgba(0,255,80,0.9)'; ctx.lineWidth=1.5; ctx.stroke();
  // Character blips from actual 3D positions
  radarBlips.forEach(b => {
    const bx = cx + (b.x/20)*r;
    const by = cy + (b.z/20)*r;
    if (Math.abs(bx-cx)<r && Math.abs(by-cy)<r) {
      ctx.beginPath(); ctx.arc(bx,by,2.5,0,Math.PI*2);
      ctx.fillStyle=b.color; ctx.shadowColor=b.color; ctx.shadowBlur=4; ctx.fill(); ctx.shadowBlur=0;
    }
  });
  // Radar label
  ctx.fillStyle='rgba(0,255,80,0.4)'; ctx.font=`7px ${mono}`; ctx.textAlign='center';
  ctx.fillText('STUNUR RADAR',cx,cy+r+16); ctx.textAlign='left';
  // Outer ring
  ctx.strokeStyle='rgba(0,255,80,0.5)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.arc(cx,cy,r+3,0,Math.PI*2); ctx.stroke();

  // ── BOTTOM CENTER-RIGHT: MINI WORLD MAP ──
  const mx=W/2-80, my=H-95, mw=160, mh=70;
  ctx.fillStyle='rgba(0,4,0,0.85)'; ctx.fillRect(mx,my,mw,mh);
  ctx.strokeStyle='rgba(0,255,80,0.35)'; ctx.lineWidth=1; ctx.strokeRect(mx,my,mw,mh);
  ctx.fillStyle='rgba(0,255,80,0.06)';
  // Simplified continent fills
  const continents = [
    [[0.04,0.15],[0.26,0.08],[0.30,0.45],[0.18,0.75],[0.08,0.70],[0.04,0.45]], // N+S America
    [[0.44,0.12],[0.58,0.10],[0.60,0.45],[0.52,0.65],[0.42,0.55],[0.42,0.22]], // Europe+Africa
    [[0.55,0.08],[0.92,0.10],[0.92,0.55],[0.78,0.72],[0.60,0.55],[0.54,0.25]], // Asia+Australia
  ];
  continents.forEach(poly => {
    ctx.beginPath();
    ctx.moveTo(mx+poly[0][0]*mw, my+poly[0][1]*mh);
    poly.slice(1).forEach(([px,py]) => ctx.lineTo(mx+px*mw, my+py*mh));
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(0,255,80,0.2)'; ctx.stroke();
  });
  // Scan location dot on mini map
  const locDots: Record<string,[number,number]> = {
    'AMSTERDAM':[0.495,0.22],'LOS ANGELES':[0.11,0.35],'TOKYO':[0.82,0.3],'BERLIN':[0.50,0.20],
    'TEL AVIV':[0.545,0.35],'LONDON':[0.465,0.20],'DUBAI':[0.575,0.38],'TORONTO':[0.16,0.25],
    'PARIS':[0.475,0.22],'SEATTLE':[0.09,0.22],'BANGKOK':[0.74,0.42],'MELBOURNE':[0.82,0.72],
    'LAGOS':[0.465,0.50],'SÃO PAULO':[0.21,0.65],'SINGAPORE':[0.76,0.48],'MOSCOW':[0.57,0.18],
    'NEW YORK':[0.175,0.28],'HONG KONG':[0.79,0.36],'SYDNEY':[0.845,0.70],'MIAMI':[0.16,0.38],
  };
  const ldot = locDots[loc];
  if (ldot) {
    ctx.beginPath(); ctx.arc(mx+ldot[0]*mw, my+ldot[1]*mh, 3, 0, Math.PI*2);
    ctx.fillStyle='#ff4466'; ctx.shadowColor='#ff4466'; ctx.shadowBlur=6; ctx.fill(); ctx.shadowBlur=0;
    // Pulse ring
    const pr = 3 + (frame%30)/30*8;
    const pa = 1-(frame%30)/30;
    ctx.beginPath(); ctx.arc(mx+ldot[0]*mw, my+ldot[1]*mh, pr, 0, Math.PI*2);
    ctx.strokeStyle=`rgba(255,68,100,${pa*0.6})`; ctx.lineWidth=1; ctx.stroke();
  }
  ctx.fillStyle='rgba(0,255,80,0.35)'; ctx.font=`7px ${mono}`; ctx.textAlign='center';
  ctx.fillText('WORLD MAP · SCANNING',mx+mw/2,my+mh+12); ctx.textAlign='left';

  // ── BOTTOM STATUS BAR ──
  ctx.fillStyle='rgba(0,3,0,0.9)'; ctx.fillRect(0,H-22,W,22);
  ctx.strokeStyle='rgba(0,255,80,0.18)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(0,H-22); ctx.lineTo(W,H-22); ctx.stroke();
  const items=['SYSTEM: ONLINE','STUNUR CITY: LIVE','SMOKE: ACTIVE',`SCANNING: ${loc}`,'ALL CHARS ACTIVE','3D ENGINE: OK'];
  const iw=W/items.length;
  items.forEach((item,i) => {
    ctx.fillStyle=`rgba(0,255,80,${i===3?0.7:0.3})`; ctx.font=`8px ${mono}`;
    ctx.fillText(`· ${item}`, i*iw+6, H-7);
  });

  // ── CORNER BRACKETS ──
  ctx.strokeStyle='rgba(0,255,80,0.55)'; ctx.lineWidth=2;
  [[10,10,1,1],[W-10,10,-1,1],[10,H-10,1,-1],[W-10,H-10,-1,-1]].forEach(([bx,by,sx,sy]) => {
    ctx.beginPath(); ctx.moveTo(bx,by+sy*18); ctx.lineTo(bx,by); ctx.lineTo(bx+sx*18,by); ctx.stroke();
  });

  // ── SCROLLING FACT TICKER (right side) ──
  const factIdx = Math.floor(frame/120) % STUNUR_FACTS.length;
  const fact = STUNUR_FACTS[factIdx];
  ctx.save();
  ctx.fillStyle='rgba(0,4,0,0.7)'; ctx.fillRect(W-205,H-118,195,18);
  ctx.fillStyle='rgba(0,255,80,0.4)'; ctx.font=`8px ${mono}`;
  ctx.fillText(`◆ ${fact}`, W-202, H-107);
  ctx.restore();
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export function StonerScanner() {
  const mountRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLCanvasElement>(null);
  const [scanLoc, setScanLoc] = useState(SCAN_LOCATIONS[0]);

  useEffect(() => {
    const container = mountRef.current;
    const hudCanvas = hudRef.current;
    if (!container || !hudCanvas) return;

    const scene = new THREE.Scene();
    const isMobile = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(52, container.clientWidth/container.clientHeight, 0.1, 120);
    camera.position.set(0, 9, 16); camera.lookAt(0, 1, 0);

    scene.background = new THREE.Color(0x030508);
    scene.fog = new THREE.FogExp2(0x030508, 0.026);

    // Lights
    const ambient = new THREE.AmbientLight(0x111122, 0.6); scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfff5cc, 1.5);
    sun.position.set(-15,25,10); sun.castShadow = !isMobile;
    if (!isMobile) { sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.left=-30; sun.shadow.camera.right=30; sun.shadow.camera.top=30; sun.shadow.camera.bottom=-30; sun.shadow.camera.far=80; }
    scene.add(sun);
    const redFill = new THREE.PointLight(0xff0033,1.2,18); redFill.position.set(-6,4,-6); scene.add(redFill);
    const blueFill = new THREE.PointLight(0x0033ff,1.0,18); blueFill.position.set(6,4,-6); scene.add(blueFill);
    const greenFill = new THREE.PointLight(0x00ff44,0.7,14); greenFill.position.set(0,3,6); scene.add(greenFill);

    // Stars + moon + sun mesh
    const sv: number[] = [];
    for (let i=0;i<300;i++) sv.push((Math.random()-.5)*100, 12+Math.random()*40, (Math.random()-.5)*100);
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(sv,3));
    const stars = new THREE.Points(sg, new THREE.PointsMaterial({color:0xffffff,size:0.12})); scene.add(stars);
    const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(1.8,16,16), new THREE.MeshStandardMaterial({color:0xddddc8,emissive:0x443322,emissiveIntensity:0.4}));
    moonMesh.position.set(-14,22,-25); scene.add(moonMesh);
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(2.2,16,16), new THREE.MeshStandardMaterial({color:0xffee88,emissive:0xffcc44,emissiveIntensity:2}));
    sunMesh.position.set(20,30,-30); scene.add(sunMesh);

    // Ground + roads
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80,80), mat(0x0e0e0e,0,0,1));
    ground.rotation.x = -Math.PI/2; ground.receiveShadow = true; scene.add(ground);
    [[0,0,80,5],[0,0,5,80],[-14,0,2.5,80],[14,0,2.5,80]].forEach(([rx,rz,rw,rd]) => {
      const r = new THREE.Mesh(new THREE.PlaneGeometry(rw,rd), mat(0x181818,0,0,0.95));
      r.rotation.x = -Math.PI/2; r.position.set(rx,0.005,rz); scene.add(r);
    });
    // Road markings
    const lm = mat(0xffcc00,0xffcc00,0.2);
    for (let i=-9;i<=9;i+=2) {
      const l1 = new THREE.Mesh(new THREE.PlaneGeometry(1.6,0.07),lm); l1.rotation.x=-Math.PI/2; l1.position.set(i*2,0.01,0); scene.add(l1);
      const l2 = new THREE.Mesh(new THREE.PlaneGeometry(0.07,1.6),lm); l2.rotation.x=-Math.PI/2; l2.position.set(0,0.01,i*2); scene.add(l2);
    }

    // Buildings
    const bDefs = [
      {x:-9,z:-9,w:3.5,d:3.5,h:7,label:'STUNUR'},{x:-9,z:-16,w:2.5,d:2.5,h:10},
      {x:-9,z:9,w:3,d:3,h:5},{x:9,z:-9,w:3,d:3,h:9},{x:9,z:9,w:2.5,d:2.5,h:11},
      {x:-18,z:9,w:3.5,d:3.5,h:8},{x:18,z:-9,w:3,d:3,h:6},{x:9,z:16,w:3,d:3,h:7},
      {x:-9,z:16,w:2.8,d:2.8,h:5},{x:18,z:9,w:2.5,d:2.5,h:9},{x:-18,z:-9,w:3,d:3,h:6},
    ];
    const blinks: THREE.Mesh[] = [];
    bDefs.forEach(({x,z,w,d,h,label}) => { const {blink} = makeBuilding(scene,x,z,w,d,h,label); blinks.push(blink); });

    // Weed stores
    const weedStores = [makeWeedStore(scene,-5.5,4.5), makeWeedStore(scene,5.5,-4.5), makeWeedStore(scene,0,-18)];

    // Street lights
    const lightPos: [number,number][] = [[-3.6,7],[3.6,7],[-3.6,-7],[3.6,-7],[-3.6,13],[3.6,13],[-3.6,-13],[3.6,-13],[-10,3],[10,3],[-10,-3],[10,-3]];
    const streetLights = lightPos.map(([lx,lz]) => makeLight(scene,lx,lz));

    // STUNUR neon sign
    const neonSignMat = new THREE.MeshStandardMaterial({color:0xff0033,emissive:0xff0033,emissiveIntensity:2.5});
    const neonSign = new THREE.Mesh(new THREE.BoxGeometry(5,0.5,0.1), neonSignMat);
    neonSign.position.set(0,9.5,-12.5); scene.add(neonSign);
    const neonSignLight = new THREE.PointLight(0xff0033,2.5,10); neonSignLight.position.set(0,9.5,-12); scene.add(neonSignLight);

    // Extra neon signs on buildings
    const neonColors = [0x00ffff, 0xff00ff, 0xffff00, 0xff8800];
    [[-9,5,-7.5],[ 9,7,-7.5],[-9,4,7.5],[9,5,7.5]].forEach(([sx,sy,sz],i) => {
      const nm = new THREE.MeshStandardMaterial({color:neonColors[i],emissive:neonColors[i],emissiveIntensity:2});
      const ns = new THREE.Mesh(new THREE.BoxGeometry(2,0.25,0.06), nm); ns.position.set(sx,sy,sz); scene.add(ns);
      const nl = new THREE.PointLight(neonColors[i],1.5,6); nl.position.set(sx,sy,sz+0.5); scene.add(nl);
    });

    // Characters
    const charTypes: CharType[] = ['stunur','stunur','wojak','pepe','doge','stunur'];
    const chars = charTypes.map((type,i) => {
      const a = (i/charTypes.length)*Math.PI*2;
      const r = 2 + Math.random()*9;
      return makeChar(scene, Math.cos(a)*r, Math.sin(a)*r, type);
    });
    const smokes = chars.map(ch => makeSmoke(scene, () => {
      const wp = new THREE.Vector3(); ch.g.getWorldPosition(wp);
      return wp.add(new THREE.Vector3(0.35*ch.g.scale.x, 1.1*ch.g.scale.y, 0.06));
    }));

    // Cars
    const carColors = [0xcc2200,0x002299,0x229900,0xccaa00];
    const cars = Array.from({length:4},(_,i) => {
      const axis: 'x'|'z' = i%2===0?'x':'z';
      const dir = Math.random()>.5?1:-1;
      const lane = (Math.random()>.5?1:-1)*1.3;
      const start = -20+Math.random()*40;
      return { mesh:makeCar(scene,axis==='x'?start:lane,axis==='z'?start:lane,carColors[i%4],axis,dir), speed:0.045+Math.random()*0.055, axis, dir };
    });

    // Camera
    let camTheta=0.4, camPhi=0.38, camRadius=16, autoOrbit=true, isDragging=false;
    let lastMouse={x:0,y:0};
    const onMD = (e: MouseEvent) => { isDragging=true; autoOrbit=false; lastMouse={x:e.clientX,y:e.clientY}; };
    const onMM = (e: MouseEvent) => { if(!isDragging)return; camTheta-=(e.clientX-lastMouse.x)*0.005; camPhi=Math.max(0.1,Math.min(1.3,camPhi+(e.clientY-lastMouse.y)*0.005)); lastMouse={x:e.clientX,y:e.clientY}; };
    const onMU = () => { isDragging=false; };
    const onW = (e: WheelEvent) => { e.preventDefault(); camRadius=Math.max(5,Math.min(35,camRadius+e.deltaY*0.02)); };
    const onTS = (e: TouchEvent) => { isDragging=true; autoOrbit=false; lastMouse={x:e.touches[0].clientX,y:e.touches[0].clientY}; };
    const onTM = (e: TouchEvent) => { if(!isDragging)return; camTheta-=(e.touches[0].clientX-lastMouse.x)*0.005; camPhi=Math.max(0.1,Math.min(1.3,camPhi+(e.touches[0].clientY-lastMouse.y)*0.005)); lastMouse={x:e.touches[0].clientX,y:e.touches[0].clientY}; };
    const onTE = () => { isDragging=false; };
    renderer.domElement.addEventListener('mousedown',onMD); renderer.domElement.addEventListener('mousemove',onMM);
    renderer.domElement.addEventListener('mouseup',onMU); renderer.domElement.addEventListener('wheel',onW,{passive:false});
    renderer.domElement.addEventListener('touchstart',onTS); renderer.domElement.addEventListener('touchmove',onTM); renderer.domElement.addEventListener('touchend',onTE);

    hudCanvas.width = container.clientWidth; hudCanvas.height = container.clientHeight;

    let frame=0, locTimer=0, locIdx=0, isVisible=false, frameId: number;
    const observer = new IntersectionObserver(entries => { isVisible=entries[0].isIntersecting; if(isVisible)animate(); },{threshold:0.1});
    observer.observe(container);

    const animate = () => {
      if (!isVisible) return;
      frameId = requestAnimationFrame(animate);
      frame++;
      try {
        // Day/night
        const tod = (frame%1200)/1200;
        const dayT = Math.sin(tod*Math.PI*2-Math.PI/2)*0.5+0.5;
        const skyC = new THREE.Color(0x030508).lerp(new THREE.Color(dayT<0.5?0x100508:0x0d1a2e),Math.min(1,dayT*2));
        scene.background=skyC; (scene.fog as THREE.FogExp2).color=skyC;
        sun.intensity=0.3+dayT*2.0; sun.color.setHSL(0.1,0.3+dayT*0.4,0.5+dayT*0.4);
        ambient.intensity=0.3+dayT*0.8;
        stars.visible=dayT<0.4; moonMesh.visible=dayT<0.35; sunMesh.visible=dayT>0.3;
        sunMesh.position.set(Math.cos(tod*Math.PI*2+Math.PI)*28,Math.sin(tod*Math.PI*2+Math.PI)*28,-30);
        const nightOn=dayT<0.3;
        streetLights.forEach(sl=>{sl.light.intensity=nightOn?1:0;sl.bulbMat.emissiveIntensity=nightOn?1.8:0;});
        weedStores.forEach(ws=>{ws.neonLight.intensity=nightOn?2.5:1;});
        neonSignMat.emissiveIntensity=1.8+Math.sin(frame*0.06)*0.7;
        neonSignLight.intensity=2+Math.sin(frame*0.06)*0.8;
        blinks.forEach((b,i)=>{(b.material as THREE.MeshStandardMaterial).emissiveIntensity=Math.floor((frame+i*20)/35)%2===0?1:0;});
        redFill.intensity=(0.8+Math.sin(frame*0.02)*0.3)*(1.2-dayT*0.7);
        blueFill.intensity=(0.7+Math.cos(frame*0.018)*0.3)*(1.2-dayT*0.7);
        greenFill.intensity=(0.5+Math.sin(frame*0.015)*0.2)*(1.2-dayT*0.6);

        // Characters
        chars.forEach((ch,i) => {
          smokes[i].update(frame);
          if (ch.paused){ch.pauseTimer--;if(ch.pauseTimer<=0)ch.paused=false;return;}
          if(Math.random()<0.006){ch.targetAngle=Math.random()*Math.PI*2;if(Math.random()<0.12){ch.paused=true;ch.pauseTimer=70+Math.floor(Math.random()*150);}}
          let diff=ch.targetAngle-ch.angle; while(diff>Math.PI)diff-=Math.PI*2; while(diff<-Math.PI)diff+=Math.PI*2; ch.angle+=diff*0.04;
          ch.g.position.x+=Math.sin(ch.angle)*ch.speed; ch.g.position.z+=Math.cos(ch.angle)*ch.speed;
          if(Math.abs(ch.g.position.x)>16||Math.abs(ch.g.position.z)>16) ch.targetAngle=Math.atan2(-ch.g.position.x,-ch.g.position.z)+(Math.random()-.5);
          ch.g.rotation.y=ch.angle; ch.walkPhase+=0.13;
          ch.lLeg.rotation.x=Math.sin(ch.walkPhase)*0.45; ch.rLeg.rotation.x=-Math.sin(ch.walkPhase)*0.45; ch.lArm.rotation.x=-Math.sin(ch.walkPhase)*0.25;
          ch.emberMat.emissiveIntensity=2.5+Math.sin(frame*0.18+i)*0.8; ch.eLight.intensity=0.5+Math.sin(frame*0.18+i)*0.2;
        });

        // Cars
        cars.forEach(car=>{
          const p=car.mesh.position;
          if(car.axis==='x'){p.x+=car.speed*car.dir;if(Math.abs(p.x)>22)p.x=-22*car.dir;}
          else{p.z+=car.speed*car.dir;if(Math.abs(p.z)>22)p.z=-22*car.dir;}
        });

        // Camera
        if(autoOrbit)camTheta+=0.0015;
        camera.position.x=camRadius*Math.sin(camTheta)*Math.cos(camPhi);
        camera.position.y=camRadius*Math.sin(camPhi)+1;
        camera.position.z=camRadius*Math.cos(camTheta)*Math.cos(camPhi);
        camera.lookAt(0,1.5,0);

        // Scan location
        locTimer++; if(locTimer>200){locTimer=0;locIdx=(locIdx+1)%SCAN_LOCATIONS.length;setScanLoc(SCAN_LOCATIONS[locIdx]);}

        // Radar blips from char positions
        const blips = chars.map((ch,i) => ({
          x: ch.g.position.x, z: ch.g.position.z,
          color: ['#00ff88','#00ff88','#4466ff','#44ff44','#ffaa00','#00ff88'][i]
        }));

        // HUD
        const hCtx = hudCanvas.getContext('2d');
        if(hCtx) drawHUD(hCtx, hudCanvas.width, hudCanvas.height, frame, SCAN_LOCATIONS[locIdx], (frame%1200)/1200, blips);

      } catch(e) { console.warn('Frame error:',e); }
      renderer.render(scene,camera);
    };

    animate();

    const onResize = () => {
      if(!container)return;
      renderer.setSize(container.clientWidth,container.clientHeight);
      camera.aspect=container.clientWidth/container.clientHeight;
      camera.updateProjectionMatrix();
      hudCanvas.width=container.clientWidth; hudCanvas.height=container.clientHeight;
    };
    window.addEventListener('resize',onResize);

    return () => {
      cancelAnimationFrame(frameId); observer.disconnect(); window.removeEventListener('resize',onResize);
      renderer.domElement.removeEventListener('mousedown',onMD); renderer.domElement.removeEventListener('mousemove',onMM);
      renderer.domElement.removeEventListener('mouseup',onMU); renderer.domElement.removeEventListener('wheel',onW);
      renderer.domElement.removeEventListener('touchstart',onTS); renderer.domElement.removeEventListener('touchmove',onTM); renderer.domElement.removeEventListener('touchend',onTE);
      smokes.forEach(s=>s.dispose()); renderer.dispose();
      if(container.contains(renderer.domElement))container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section id="stoner-scanner" style={{padding:'48px 16px',background:'#080808'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');`}</style>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:8}}>
        <span style={{color:'#cc0000',fontSize:18}}>🛸</span>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(1.4rem,3vw,2rem)',letterSpacing:'0.15em',color:'#fff'}}>GLOBAL STUNUR SCANNER</span>
      </div>
      <p style={{textAlign:'center',fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:'rgba(255,255,255,0.3)',letterSpacing:'0.2em',marginBottom:16}}>
        DRAG TO ORBIT · SCROLL TO ZOOM · STUNUR CITY LIVE · SCANNING: {scanLoc}
      </p>
      <div style={{position:'relative',width:'100%',maxWidth:960,margin:'0 auto'}}>
        <div ref={mountRef} style={{width:'100%',height:560,borderRadius:2,overflow:'hidden',cursor:'grab',border:'1px solid rgba(0,255,80,0.15)',boxShadow:'0 0 60px rgba(0,255,80,0.04),0 0 30px rgba(255,0,50,0.04)'}} />
        <canvas ref={hudRef} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',borderRadius:2}} />
        {[
          {top:0,left:0,borderTop:'2px solid rgba(0,255,80,0.6)',borderLeft:'2px solid rgba(0,255,80,0.6)'},
          {top:0,right:0,borderTop:'2px solid rgba(0,255,80,0.6)',borderRight:'2px solid rgba(0,255,80,0.6)'},
          {bottom:0,left:0,borderBottom:'2px solid rgba(0,255,80,0.6)',borderLeft:'2px solid rgba(0,255,80,0.6)'},
          {bottom:0,right:0,borderBottom:'2px solid rgba(0,255,80,0.6)',borderRight:'2px solid rgba(0,255,80,0.6)'},
        ].map((s,i)=><div key={i} style={{position:'absolute',width:20,height:20,pointerEvents:'none',...s}}/>)}
      </div>
    </section>
  );
}
// upgraded Fri Apr 24 07:24:04 UTC 2026
