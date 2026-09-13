/* =========================================================================
       AUDIO SYNTHESIZER (Pure Web Audio API - Zero External Assets)
       ========================================================================= */
    class SoundEngine {
      constructor() {
        this.ctx = null;
        this.muted = false;
        this.masterGain = null;
      }

      init() {
        if (this.ctx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }

      ensureReady() {
        if (!this.ctx) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }

      toggleMute() {
        this.muted = !this.muted;
        if (this.masterGain) {
          this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.35, this.ctx ? this.ctx.currentTime : 0);
        }
        return !this.muted;
      }

      // Player plasma shot
      playShoot() {
        if (this.muted || !this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.1);

        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.11);
      }

      // Enemy energy blast
      playEnemyShoot() {
        if (this.muted || !this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, t);
        osc.frequency.exponentialRampToValueAtTime(90, t + 0.14);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.15);
      }

      // Metallic hit / projectile impact
      playHit() {
        if (this.muted || !this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.06);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.07);
      }

      // Procedural drone explosion with low-pass filtered noise and sub-bass drop
      playExplosion(heavy = false) {
        if (this.muted || !this.ctx) return;
        const t = this.ctx.currentTime;
        const dur = heavy ? 0.65 : 0.38;

        // 1. Noise buffer generator
        const bufferSize = Math.floor(this.ctx.sampleRate * dur);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(heavy ? 1200 : 900, t);
        filter.frequency.exponentialRampToValueAtTime(45, t + dur);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(heavy ? 0.8 : 0.5, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noise.start(t);

        // 2. Sub-bass boom
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(heavy ? 120 : 90, t);
        sub.frequency.exponentialRampToValueAtTime(25, t + dur);

        subGain.gain.setValueAtTime(heavy ? 0.7 : 0.45, t);
        subGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        sub.connect(subGain);
        subGain.connect(this.masterGain);
        sub.start(t);
        sub.stop(t + dur);
      }

      // Energy core pickup chime
      playCorePickup() {
        if (this.muted || !this.ctx) return;
        const t = this.ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((f, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = t + idx * 0.04;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, start);

          gain.gain.setValueAtTime(0.22, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(start);
          osc.stop(start + 0.26);
        });
      }

      // Dash booster burst
      playDash() {
        if (this.muted || !this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.linearRampToValueAtTime(700, t + 0.08);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.22);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(500, t);
        filter.Q.value = 2.0;

        gain.gain.setValueAtTime(0.45, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.23);
      }

      // EMP Shockwave
      playEmp() {
        if (this.muted || !this.ctx) return;
        const t = this.ctx.currentTime;
        const sub = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(300, t);
        sub.frequency.exponentialRampToValueAtTime(30, t + 0.7);

        gain.gain.setValueAtTime(0.8, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

        sub.connect(gain);
        gain.connect(this.masterGain);
        sub.start(t);
        sub.stop(t + 0.75);
      }

      // Wave fanfare chord
      playWaveFanfare() {
        if (this.muted || !this.ctx) return;
        const t = this.ctx.currentTime;
        const notes = [220, 277.18, 329.63, 440];
        notes.forEach((f) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, t);

          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(t);
          osc.stop(t + 0.95);
        });
      }

      // Player damage crunch
      playDamage() {
        if (this.muted || !this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.exponentialRampToValueAtTime(35, t + 0.2);

        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.22);
      }
    }

    const audio = new SoundEngine();

    /* =========================================================================
       PROCEDURAL CANVAS TEXTURES (Hex Arena Floor & Decals)
       ========================================================================= */
    function createHexFloorTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Dark metallic background
      ctx.fillStyle = '#0a0d18';
      ctx.fillRect(0, 0, 512, 512);

      // Subtle metallic noise
      for (let i = 0; i < 4000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const a = Math.random() * 0.04;
        ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
        ctx.fillRect(x, y, 2, 2);
      }

      // Draw glowing cyberpunk hex grid
      const r = 32;
      const h = r * Math.sin(Math.PI / 3);
      const w = r * 1.5;

      ctx.strokeStyle = 'rgba(0, 243, 255, 0.18)';
      ctx.lineWidth = 1.5;

      for (let x = 0; x < 512 + r * 2; x += w) {
        for (let y = 0; y < 512 + r * 2; y += h * 2) {
          const cy = (Math.round(x / w) % 2 === 0) ? y : y + h;
          drawHex(ctx, x, cy, r);
        }
      }

      // Center tech glyph highlight
      const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 220);
      grad.addColorStop(0, 'rgba(0, 243, 255, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(8, 8);
      return tex;
    }

    function drawHex(ctx, cx, cy, r) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        const px = cx + r * Math.cos(a);
        const py = cy + r * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }

    function createPylonTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#111524';
      ctx.fillRect(0, 0, 128, 256);

      // Warning stripes
      ctx.fillStyle = '#ff0055';
      for (let i = -128; i < 256; i += 32) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(128, i + 64);
        ctx.lineTo(128, i + 80);
        ctx.lineTo(0, i + 16);
        ctx.closePath();
        ctx.fill();
      }

      const tex = new THREE.CanvasTexture(canvas);
      return tex;
    }

    /* =========================================================================
       PARTICLE SYSTEM (Sparks, Explosions, Shockwaves, Trails)
       ========================================================================= */
    class ParticleEngine {
      constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.maxParticles = 800;

        const geom = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.maxParticles * 3);
        this.colors = new Float32Array(this.maxParticles * 3);
        this.sizes = new Float32Array(this.maxParticles);

        geom.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        geom.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
        geom.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

        // Particle texture sprite
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 32;
        pCanvas.height = 32;
        const pCtx = pCanvas.getContext('2d');
        const rad = pCtx.createRadialGradient(16, 16, 2, 16, 16, 16);
        rad.addColorStop(0, 'rgba(255,255,255,1)');
        rad.addColorStop(0.3, 'rgba(0, 243, 255, 0.8)');
        rad.addColorStop(1, 'rgba(0,0,0,0)');
        pCtx.fillStyle = rad;
        pCtx.fillRect(0, 0, 32, 32);

        const pTex = new THREE.CanvasTexture(pCanvas);

        const mat = new THREE.PointsMaterial({
          size: 1.2,
          vertexColors: true,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          map: pTex
        });

        this.points = new THREE.Points(geom, mat);
        this.scene.add(this.points);

        // Active particle data
        for (let i = 0; i < this.maxParticles; i++) {
          this.particles.push({
            active: false,
            x: 0, y: -100, z: 0,
            vx: 0, vy: 0, vz: 0,
            r: 1, g: 1, b: 1,
            size: 1,
            life: 0,
            maxLife: 1
          });
        }
      }

      spawn(x, y, z, count = 15, color = {r: 0, g: 0.95, b: 1}, speed = 6, size = 1.2) {
        let spawned = 0;
        for (let i = 0; i < this.maxParticles && spawned < count; i++) {
          const p = this.particles[i];
          if (!p.active) {
            p.active = true;
            p.x = x;
            p.y = y;
            p.z = z;

            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI - Math.PI / 2;
            const spd = speed * (0.4 + Math.random() * 0.8);

            p.vx = Math.cos(phi) * Math.cos(theta) * spd;
            p.vy = (Math.sin(phi) * 0.5 + 0.3) * spd;
            p.vz = Math.cos(phi) * Math.sin(theta) * spd;

            p.r = color.r + (Math.random() * 0.2 - 0.1);
            p.g = color.g + (Math.random() * 0.2 - 0.1);
            p.b = color.b + (Math.random() * 0.2 - 0.1);
            p.size = size * (0.7 + Math.random() * 0.6);
            p.life = 0;
            p.maxLife = 0.35 + Math.random() * 0.45;
            spawned++;
          }
        }
      }

      update(dt) {
        let activeCount = 0;
        for (let i = 0; i < this.maxParticles; i++) {
          const p = this.particles[i];
          if (p.active) {
            p.life += dt;
            if (p.life >= p.maxLife) {
              p.active = false;
              p.y = -100;
            } else {
              const progress = p.life / p.maxLife;
              p.x += p.vx * dt;
              p.y += p.vy * dt;
              p.z += p.vz * dt;
              p.vy -= 9.8 * dt * 0.5; // Gravity

              const idx = i * 3;
              this.positions[idx] = p.x;
              this.positions[idx + 1] = p.y;
              this.positions[idx + 2] = p.z;

              const fade = 1.0 - progress;
              this.colors[idx] = p.r * fade;
              this.colors[idx + 1] = p.g * fade;
              this.colors[idx + 2] = p.b * fade;

              this.sizes[i] = p.size * fade;
              activeCount++;
            }
          } else {
            this.positions[i * 3 + 1] = -100;
            this.sizes[i] = 0;
          }
        }

        this.points.geometry.attributes.position.needsUpdate = true;
        this.points.geometry.attributes.color.needsUpdate = true;
        this.points.geometry.attributes.size.needsUpdate = true;
      }
    }

    /* =========================================================================
       MAIN GAME CLASS
       ========================================================================= */
    class CyberArenaGame {
      constructor() {
        this.state = 'MENU'; // 'MENU', 'PLAYING', 'PAUSED', 'GAMEOVER'
        this.arenaRadius = 46;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('cyberdome_high_score') || '0', 10);
        this.comboMultiplier = 1.0;
        this.comboTimer = 0;
        this.wave = 1;
        this.killsTotal = 0;
        this.coresTotal = 0;

        // Player Stats
        this.maxHealth = 100;
        this.health = 100;
        this.maxShield = 50;
        this.shield = 50;
        this.shieldRechargeDelay = 0;
        this.playerSpeed = 16.5;
        this.velocity = new THREE.Vector3();
        this.keys = {};
        this.mousePos = new THREE.Vector2();
        this.mouseWorld = new THREE.Vector3();
        this.isShooting = false;
        this.shootCooldown = 0;
        this.shootFireRate = 0.12; // seconds between shots
        this.cannonSide = 1;

        // Dash Skill
        this.dashCooldown = 0;
        this.dashMaxCooldown = 1.8;
        this.isDashing = false;
        this.dashDuration = 0;
        this.dashDir = new THREE.Vector3();

        // EMP Skill
        this.empCharge = 0; // 0 to 100
        this.empMesh = null;
        this.empExpanding = false;
        this.empRadius = 0;

        // Entities
        this.projectiles = [];
        this.enemyProjectiles = [];
        this.drones = [];
        this.energyCores = [];
        this.pillars = [];

        // Wave Spawner
        this.dronesToSpawn = 0;
        this.spawnTimer = 0;
        this.waveIntermission = 0;

        // Screen Shake
        this.shakeIntensity = 0;

        // Setup Systems
        this.initThree();
        this.initScene();
        this.initPlayer();
        this.initPillars();
        this.initParticles();
        this.initControls();
        this.initUI();

        // Start Animation Loop
        this.clock = new THREE.Clock();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
      }

      /* ---------------- Three.js & Lighting Setup ---------------- */
      initThree() {
        this.container = document.getElementById('canvas-container');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x080911);
        this.scene.fog = new THREE.FogExp2(0x080911, 0.016);

        this.camera = new THREE.PerspectiveCamera(
          55,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        this.cameraOffset = new THREE.Vector3(0, 32, 22);
        this.camera.position.copy(this.cameraOffset);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
        this.container.appendChild(this.renderer.domElement);

        // Raycasting for ground mouse aiming
        this.raycaster = new THREE.Raycaster();
        this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

        window.addEventListener('resize', () => this.onResize());
      }

      initScene() {
        // Soft Cyber Ambient Light
        const ambLight = new THREE.AmbientLight(0x1a2138, 1.2);
        this.scene.add(ambLight);

        // Directional Key Light with Dynamic Soft Shadows
        this.dirLight = new THREE.DirectionalLight(0xdcf8ff, 1.8);
        this.dirLight.position.set(30, 55, 25);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.shadow.camera.near = 10;
        this.dirLight.shadow.camera.far = 120;
        const d = 52;
        this.dirLight.shadow.camera.left = -d;
        this.dirLight.shadow.camera.right = d;
        this.dirLight.shadow.camera.top = d;
        this.dirLight.shadow.camera.bottom = -d;
        this.dirLight.shadow.bias = -0.0005;
        this.scene.add(this.dirLight);

        // Cyan Rim Accent Light
        const cyanRim = new THREE.DirectionalLight(0x00f3ff, 0.8);
        cyanRim.position.set(-35, 20, -35);
        this.scene.add(cyanRim);

        // Magenta Ground Glow Light
        const magRim = new THREE.PointLight(0xff0055, 1.2, 80);
        magRim.position.set(0, 5, 0);
        this.scene.add(magRim);

        // 1. Arena Floor Plane
        const floorGeo = new THREE.PlaneGeometry(100, 100);
        const floorTex = createHexFloorTexture();
        const floorMat = new THREE.MeshStandardMaterial({
          map: floorTex,
          roughness: 0.4,
          metalness: 0.6
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // 2. Arena Outer Boundary Barrier Ring
        const ringGeo = new THREE.CylinderGeometry(this.arenaRadius, this.arenaRadius, 3.5, 64, 1, true);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x00f3ff,
          wireframe: true,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide
        });
        this.boundaryRing = new THREE.Mesh(ringGeo, ringMat);
        this.boundaryRing.position.y = 1.75;
        this.scene.add(this.boundaryRing);

        // Boundary base glowing ring
        const baseRingGeo = new THREE.RingGeometry(this.arenaRadius - 0.4, this.arenaRadius + 0.4, 64);
        const baseRingMat = new THREE.MeshBasicMaterial({
          color: 0x00f3ff,
          side: THREE.DoubleSide
        });
        const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
        baseRing.rotation.x = -Math.PI / 2;
        baseRing.position.y = 0.05;
        this.scene.add(baseRing);

        // 3. Perimeter Neon Defense Pylons
        const pylonTex = createPylonTexture();
        const pylonGeo = new THREE.BoxGeometry(2, 6, 2);
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const px = Math.cos(angle) * this.arenaRadius;
          const pz = Math.sin(angle) * this.arenaRadius;

          const pylonMat = new THREE.MeshStandardMaterial({
            map: pylonTex,
            roughness: 0.3,
            metalness: 0.7
          });
          const pylon = new THREE.Mesh(pylonGeo, pylonMat);
          pylon.position.set(px, 3, pz);
          pylon.castShadow = true;
          this.scene.add(pylon);

          // Pylon beacon point light
          const beacon = new THREE.PointLight(0x00f3ff, 0.6, 12);
          beacon.position.set(px, 6.2, pz);
          this.scene.add(beacon);
        }

        // 4. Ground Target Crosshair Reticle
        const reticleGeo = new THREE.RingGeometry(0.9, 1.1, 32);
        const reticleMat = new THREE.MeshBasicMaterial({
          color: 0x00f3ff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.65
        });
        this.reticle = new THREE.Mesh(reticleGeo, reticleMat);
        this.reticle.rotation.x = -Math.PI / 2;
        this.reticle.position.y = 0.08;
        this.scene.add(this.reticle);

        // Laser Sight Line from player to aim point
        const laserMat = new THREE.LineBasicMaterial({
          color: 0x00f3ff,
          transparent: true,
          opacity: 0.25
        });
        const laserPoints = [new THREE.Vector3(), new THREE.Vector3()];
        const laserGeo = new THREE.BufferGeometry().setFromPoints(laserPoints);
        this.laserLine = new THREE.Line(laserGeo, laserMat);
        this.scene.add(this.laserLine);

        // EMP Shockwave visual mesh
        const empGeo = new THREE.RingGeometry(0.1, 1.2, 48);
        const empMat = new THREE.MeshBasicMaterial({
          color: 0x00f3ff,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide
        });
        this.empMesh = new THREE.Mesh(empGeo, empMat);
        this.empMesh.rotation.x = -Math.PI / 2;
        this.empMesh.position.y = 0.2;
        this.scene.add(this.empMesh);
      }

      /* ---------------- Tactical Obstacles / Pillars ---------------- */
      initPillars() {
        const pillarGeo = new THREE.CylinderGeometry(1.6, 1.8, 5, 8);
        const pillarMat = new THREE.MeshStandardMaterial({
          color: 0x161c2e,
          roughness: 0.25,
          metalness: 0.8,
          wireframe: false
        });

        // 6 tactical cover pylons scattered in arena
        const positions = [
          [-18, -18], [18, -18],
          [-22, 12],  [22, 12],
          [0, -26],   [0, 26]
        ];

        positions.forEach(([x, z]) => {
          const pillar = new THREE.Mesh(pillarGeo, pillarMat);
          pillar.position.set(x, 2.5, z);
          pillar.castShadow = true;
          pillar.receiveShadow = true;

          // Glowing energy core band inside each pillar
          const bandGeo = new THREE.CylinderGeometry(1.62, 1.62, 0.6, 8);
          const bandMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
          const band = new THREE.Mesh(bandGeo, bandMat);
          band.position.y = 0.5;
          pillar.add(band);

          this.scene.add(pillar);
          this.pillars.push({ mesh: pillar, radius: 2.0, x, z });
        });
      }

      /* ---------------- Player Combat Mech Assembly ---------------- */
      initPlayer() {
        this.player = new THREE.Group();
        this.player.position.set(0, 0, 0);

        // Central Faceted Core Chassis
        const coreGeo = new THREE.DodecahedronGeometry(1.2, 1);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x0b1326,
          metalness: 0.85,
          roughness: 0.2
        });
        this.playerCore = new THREE.Mesh(coreGeo, coreMat);
        this.playerCore.position.y = 1.35;
        this.playerCore.castShadow = true;
        this.player.add(this.playerCore);

        // Glowing Visor Strip
        const visorGeo = new THREE.BoxGeometry(0.85, 0.22, 1.15);
        const visorMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
        const visor = new THREE.Mesh(visorGeo, visorMat);
        visor.position.set(0, 1.45, 0.4);
        this.player.add(visor);

        // Outer Kinetic Armor Plates
        const armorGeo = new THREE.TorusGeometry(1.5, 0.12, 8, 24);
        const armorMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          metalness: 0.9,
          roughness: 0.3
        });
        this.armorRing = new THREE.Mesh(armorGeo, armorMat);
        this.armorRing.rotation.x = Math.PI / 2;
        this.armorRing.position.y = 1.35;
        this.player.add(this.armorRing);

        // Dual Plasma Cannons (Left & Right)
        const cannonGeo = new THREE.CylinderGeometry(0.14, 0.18, 1.4, 8);
        cannonGeo.rotateX(Math.PI / 2);
        const cannonMat = new THREE.MeshStandardMaterial({
          color: 0x334155,
          metalness: 0.8,
          roughness: 0.2
        });

        this.leftCannon = new THREE.Mesh(cannonGeo, cannonMat);
        this.leftCannon.position.set(-1.3, 1.25, 0.5);
        this.player.add(this.leftCannon);

        this.rightCannon = new THREE.Mesh(cannonGeo, cannonMat);
        this.rightCannon.position.set(1.3, 1.25, 0.5);
        this.player.add(this.rightCannon);

        // Thruster exhaust point light
        this.thrusterLight = new THREE.PointLight(0x00f3ff, 1.5, 6);
        this.thrusterLight.position.set(0, 1.0, -1.2);
        this.player.add(this.thrusterLight);

        // Subtle player shadow cylinder
        const shadowGeo = new THREE.CircleGeometry(1.4, 24);
        const shadowMat = new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.45
        });
        const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
        groundShadow.rotation.x = -Math.PI / 2;
        groundShadow.position.y = 0.03;
        this.player.add(groundShadow);

        this.scene.add(this.player);
      }

      /* ---------------- Particle Engine ---------------- */
      initParticles() {
        this.particles = new ParticleEngine(this.scene);
      }

      /* ---------------- Controls & Input Listeners ---------------- */
      initControls() {
        window.addEventListener('keydown', (e) => {
          this.keys[e.code] = true;

          if (e.code === 'KeyP' || e.code === 'Escape') {
            this.togglePause();
          }

          if (e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
            this.triggerDash();
          }

          if (e.code === 'KeyE') {
            this.triggerEmp();
          }
        });

        window.addEventListener('keyup', (e) => {
          this.keys[e.code] = false;
        });

        window.addEventListener('mousemove', (e) => {
          this.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
          this.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('mousedown', (e) => {
          audio.ensureReady();
          if (e.button === 0) {
            this.isShooting = true;
          } else if (e.button === 2) {
            this.triggerEmp();
          }
        });

        window.addEventListener('mouseup', (e) => {
          if (e.button === 0) {
            this.isShooting = false;
          }
        });

        window.addEventListener('contextmenu', (e) => e.preventDefault());
      }

      /* ---------------- UI & HUD Interactivity ---------------- */
      initUI() {
        this.scoreDisplay = document.getElementById('score-display');
        this.highScoreDisplay = document.getElementById('high-score-display');
        this.comboDisplay = document.getElementById('combo-display');
        this.waveDisplay = document.getElementById('wave-display');
        this.healthBar = document.getElementById('health-bar');
        this.healthNum = document.getElementById('health-num');
        this.shieldBar = document.getElementById('shield-bar');
        this.shieldNum = document.getElementById('shield-num');
        this.dashMeter = document.getElementById('dash-meter');
        this.empMeter = document.getElementById('emp-meter');
        this.damageOverlay = document.getElementById('damage-overlay');
        this.waveBanner = document.getElementById('wave-banner');
        this.bannerTitle = document.getElementById('banner-title');
        this.bannerSub = document.getElementById('banner-sub');

        this.startScreen = document.getElementById('start-screen');
        this.pauseScreen = document.getElementById('pause-screen');
        this.gameOverScreen = document.getElementById('gameover-screen');

        this.highScoreDisplay.textContent = this.highScore.toString().padStart(5, '0');

        // Buttons
        document.getElementById('start-btn').addEventListener('click', () => {
          audio.ensureReady();
          this.startGame();
        });

        document.getElementById('sound-btn').addEventListener('click', (e) => {
          audio.ensureReady();
          const active = audio.toggleMute();
          e.target.textContent = active ? '🔊 SFX ON' : '🔇 SFX OFF';
        });

        document.getElementById('pause-btn').addEventListener('click', () => {
          this.togglePause();
        });

        document.getElementById('resume-btn').addEventListener('click', () => {
          this.togglePause();
        });

        document.getElementById('restart-from-pause-btn').addEventListener('click', () => {
          this.restartGame();
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
          this.restartGame();
        });

        // Radar Canvas setup
        this.radarCanvas = document.getElementById('radar-canvas');
        this.radarCtx = this.radarCanvas.getContext('2d');
      }

      /* ---------------- Game State Transitions ---------------- */
      startGame() {
        this.startScreen.classList.remove('active');
        this.pauseScreen.classList.remove('active');
        this.gameOverScreen.classList.remove('active');
        this.state = 'PLAYING';
        this.resetStats();
        this.startWave(1);
      }

      restartGame() {
        this.pauseScreen.classList.remove('active');
        this.gameOverScreen.classList.remove('active');
        this.clearCombatEntities();
        this.state = 'PLAYING';
        this.resetStats();
        this.startWave(1);
      }

      togglePause() {
        if (this.state === 'PLAYING') {
          this.state = 'PAUSED';
          this.pauseScreen.classList.add('active');
        } else if (this.state === 'PAUSED') {
          this.state = 'PLAYING';
          this.pauseScreen.classList.remove('active');
        }
      }

      gameOver() {
        this.state = 'GAMEOVER';
        audio.playExplosion(true);

        if (this.score > this.highScore) {
          this.highScore = this.score;
          localStorage.setItem('cyberdome_high_score', this.highScore.toString());
          this.highScoreDisplay.textContent = this.highScore.toString().padStart(5, '0');
        }

        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-wave').textContent = `WAVE ${this.wave}`;
        document.getElementById('final-kills').textContent = this.killsTotal;
        document.getElementById('final-cores').textContent = this.coresTotal;

        this.gameOverScreen.classList.add('active');
      }

      resetStats() {
        this.score = 0;
        this.comboMultiplier = 1.0;
        this.comboTimer = 0;
        this.wave = 1;
        this.killsTotal = 0;
        this.coresTotal = 0;
        this.health = this.maxHealth;
        this.shield = this.maxShield;
        this.dashCooldown = 0;
        this.empCharge = 0;
        this.player.position.set(0, 0, 0);
        this.velocity.set(0, 0, 0);
        this.updateHUD();
      }

      clearCombatEntities() {
        this.projectiles.forEach(p => this.scene.remove(p.mesh));
        this.projectiles = [];
        this.enemyProjectiles.forEach(p => this.scene.remove(p.mesh));
        this.enemyProjectiles = [];
        this.drones.forEach(d => this.scene.remove(d.mesh));
        this.drones = [];
        this.energyCores.forEach(c => this.scene.remove(c.mesh));
        this.energyCores = [];
      }

      /* ---------------- Wave Spawning & Progression ---------------- */
      startWave(num) {
        this.wave = num;
        this.waveDisplay.textContent = `WAVE ${num.toString().padStart(2, '0')}`;
        audio.playWaveFanfare();

        // Wave Announcement banner
        this.bannerTitle.textContent = `WAVE ${num.toString().padStart(2, '0')}`;
        const subMsgs = [
          'CHASER RECON DETECTED // PURGE SECTOR',
          'RANGED TURRETS ONLINE // TAKE COVER',
          'HEAVY JUGGERNAUTS INBOUND // EVASIVE MANEUVERS',
          'HIGH THREAT OVERLOAD // MAXIMUM AGGRESSION'
        ];
        this.bannerSub.textContent = subMsgs[Math.min(num - 1, subMsgs.length - 1)];
        this.waveBanner.classList.add('show');
        setTimeout(() => {
          this.waveBanner.classList.remove('show');
        }, 2200);

        // Calculate Drone Army for this wave
        this.dronesToSpawn = 5 + num * 3;
        this.spawnTimer = 0.5;
        this.waveIntermission = 0;
      }

      spawnDrone() {
        const angle = Math.random() * Math.PI * 2;
        const dist = this.arenaRadius - 4;
        const x = Math.cos(angle) * dist;
        const z = Math.sin(angle) * dist;

        // Drone Type selection
        let type = 'CHASER';
        const roll = Math.random();
        if (this.wave >= 2 && roll > 0.65) {
          type = 'SHOOTER';
        }
        if (this.wave >= 3 && roll > 0.88) {
          type = 'HEAVY';
        }

        let mesh;
        let hp = 35;
        let speed = 12.0;
        let shootDelay = 2.0;

        if (type === 'CHASER') {
          // Fast tetrahedral razor drone
          const geom = new THREE.ConeGeometry(0.8, 1.8, 4);
          geom.rotateX(Math.PI / 2);
          const mat = new THREE.MeshStandardMaterial({
            color: 0x1f1a24,
            roughness: 0.3,
            metalness: 0.85
          });
          mesh = new THREE.Mesh(geom, mat);

          // Glowing red eye
          const eyeGeo = new THREE.SphereGeometry(0.3, 8, 8);
          const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
          const eye = new THREE.Mesh(eyeGeo, eyeMat);
          eye.position.set(0, 0.2, 0.6);
          mesh.add(eye);

          mesh.position.set(x, 1.2, z);
          mesh.castShadow = true;
          speed = 11.5 + Math.random() * 2.0;
          hp = 30 + this.wave * 5;
        } else if (type === 'SHOOTER') {
          // Octagonal hovering sniper turret
          const geom = new THREE.CylinderGeometry(1.1, 1.1, 0.5, 8);
          const mat = new THREE.MeshStandardMaterial({
            color: 0x0f2334,
            roughness: 0.2,
            metalness: 0.9
          });
          mesh = new THREE.Mesh(geom, mat);

          // Turret barrel
          const barrelGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 8);
          barrelGeo.rotateX(Math.PI / 2);
          const barrelMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
          const barrel = new THREE.Mesh(barrelGeo, barrelMat);
          barrel.position.set(0, 0, 0.7);
          mesh.add(barrel);

          mesh.position.set(x, 2.0, z);
          mesh.castShadow = true;
          speed = 7.5;
          hp = 50 + this.wave * 8;
        } else {
          // Massive armored Juggernaut
          const geom = new THREE.BoxGeometry(2.4, 2.4, 2.4);
          const mat = new THREE.MeshStandardMaterial({
            color: 0x221118,
            roughness: 0.2,
            metalness: 0.9
          });
          mesh = new THREE.Mesh(geom, mat);

          const eyeGeo = new THREE.BoxGeometry(1.6, 0.3, 0.4);
          const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0022 });
          const eye = new THREE.Mesh(eyeGeo, eyeMat);
          eye.position.set(0, 0.3, 1.2);
          mesh.add(eye);

          mesh.position.set(x, 1.8, z);
          mesh.castShadow = true;
          speed = 4.8;
          hp = 140 + this.wave * 25;
        }

        this.scene.add(mesh);
        this.drones.push({
          type,
          mesh,
          hp,
          maxHp: hp,
          speed,
          shootDelay,
          shootTimer: 1.0 + Math.random() * 2.0,
          radius: type === 'HEAVY' ? 1.6 : 0.9,
          bobOffset: Math.random() * Math.PI * 2
        });
      }

      /* ---------------- Combat Actions ---------------- */
      firePlayerCannon() {
        if (this.shootCooldown > 0) return;
        this.shootCooldown = this.shootFireRate;
        audio.playShoot();

        // Alternate cannons
        const cannon = (this.cannonSide === 1) ? this.leftCannon : this.rightCannon;
        this.cannonSide *= -1;

        const origin = new THREE.Vector3();
        cannon.getWorldPosition(origin);

        const target = this.mouseWorld.clone();
        target.y = origin.y;
        const dir = target.sub(origin).normalize();

        // Projectile visual (glowing plasma bolt)
        const boltGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8);
        boltGeo.rotateX(Math.PI / 2);
        const boltMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
        const bolt = new THREE.Mesh(boltGeo, boltMat);

        bolt.position.copy(origin);
        bolt.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
        this.scene.add(bolt);

        this.projectiles.push({
          mesh: bolt,
          dir: dir,
          speed: 55,
          life: 0,
          maxLife: 1.5,
          damage: 28
        });

        // Muzzle flash sparks
        this.particles.spawn(origin.x, origin.y, origin.z, 6, {r: 0, g: 0.9, b: 1}, 8, 0.8);
      }

      fireEnemyBullet(origin, targetPos) {
        audio.playEnemyShoot();
        const dir = targetPos.clone().sub(origin).normalize();

        const boltGeo = new THREE.SphereGeometry(0.25, 8, 8);
        const boltMat = new THREE.MeshBasicMaterial({ color: 0xff4400 });
        const bolt = new THREE.Mesh(boltGeo, boltMat);
        bolt.position.copy(origin);
        this.scene.add(bolt);

        this.enemyProjectiles.push({
          mesh: bolt,
          dir: dir,
          speed: 18,
          life: 0,
          maxLife: 3.5,
          damage: 18
        });
      }

      triggerDash() {
        if (this.dashCooldown > 0 || this.isDashing) return;
        this.isDashing = true;
        this.dashDuration = 0.22;
        this.dashCooldown = this.dashMaxCooldown;
        audio.playDash();

        // Dash in movement direction or facing direction
        if (this.velocity.lengthSq() > 0.1) {
          this.dashDir.copy(this.velocity).normalize();
        } else {
          this.player.getWorldDirection(this.dashDir);
        }

        // Dash burst trail particles
        this.particles.spawn(
          this.player.position.x,
          this.player.position.y + 0.5,
          this.player.position.z,
          25,
          { r: 0.2, g: 0.8, b: 1 },
          12,
          1.5
        );
      }

      triggerEmp() {
        if (this.empCharge < 100 || this.empExpanding) return;
        this.empCharge = 0;
        this.empExpanding = true;
        this.empRadius = 1;
        audio.playEmp();
        this.addScreenShake(0.5);

        // Destroy all active enemy projectiles
        this.enemyProjectiles.forEach(p => {
          this.particles.spawn(p.mesh.position.x, p.mesh.position.y, p.mesh.position.z, 8, { r: 1, g: 0.5, b: 0 });
          this.scene.remove(p.mesh);
        });
        this.enemyProjectiles = [];

        // Stun / Heavily damage all drones in 25 unit radius
        this.drones.forEach(d => {
          const dist = d.mesh.position.distanceTo(this.player.position);
          if (dist < 26) {
            d.hp -= 90;
            const pushDir = d.mesh.position.clone().sub(this.player.position).normalize();
            d.mesh.position.addScaledVector(pushDir, 5.0);
            this.particles.spawn(d.mesh.position.x, d.mesh.position.y, d.mesh.position.z, 15, { r: 0, g: 1, b: 1 });
          }
        });
      }

      spawnEnergyCore(x, z) {
        const coreGeo = new THREE.OctahedronGeometry(0.6, 0);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x00ff88,
          emissive: 0x00aa44,
          roughness: 0.1,
          metalness: 0.9
        });
        const mesh = new THREE.Mesh(coreGeo, coreMat);
        mesh.position.set(x, 1.0, z);

        // Core halo ring
        const haloGeo = new THREE.TorusGeometry(0.85, 0.06, 6, 16);
        const haloMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = Math.PI / 2;
        mesh.add(halo);

        this.scene.add(mesh);
        this.energyCores.push({
          mesh,
          life: 18.0, // despawn timeout
          bobPhase: Math.random() * Math.PI * 2
        });
      }

      takeDamage(amount) {
        if (this.isDashing) return; // Invulnerable during cyber dash
        this.shieldRechargeDelay = 3.5;
        this.addScreenShake(amount * 0.025);
        audio.playDamage();

        // Damage Vignette UI flash
        this.damageOverlay.classList.add('hit');
        setTimeout(() => this.damageOverlay.classList.remove('hit'), 160);

        if (this.shield > 0) {
          const absorbed = Math.min(this.shield, amount);
          this.shield -= absorbed;
          amount -= absorbed;
        }

        if (amount > 0) {
          this.health -= amount;
          if (this.health <= 0) {
            this.health = 0;
            this.gameOver();
          }
        }
        this.updateHUD();
      }

      addScreenShake(intensity) {
        this.shakeIntensity = Math.min(this.shakeIntensity + intensity, 1.2);
      }

      /* ---------------- Update Loop (Delta Time Normalization) ---------------- */
      update(dt) {
        if (this.state !== 'PLAYING') return;

        this.updatePlayer(dt);
        this.updateAiming();
        this.updateProjectiles(dt);
        this.updateDrones(dt);
        this.updateCores(dt);
        this.updateEmpShockwave(dt);
        this.updateSpawner(dt);
        this.updateCamera(dt);
        this.particles.update(dt);
        this.updateHUD();
        this.drawRadar();
      }

      updatePlayer(dt) {
        // 1. Dash logic
        if (this.isDashing) {
          this.dashDuration -= dt;
          this.player.position.addScaledVector(this.dashDir, 36 * dt);
          this.particles.spawn(
            this.player.position.x,
            this.player.position.y + 0.8,
            this.player.position.z,
            2,
            { r: 0, g: 0.9, b: 1 },
            3,
            1.0
          );
          if (this.dashDuration <= 0) {
            this.isDashing = false;
          }
        } else {
          // Standard WASD acceleration
          const moveDir = new THREE.Vector3();
          if (this.keys['KeyW'] || this.keys['ArrowUp']) moveDir.z -= 1;
          if (this.keys['KeyS'] || this.keys['ArrowDown']) moveDir.z += 1;
          if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveDir.x -= 1;
          if (this.keys['KeyD'] || this.keys['ArrowRight']) moveDir.x += 1;

          if (moveDir.lengthSq() > 0) {
            moveDir.normalize();
            this.velocity.addScaledVector(moveDir, this.playerSpeed * 6.5 * dt);
          }

          // Damping friction
          this.velocity.multiplyScalar(Math.pow(0.04, dt));
          this.player.position.addScaledVector(this.velocity, dt);
        }

        // Cooldowns
        if (this.dashCooldown > 0) {
          this.dashCooldown = Math.max(0, this.dashCooldown - dt);
        }
        if (this.shootCooldown > 0) {
          this.shootCooldown = Math.max(0, this.shootCooldown - dt);
        }

        // Automatic Shield Recharge after delay
        if (this.shieldRechargeDelay > 0) {
          this.shieldRechargeDelay -= dt;
        } else if (this.shield < this.maxShield) {
          this.shield = Math.min(this.maxShield, this.shield + 12 * dt);
        }

        // Combo Multiplier decay
        if (this.comboTimer > 0) {
          this.comboTimer -= dt;
          if (this.comboTimer <= 0) {
            this.comboMultiplier = 1.0;
          }
        }

        // Arena boundary collision
        const distFromCenter = Math.hypot(this.player.position.x, this.player.position.z);
        if (distFromCenter > this.arenaRadius - 2.0) {
          const angle = Math.atan2(this.player.position.z, this.player.position.x);
          this.player.position.x = Math.cos(angle) * (this.arenaRadius - 2.0);
          this.player.position.z = Math.sin(angle) * (this.arenaRadius - 2.0);
          this.velocity.multiplyScalar(-0.4); // bouncy recoil
        }

        // Pillar obstacle collision
        this.pillars.forEach(p => {
          const dx = this.player.position.x - p.x;
          const dz = this.player.position.z - p.z;
          const dist = Math.hypot(dx, dz);
          const minDist = p.radius + 1.2;
          if (dist < minDist) {
            const pushAngle = Math.atan2(dz, dx);
            this.player.position.x = p.x + Math.cos(pushAngle) * minDist;
            this.player.position.z = p.z + Math.sin(pushAngle) * minDist;
            this.velocity.multiplyScalar(0.5);
          }
        });

        // Continuous shooting when mouse held down
        if (this.isShooting) {
          this.firePlayerCannon();
        }

        // Core chassis subtle hover animation
        this.playerCore.rotation.y += 1.2 * dt;
        this.armorRing.rotation.z += 0.8 * dt;
      }

      updateAiming() {
        // Raycast mouse to ground plane (Y=0)
        this.raycaster.setFromCamera(this.mousePos, this.camera);
        const hit = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(this.groundPlane, hit)) {
          this.mouseWorld.copy(hit);
          this.reticle.position.x = hit.x;
          this.reticle.position.z = hit.z;
          this.reticle.rotation.z += 0.02;

          // Orient player mech smoothly toward aim point
          const lookTarget = new THREE.Vector3(hit.x, this.player.position.y, hit.z);
          this.player.lookAt(lookTarget);

          // Update Laser sight line
          const positions = this.laserLine.geometry.attributes.position.array;
          positions[0] = this.player.position.x;
          positions[1] = this.player.position.y + 1.2;
          positions[2] = this.player.position.z;
          positions[3] = hit.x;
          positions[4] = 0.1;
          positions[5] = hit.z;
          this.laserLine.geometry.attributes.position.needsUpdate = true;
        }
      }

      updateProjectiles(dt) {
        // 1. Player Projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
          const p = this.projectiles[i];
          p.life += dt;
          p.mesh.position.addScaledVector(p.dir, p.speed * dt);

          let hitSomething = false;

          // Check hit against Pillars
          for (let pi = 0; pi < this.pillars.length; pi++) {
            const pil = this.pillars[pi];
            if (Math.hypot(p.mesh.position.x - pil.x, p.mesh.position.z - pil.z) < pil.radius + 0.3) {
              hitSomething = true;
              audio.playHit();
              this.particles.spawn(p.mesh.position.x, p.mesh.position.y, p.mesh.position.z, 6, { r: 0, g: 0.9, b: 1 });
              break;
            }
          }

          // Check hit against Drones
          if (!hitSomething) {
            for (let di = this.drones.length - 1; di >= 0; di--) {
              const drone = this.drones[di];
              const dist = p.mesh.position.distanceTo(drone.mesh.position);
              if (dist < drone.radius + 0.4) {
                hitSomething = true;
                drone.hp -= p.damage;
                audio.playHit();
                this.particles.spawn(p.mesh.position.x, p.mesh.position.y, p.mesh.position.z, 8, { r: 1, g: 0.4, b: 0 });

                // Drone killed?
                if (drone.hp <= 0) {
                  this.killDrone(di);
                }
                break;
              }
            }
          }

          // Out of bounds or timeout
          const outOfArena = Math.hypot(p.mesh.position.x, p.mesh.position.z) > this.arenaRadius;
          if (hitSomething || p.life >= p.maxLife || outOfArena) {
            this.scene.remove(p.mesh);
            this.projectiles.splice(i, 1);
          }
        }

        // 2. Enemy Projectiles
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
          const ep = this.enemyProjectiles[i];
          ep.life += dt;
          ep.mesh.position.addScaledVector(ep.dir, ep.speed * dt);

          // Check hit against Player
          const distToPlayer = ep.mesh.position.distanceTo(this.player.position);
          if (distToPlayer < 1.4) {
            this.takeDamage(ep.damage);
            this.scene.remove(ep.mesh);
            this.enemyProjectiles.splice(i, 1);
            continue;
          }

          // Check hit against Pillars
          let hitPillar = false;
          for (let pi = 0; pi < this.pillars.length; pi++) {
            const pil = this.pillars[pi];
            if (Math.hypot(ep.mesh.position.x - pil.x, ep.mesh.position.z - pil.z) < pil.radius + 0.3) {
              hitPillar = true;
              break;
            }
          }

          const outOfArena = Math.hypot(ep.mesh.position.x, ep.mesh.position.z) > this.arenaRadius;
          if (hitPillar || ep.life >= ep.maxLife || outOfArena) {
            this.scene.remove(ep.mesh);
            this.enemyProjectiles.splice(i, 1);
          }
        }
      }

      killDrone(index) {
        const d = this.drones[index];
        const heavy = d.type === 'HEAVY';
        audio.playExplosion(heavy);
        this.addScreenShake(heavy ? 0.35 : 0.15);

        // Huge particle explosion
        const col = heavy ? { r: 1, g: 0.2, b: 0 } : (d.type === 'SHOOTER' ? { r: 1, g: 0.8, b: 0 } : { r: 1, g: 0, b: 0.4 });
        this.particles.spawn(d.mesh.position.x, d.mesh.position.y, d.mesh.position.z, heavy ? 45 : 22, col, heavy ? 10 : 7, 1.4);

        // Drop Energy Core
        if (Math.random() < (heavy ? 0.95 : 0.4)) {
          this.spawnEnergyCore(d.mesh.position.x, d.mesh.position.z);
        }

        // Score with Combo System
        const basePts = heavy ? 500 : (d.type === 'SHOOTER' ? 250 : 100);
        this.score += Math.round(basePts * this.comboMultiplier);
        this.comboMultiplier = Math.min(4.0, this.comboMultiplier + 0.2);
        this.comboTimer = 3.5;
        this.killsTotal++;

        // Charge EMP meter
        this.empCharge = Math.min(100, this.empCharge + (heavy ? 20 : 8));

        this.scene.remove(d.mesh);
        this.drones.splice(index, 1);
      }

      updateDrones(dt) {
        for (let i = 0; i < this.drones.length; i++) {
          const d = this.drones[i];
          d.bobOffset += dt * 3.0;

          const toPlayer = this.player.position.clone().sub(d.mesh.position);
          const distToPlayer = toPlayer.length();
          toPlayer.normalize();

          // Steering & Behavior by Type
          if (d.type === 'CHASER') {
            // Direct relentless chase
            d.mesh.position.addScaledVector(toPlayer, d.speed * dt);
            d.mesh.lookAt(this.player.position.x, d.mesh.position.y, this.player.position.z);
            d.mesh.position.y = 1.2 + Math.sin(d.bobOffset) * 0.25;

            // Melee damage check
            if (distToPlayer < d.radius + 1.2) {
              this.takeDamage(15);
              // Slight recoil bounce
              d.mesh.position.addScaledVector(toPlayer, -2.5);
            }
          } else if (d.type === 'SHOOTER') {
            // Maintain standoff range (16-24 units)
            if (distToPlayer > 22) {
              d.mesh.position.addScaledVector(toPlayer, d.speed * dt);
            } else if (distToPlayer < 14) {
              d.mesh.position.addScaledVector(toPlayer, -d.speed * dt * 0.8);
            } else {
              // Circle strafe
              const strafe = new THREE.Vector3(-toPlayer.z, 0, toPlayer.x);
              d.mesh.position.addScaledVector(strafe, d.speed * dt * 0.6);
            }
            d.mesh.lookAt(this.player.position.x, d.mesh.position.y, this.player.position.z);
            d.mesh.position.y = 2.0 + Math.sin(d.bobOffset) * 0.3;

            // Ranged firing logic
            d.shootTimer -= dt;
            if (d.shootTimer <= 0) {
              d.shootTimer = d.shootDelay + Math.random() * 0.8;
              this.fireEnemyBullet(d.mesh.position.clone().add(new THREE.Vector3(0, -0.2, 0)), this.player.position);
            }
          } else if (d.type === 'HEAVY') {
            // Slow unstoppable march
            d.mesh.position.addScaledVector(toPlayer, d.speed * dt);
            d.mesh.lookAt(this.player.position.x, d.mesh.position.y, this.player.position.z);
            d.mesh.position.y = 1.8;

            if (distToPlayer < d.radius + 1.2) {
              this.takeDamage(35);
              d.mesh.position.addScaledVector(toPlayer, -2.0);
            }
          }

          // Separation Flocking (drones steer away from each other)
          for (let j = i + 1; j < this.drones.length; j++) {
            const other = this.drones[j];
            const diff = d.mesh.position.clone().sub(other.mesh.position);
            const dist = diff.length();
            const minDist = d.radius + other.radius + 0.4;
            if (dist < minDist && dist > 0.01) {
              diff.normalize().multiplyScalar((minDist - dist) * 0.5);
              d.mesh.position.add(diff);
              other.mesh.position.sub(diff);
            }
          }

          // Avoid arena wall clipping
          const distFromCenter = Math.hypot(d.mesh.position.x, d.mesh.position.z);
          if (distFromCenter > this.arenaRadius - 1.5) {
            const angle = Math.atan2(d.mesh.position.z, d.mesh.position.x);
            d.mesh.position.x = Math.cos(angle) * (this.arenaRadius - 1.5);
            d.mesh.position.z = Math.sin(angle) * (this.arenaRadius - 1.5);
          }
        }
      }

      updateCores(dt) {
        for (let i = this.energyCores.length - 1; i >= 0; i--) {
          const core = this.energyCores[i];
          core.life -= dt;
          core.bobPhase += dt * 3.5;
          core.mesh.rotation.y += 2.0 * dt;
          core.mesh.position.y = 1.0 + Math.sin(core.bobPhase) * 0.3;

          // Magnetic attraction to player if within 9 units
          const dist = core.mesh.position.distanceTo(this.player.position);
          if (dist < 9.5) {
            const pullDir = this.player.position.clone().sub(core.mesh.position).normalize();
            core.mesh.position.addScaledVector(pullDir, 18 * dt);
          }

          // Collection
          if (dist < 1.6) {
            audio.playCorePickup();
            this.score += 250;
            this.coresTotal++;
            this.health = Math.min(this.maxHealth, this.health + 12);
            this.empCharge = Math.min(100, this.empCharge + 15);
            this.particles.spawn(core.mesh.position.x, core.mesh.position.y, core.mesh.position.z, 16, { r: 0, g: 1, b: 0.5 }, 6, 1.2);
            this.scene.remove(core.mesh);
            this.energyCores.splice(i, 1);
            continue;
          }

          // Despawn timeout
          if (core.life <= 0) {
            this.scene.remove(core.mesh);
            this.energyCores.splice(i, 1);
          }
        }
      }

      updateEmpShockwave(dt) {
        if (!this.empExpanding) return;
        this.empRadius += 35 * dt;
        this.empMesh.scale.set(this.empRadius, this.empRadius, 1);
        this.empMesh.position.x = this.player.position.x;
        this.empMesh.position.z = this.player.position.z;
        this.empMesh.material.opacity = Math.max(0, 1.0 - (this.empRadius / 28));

        if (this.empRadius >= 28) {
          this.empExpanding = false;
          this.empMesh.material.opacity = 0;
        }
      }

      updateSpawner(dt) {
        if (this.dronesToSpawn > 0) {
          this.spawnTimer -= dt;
          if (this.spawnTimer <= 0) {
            this.spawnDrone();
            this.dronesToSpawn--;
            this.spawnTimer = Math.max(0.35, 1.2 - this.wave * 0.08);
          }
        } else if (this.drones.length === 0) {
          // Wave complete intermission
          this.waveIntermission += dt;
          if (this.waveIntermission >= 2.5) {
            this.startWave(this.wave + 1);
          }
        }
      }

      updateCamera(dt) {
        // Smooth camera follow player
        const targetPos = this.player.position.clone().add(this.cameraOffset);
        this.camera.position.lerp(targetPos, 0.1);

        // Apply Screen Shake
        if (this.shakeIntensity > 0) {
          const shakeX = (Math.random() * 2 - 1) * this.shakeIntensity * 1.8;
          const shakeZ = (Math.random() * 2 - 1) * this.shakeIntensity * 1.8;
          this.camera.position.x += shakeX;
          this.camera.position.z += shakeZ;
          this.shakeIntensity = Math.max(0, this.shakeIntensity - 3.0 * dt);
        }

        this.camera.lookAt(this.player.position.x, 0.5, this.player.position.z);
      }

      updateHUD() {
        this.scoreDisplay.textContent = this.score.toString().padStart(5, '0');
        this.comboDisplay.textContent = `x${this.comboMultiplier.toFixed(1)}`;
        this.healthBar.style.width = `${(this.health / this.maxHealth) * 100}%`;
        this.healthNum.textContent = `${Math.round((this.health / this.maxHealth) * 100)}%`;
        this.shieldBar.style.width = `${(this.shield / this.maxShield) * 100}%`;
        this.shieldNum.textContent = `${Math.round((this.shield / this.maxShield) * 100)}%`;

        const dashPct = Math.max(0, 1 - (this.dashCooldown / this.dashMaxCooldown)) * 100;
        this.dashMeter.style.width = `${dashPct}%`;
        this.empMeter.style.width = `${this.empCharge}%`;
      }

      drawRadar() {
        const ctx = this.radarCtx;
        const w = this.radarCanvas.width;
        const h = this.radarCanvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const scale = (w / 2 - 6) / this.arenaRadius;

        ctx.clearRect(0, 0, w, h);

        // Boundary ring
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, this.arenaRadius * scale, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.12)';
        ctx.beginPath();
        ctx.moveTo(cx, 4); ctx.lineTo(cx, h - 4);
        ctx.moveTo(4, cy); ctx.lineTo(w - 4, cy);
        ctx.stroke();

        // Energy Cores (Green blips)
        ctx.fillStyle = '#00ff88';
        this.energyCores.forEach(c => {
          const rx = cx + c.mesh.position.x * scale;
          const ry = cy + c.mesh.position.z * scale;
          ctx.fillRect(rx - 1.5, ry - 1.5, 3, 3);
        });

        // Drones (Red/Orange blips)
        this.drones.forEach(d => {
          const rx = cx + d.mesh.position.x * scale;
          const ry = cy + d.mesh.position.z * scale;
          ctx.fillStyle = d.type === 'HEAVY' ? '#ff0033' : (d.type === 'SHOOTER' ? '#ffaa00' : '#ff0066');
          const sz = d.type === 'HEAVY' ? 4.5 : 3;
          ctx.beginPath();
          ctx.arc(rx, ry, sz, 0, Math.PI * 2);
          ctx.fill();
        });

        // Player (Cyan Dot with Heading Line)
        const px = cx + this.player.position.x * scale;
        const py = cy + this.player.position.z * scale;
        ctx.fillStyle = '#00f3ff';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();

        // Heading direction tick
        const pDir = new THREE.Vector3();
        this.player.getWorldDirection(pDir);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + pDir.x * 9, py + pDir.z * 9);
        ctx.stroke();
      }

      onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }

      animate() {
        requestAnimationFrame(this.animate);
        const dt = Math.min(this.clock.getDelta(), 0.1);
        this.update(dt);
        this.renderer.render(this.scene, this.camera);
      }
    }

    // Launch Cyber Dome on Window Load
    window.addEventListener('DOMContentLoaded', () => {
      window.game = new CyberArenaGame();
    });
