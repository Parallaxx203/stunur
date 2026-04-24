import React, { useRef, useEffect, useState } from 'react';

const CITY_NAMES = ['AMSTERDAM','LOS ANGELES','TOKYO','BERLIN','TEL AVIV','LONDON','DUBAI','TORONTO','PARIS','SEATTLE'];

export function StonerScanner() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let frameId: number;
    let renderer: any;

    const init = async () => {
      try {
        const THREE = await import('three');

        const W = container.clientWidth || 900;
        const H = 520;

        // ── SCENE ──
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050810);
        scene.fog = new THREE.Fog(0x050810, 18, 40);

        // ── RENDERER ──
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.9;
        renderer.setSize(W, H);
        container.appendChild(renderer.domElement);

        // ── CAMERA ──
        const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
        camera.position.set(0, 7, 14);
        camera.lookAt(0, 0, 0);

        // ── LIGHTS ──
        scene.add(new THREE.AmbientLight(0x111122, 0.8));
        const moon = new THREE.DirectionalLight(0x334466, 1.2);
        moon.position.set(-10, 20, 10);
        moon.castShadow = true;
        scene.add(moon);
        const redLight = new THREE.PointLight(0xff0033, 1.5, 12);
        redLight.position.set(-5, 3, -5);
        scene.add(redLight);
        const blueLight = new THREE.PointLight(0x0033ff, 1.2, 12);
        blueLight.position.set(5, 3, -5);
        scene.add(blueLight);

        // ── GROUND ──
        const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(60, 60),
          new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Roads
        [[0, 0, 60, 4.5], [0, 0, 4.5, 60]].forEach(([x, z, w, d]) => {
          const road = new THREE.Mesh(
            new THREE.PlaneGeometry(w, d),
            new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
          );
          road.rotation.x = -Math.PI / 2;
          road.position.set(x, 0.01, z);
          scene.add(road);
        });

        // Road lines
        const lineMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffcc00, emissiveIntensity: 0.3 });
        for (let i = -7; i <= 7; i += 2) {
          const lh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.06), lineMat);
          lh.rotation.x = -Math.PI / 2; lh.position.set(i * 2, 0.02, 0); scene.add(lh);
          const lv = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 1.5), lineMat);
          lv.rotation.x = -Math.PI / 2; lv.position.set(0, 0.02, i * 2); scene.add(lv);
        }

        // ── BUILDINGS ──
        const blinkMeshes: THREE.Mesh[] = [];
        const blockPos = [[-8,-8],[-8,-14],[-8,8],[-8,14],[8,-8],[8,-14],[8,8],[8,14],[-16,-8],[-16,8],[16,-8],[16,8]];
        blockPos.forEach(([bx, bz]) => {
          const w = 2 + Math.random() * 3, d = 2 + Math.random() * 3, h = 2 + Math.random() * 8;
          const bldg = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(Math.random(), 0.1, 0.07), roughness: 0.9 })
          );
          bldg.position.set(bx, h / 2, bz);
          bldg.castShadow = true;
          scene.add(bldg);

          // Windows
          const rows = Math.floor(h / 0.6), cols = Math.floor(w / 0.5);
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              if (Math.random() > 0.4) {
                const lit = Math.random() > 0.35;
                const wc = lit ? (Math.random() > 0.5 ? 0xffdd88 : 0x88ddff) : 0x111111;
                const win = new THREE.Mesh(
                  new THREE.PlaneGeometry(0.18, 0.22),
                  new THREE.MeshStandardMaterial({ color: wc, emissive: lit ? wc : 0, emissiveIntensity: lit ? 0.8 : 0 })
                );
                win.position.set(bx + (c - cols/2 + 0.5)*(w/cols), 0.4 + r*0.55, bz + d/2 + 0.01);
                scene.add(win);
              }
            }
          }

          // Rooftop blink light
          if (Math.random() > 0.5) {
            const bm = new THREE.Mesh(
              new THREE.SphereGeometry(0.06, 4, 4),
              new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1 })
            );
            bm.position.set(bx, h + 0.3, bz);
            scene.add(bm);
            blinkMeshes.push(bm);
          }
        });

        // ── STREET LIGHTS ──
        [[-3.5,6],[-3.5,-6],[3.5,6],[3.5,-6],[-3.5,12],[3.5,-12],[9,3],[-9,-3]].forEach(([lx, lz]) => {
          const poleMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 5), poleMat);
          pole.position.set(lx, 1.1, lz); scene.add(pole);
          const bulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 6, 6),
            new THREE.MeshStandardMaterial({ color: 0xffee99, emissive: 0xffee99, emissiveIntensity: 1.5 })
          );
          bulb.position.set(lx + 0.5, 2.2, lz); scene.add(bulb);
          const pl = new THREE.PointLight(0xffee88, 0.8, 4);
          pl.position.set(lx + 0.5, 2.1, lz); scene.add(pl);
        });

        // ── NEON SIGN ──
        const neonMat = new THREE.MeshStandardMaterial({ color: 0xff0033, emissive: 0xff0033, emissiveIntensity: 2 });
        const neonSign = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 0.1), neonMat);
        neonSign.position.set(0, 5, -8); scene.add(neonSign);
        const neonLight = new THREE.PointLight(0xff0033, 2, 8);
        neonLight.position.set(0, 5, -7.5); scene.add(neonLight);

        // ── STICK FIGURES ──
        const figColors = [0x00ff88, 0xff4466, 0xffb700, 0x00d9ff, 0xcc44ff, 0xff8800, 0x44ffcc, 0xffff00];
        const figures: any[] = [];

        for (let i = 0; i < 16; i++) {
          const angle = Math.random() * Math.PI * 2;
          const r = 2 + Math.random() * 8;
          const x = Math.cos(angle) * r, z = Math.sin(angle) * r;
          const color = figColors[i % figColors.length];
          const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.3 });
          const group = new THREE.Group();

          // Body parts
          const body = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6), mat);
          body.position.y = 0.85; group.add(body);

          const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), mat);
          head.position.y = 1.25; group.add(head);

          const eyeMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1 });
          [-0.05, 0.05].forEach(ex => {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 4, 4), eyeMat);
            eye.position.set(ex, 1.27, 0.1); group.add(eye);
          });

          const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 4), mat);
          leftArm.position.set(-0.2, 0.92, 0); leftArm.rotation.z = Math.PI / 4; group.add(leftArm);

          const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 4), mat);
          rightArm.position.set(0.2, 0.92, 0); rightArm.rotation.z = -Math.PI / 4; group.add(rightArm);

          const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 4), mat);
          leftLeg.position.set(-0.08, 0.4, 0); group.add(leftLeg);

          const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 4), mat);
          rightLeg.position.set(0.08, 0.4, 0); group.add(rightLeg);

          // Cigarette
          const cig = new THREE.Mesh(
            new THREE.CylinderGeometry(0.015, 0.015, 0.18, 4),
            new THREE.MeshStandardMaterial({ color: 0xf5f0e8 })
          );
          cig.rotation.z = Math.PI / 2.5; cig.position.set(0.28, 0.96, 0.05); group.add(cig);

          const emberMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff4400, emissiveIntensity: 2 });
          const ember = new THREE.Mesh(new THREE.SphereGeometry(0.025, 4, 4), emberMat);
          ember.position.set(0.34, 0.91, 0.05); group.add(ember);

          // Smoke
          for (let s = 0; s < 3; s++) {
            const sm = new THREE.Mesh(
              new THREE.SphereGeometry(0.04 + s * 0.03, 4, 4),
              new THREE.MeshStandardMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.12 - s * 0.03 })
            );
            sm.position.set(0.34 + s * 0.04, 0.91 + s * 0.18, 0.05); group.add(sm);
          }

          group.position.set(x, 0, z);
          group.scale.setScalar(0.7 + Math.random() * 0.4);
          scene.add(group);

          figures.push({
            group, leftLeg, rightLeg, leftArm, ember,
            speed: 0.012 + Math.random() * 0.018,
            angle: Math.random() * Math.PI * 2,
            walkPhase: Math.random() * Math.PI * 2,
            paused: false, pauseTimer: 0,
            targetAngle: Math.random() * Math.PI * 2,
          });
        }

        // ── CARS ──
        const carColors = [0xcc2200, 0x002299, 0x229900, 0xccaa00, 0x888888];
        const cars: any[] = [];
        for (let i = 0; i < 6; i++) {
          const axis = Math.random() > 0.5 ? 'x' : 'z';
          const lane = (Math.random() > 0.5 ? 1 : -1) * 1.2;
          const start = -18 + Math.random() * 36;
          const dir = Math.random() > 0.5 ? 1 : -1;
          const carGroup = new THREE.Group();
          const carMat = new THREE.MeshStandardMaterial({ color: carColors[i % carColors.length], roughness: 0.3, metalness: 0.6 });
          const carBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.28, 1.6), carMat);
          carBody.position.y = 0.22; carGroup.add(carBody);
          const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.22, 0.85), carMat);
          cabin.position.set(0, 0.47, -0.05); carGroup.add(cabin);
          const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
          [[-0.42,0.14,0.5],[0.42,0.14,0.5],[-0.42,0.14,-0.5],[0.42,0.14,-0.5]].forEach(([wx,wy,wz]) => {
            const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.14,0.1,8), wheelMat);
            wh.rotation.z = Math.PI/2; wh.position.set(wx,wy,wz); carGroup.add(wh);
          });
          const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 });
          [[-0.25,0.22,0.81],[0.25,0.22,0.81]].forEach(([hx,hy,hz]) => {
            const hl = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.07,0.02), headMat);
            hl.position.set(hx,hy,hz); carGroup.add(hl);
          });
          carGroup.position.set(axis==='x'?start:lane, 0, axis==='z'?start:lane);
          if (axis==='x') carGroup.rotation.y = dir>0?0:Math.PI;
          else carGroup.rotation.y = dir>0?Math.PI/2:-Math.PI/2;
          scene.add(carGroup);
          cars.push({ mesh: carGroup, speed: 0.05 + Math.random()*0.05, lane, axis, dir });
        }

        // ── STARS ──
        const starVerts: number[] = [];
        for (let i = 0; i < 500; i++) starVerts.push((Math.random()-.5)*80, 10+Math.random()*30, (Math.random()-.5)*80);
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
        scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 })));

        // ── CAMERA ORBIT ──
        let camTheta = 0.45, camPhi = 0.35, camRadius = 14;
        let isDragging = false, autoOrbit = true;
        let lastMouse = { x: 0, y: 0 };

        const onDown = (e: MouseEvent) => { isDragging = true; autoOrbit = false; lastMouse = { x: e.clientX, y: e.clientY }; };
        const onMove = (e: MouseEvent) => {
          if (!isDragging) return;
          camTheta -= (e.clientX - lastMouse.x) * 0.005;
          camPhi = Math.max(0.1, Math.min(1.2, camPhi + (e.clientY - lastMouse.y) * 0.005));
          lastMouse = { x: e.clientX, y: e.clientY };
        };
        const onUp = () => { isDragging = false; };
        const onWheel = (e: WheelEvent) => { e.preventDefault(); camRadius = Math.max(5, Math.min(30, camRadius + e.deltaY * 0.02)); };

        renderer.domElement.addEventListener('mousedown', onDown);
        renderer.domElement.addEventListener('mousemove', onMove);
        renderer.domElement.addEventListener('mouseup', onUp);
        renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

        // ── ANIMATE ──
        let frame = 0;
        const animate = () => {
          frameId = requestAnimationFrame(animate);
          frame++;

          if (autoOrbit) camTheta += 0.002;
          camera.position.x = camRadius * Math.sin(camTheta) * Math.cos(camPhi);
          camera.position.y = camRadius * Math.sin(camPhi) + 1;
          camera.position.z = camRadius * Math.cos(camTheta) * Math.cos(camPhi);
          camera.lookAt(0, 1, 0);

          // Figures
          figures.forEach(fig => {
            if (fig.paused) { fig.pauseTimer--; if (fig.pauseTimer <= 0) fig.paused = false; return; }
            if (Math.random() < 0.005) {
              fig.targetAngle = Math.random() * Math.PI * 2;
              if (Math.random() < 0.15) { fig.paused = true; fig.pauseTimer = 60 + Math.floor(Math.random() * 120); }
            }
            let diff = fig.targetAngle - fig.angle;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            fig.angle += diff * 0.05;
            fig.group.position.x += Math.sin(fig.angle) * fig.speed;
            fig.group.position.z += Math.cos(fig.angle) * fig.speed;
            if (Math.abs(fig.group.position.x) > 14 || Math.abs(fig.group.position.z) > 14) {
              fig.targetAngle = Math.atan2(-fig.group.position.x, -fig.group.position.z) + (Math.random()-.5)*1.5;
            }
            fig.group.rotation.y = fig.angle;
            fig.walkPhase += 0.12;
            fig.leftLeg.rotation.x = Math.sin(fig.walkPhase) * 0.4;
            fig.rightLeg.rotation.x = -Math.sin(fig.walkPhase) * 0.4;
            fig.leftArm.rotation.x = -Math.sin(fig.walkPhase) * 0.3;
            (fig.ember.material as any).emissiveIntensity = 1.5 + Math.sin(frame * 0.15 + fig.walkPhase) * 0.5;
          });

          // Cars
          cars.forEach(car => {
            if (car.axis === 'x') {
              car.mesh.position.x += car.speed * car.dir;
              if (Math.abs(car.mesh.position.x) > 20) car.mesh.position.x = -20 * car.dir;
            } else {
              car.mesh.position.z += car.speed * car.dir;
              if (Math.abs(car.mesh.position.z) > 20) car.mesh.position.z = -20 * car.dir;
            }
          });

          // Blink lights
          blinkMeshes.forEach(b => { (b.material as any).emissiveIntensity = Math.floor(frame/40)%2===0?1:0; });

          // Neon
          (neonSign.material as any).emissiveIntensity = 1.5 + Math.sin(frame * 0.05) * 0.5;
          neonLight.intensity = 1.5 + Math.sin(frame * 0.05) * 0.5;
          redLight.intensity = 1 + Math.sin(frame * 0.02) * 0.4;
          blueLight.intensity = 1 + Math.cos(frame * 0.018) * 0.4;

          renderer.render(scene, camera);
        };

        animate();
        setLoaded(true);

        // Resize
        const onResize = () => {
          if (!container) return;
          const w = container.clientWidth;
          renderer.setSize(w, 520);
          camera.aspect = w / 520;
          camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', onResize);

        return () => {
          cancelAnimationFrame(frameId);
          window.removeEventListener('resize', onResize);
          renderer.domElement.removeEventListener('mousedown', onDown);
          renderer.domElement.removeEventListener('mousemove', onMove);
          renderer.domElement.removeEventListener('mouseup', onUp);
          renderer.domElement.removeEventListener('wheel', onWheel);
          renderer.dispose();
          if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        };
      } catch (err: any) {
        console.error('Scanner error:', err);
        setError(err?.message || 'Failed to load 3D scene');
      }
    };

    let cleanup: (() => void) | undefined;
    init().then(fn => { cleanup = fn; });
    return () => { cleanup?.(); };
  }, []);

  return (
    <section id="stoner-scanner" style={{ padding: '48px 16px', background: '#080808' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&Bebas+Neue&display=swap');`}</style>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:8 }}>
        <span style={{ color:'#cc0000', fontSize:18 }}>🛸</span>
        <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(1.4rem,3vw,2rem)', letterSpacing:'0.15em', color:'#fff' }}>
          GLOBAL STUNUR SCANNER
        </span>
      </div>
      <p style={{ textAlign:'center', fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'rgba(255,255,255,0.3)', letterSpacing:'0.2em', marginBottom:16 }}>
        DRAG TO ORBIT · SCROLL TO ZOOM · 16 STUNURS ACTIVE WORLDWIDE
      </p>

      <div style={{ position:'relative', width:'100%', maxWidth:900, margin:'0 auto' }}>
        {/* Loading state */}
        {!loaded && !error && (
          <div style={{
            position:'absolute', inset:0, zIndex:10, background:'#050810',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12,
            border:'1px solid rgba(0,255,80,0.2)', height:520,
          }}>
            <div style={{ width:40, height:40, border:'3px solid rgba(0,255,80,0.2)', borderTop:'3px solid #00ff88', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
            <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'rgba(0,255,80,0.6)', letterSpacing:'0.2em' }}>LOADING STUNUR CITY...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {error && (
          <div style={{
            height:520, border:'1px solid rgba(255,0,0,0.3)', background:'#050810',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:'rgba(255,80,80,0.7)', letterSpacing:'0.1em',
          }}>
            ⚠ {error}
          </div>
        )}

        <div ref={mountRef} style={{ width:'100%', height:520, border:'1px solid rgba(0,255,80,0.2)', boxShadow:'0 0 60px rgba(0,255,80,0.05)', borderRadius:2, overflow:'hidden', cursor:'grab' }} />

        {/* Corner brackets */}
        {[{top:0,left:0},{top:0,right:0},{bottom:0,left:0},{bottom:0,right:0}].map((pos, i) => (
          <div key={i} style={{
            position:'absolute', width:20, height:20, ...pos,
            borderTop: pos.top===0 ? '2px solid rgba(0,255,80,0.6)' : undefined,
            borderBottom: (pos as any).bottom===0 ? '2px solid rgba(0,255,80,0.6)' : undefined,
            borderLeft: pos.left===0 ? '2px solid rgba(0,255,80,0.6)' : undefined,
            borderRight: (pos as any).right===0 ? '2px solid rgba(0,255,80,0.6)' : undefined,
          }} />
        ))}

        {/* Live strip */}
        <div style={{
          background:'rgba(0,3,0,0.9)', borderTop:'1px solid rgba(0,255,80,0.15)',
          padding:'5px 12px', display:'flex', alignItems:'center', gap:8, overflow:'hidden',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:'#00ff88', boxShadow:'0 0 6px #00ff88' }} />
            <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8, color:'#00ff88', letterSpacing:'0.2em' }}>LIVE</span>
          </div>
          <div style={{ overflow:'hidden', flex:1 }}>
            <div style={{ display:'flex', whiteSpace:'nowrap', animation:'ticker 18s linear infinite' }}>
              {[...CITY_NAMES,...CITY_NAMES].map((c,i) => (
                <span key={i} style={{ marginRight:28, fontFamily:"'Share Tech Mono',monospace", fontSize:8, color:'rgba(0,255,80,0.45)', letterSpacing:'0.1em' }}>
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
