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
    const dur = heavy ? 0.75 : 0.38;

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
    filter.frequency.setValueAtTime(heavy ? 1400 : 900, t);
    filter.frequency.exponentialRampToValueAtTime(35, t + dur);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(heavy ? 0.9 : 0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(t);

    // 2. Sub-bass boom
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(heavy ? 140 : 90, t);
    sub.frequency.exponentialRampToValueAtTime(20, t + dur);

    subGain.gain.setValueAtTime(heavy ? 0.85 : 0.45, t);
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

  // Boss Emergency Warning Siren
  playBossAlarm() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = t + i * 0.45;
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, start);
      osc.frequency.linearRampToValueAtTime(850, start + 0.22);
      osc.frequency.linearRampToValueAtTime(450, start + 0.44);

      gain.gain.setValueAtTime(0.35, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.44);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + 0.45);
    }
  }

  // Boss Stomp Shockwave
  playBossStomp() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const sub = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    sub.type = 'sine';
    sub.frequency.setValueAtTime(160, t);
    sub.frequency.exponentialRampToValueAtTime(25, t + 0.85);

    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

    sub.connect(gain);
    gain.connect(this.masterGain);
    sub.start(t);
    sub.stop(t + 0.86);
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
  tex.repeat.set(11, 11);
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
    this.maxParticles = 1000;

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
    this.arenaRadius = 65; // Expanded arena radius
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('cyberdome_high_score') || '0', 10);
    this.pilotName = localStorage.getItem('cyberdome_pilot_name') || 'NEO_PILOT';
    this.comboMultiplier = 1.0;
    this.comboTimer = 0;
    this.comboMaxDuration = 3.5;
    this.wave = 1;
    this.killsTotal = 0;
    this.coresTotal = 0;

    // Boss State
    this.activeBoss = null;
    this.isBossWave = false;

    // Player Stats
    this.maxHealth = 100;
    this.health = 100;
    this.maxShield = 50;
    this.shield = 50;
    this.shieldRechargeDelay = 0;
    this.playerSpeed = 17.5;
    this.velocity = new THREE.Vector3();
    this.keys = {};
    this.mousePos = new THREE.Vector2();
    this.mouseWorld = new THREE.Vector3();
    this.isShooting = false;
    this.shootCooldown = 0;
    this.shootFireRate = 0.12;
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
    this.bossShockwaves = [];

    // Wave Spawner
    this.dronesToSpawn = 0;
    this.spawnTimer = 0;
    this.waveIntermission = 0;

    // Screen Shake
    this.shakeIntensity = 0;

    // Leaderboard
    this.initLeaderboard();

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

  /* ---------------- Leaderboard System (.io Style) ---------------- */
  initLeaderboard() {
    const stored = localStorage.getItem('cyberdome_leaderboard');
    if (stored) {
      try {
        this.leaderboard = JSON.parse(stored);
      } catch (e) {
        this.leaderboard = this.getDefaultLeaderboard();
      }
    } else {
      this.leaderboard = this.getDefaultLeaderboard();
      localStorage.setItem('cyberdome_leaderboard', JSON.stringify(this.leaderboard));
    }
  }

  getDefaultLeaderboard() {
    return [
      { name: 'CYBER_GHOST', score: 18500, wave: 11, kills: 74 },
      { name: 'VORTEX_99', score: 14200, wave: 9, kills: 58 },
      { name: 'NEXUS_VIPER', score: 11800, wave: 7, kills: 46 },
      { name: 'ZERO_DAY', score: 9500, wave: 6, kills: 39 },
      { name: 'SYNTH_BLADE', score: 7200, wave: 5, kills: 31 },
      { name: 'APEX_RUNNER', score: 5400, wave: 4, kills: 24 },
      { name: 'SHADOW_CORE', score: 3800, wave: 3, kills: 18 },
      { name: 'CHRONO_X', score: 2100, wave: 2, kills: 12 }
    ];
  }

  savePlayerScore() {
    const entry = {
      name: this.pilotName,
      score: this.score,
      wave: this.wave,
      kills: this.killsTotal,
      isCurrentPlayer: true
    };

    // Remove previous current player markers
    this.leaderboard.forEach(item => { delete item.isCurrentPlayer; });

    this.leaderboard.push(entry);
    this.leaderboard.sort((a, b) => b.score - a.score);
    this.leaderboard = this.leaderboard.slice(0, 10);
    localStorage.setItem('cyberdome_leaderboard', JSON.stringify(this.leaderboard));

    const rankIdx = this.leaderboard.findIndex(item => item === entry || (item.name === this.pilotName && item.score === this.score));
    return rankIdx !== -1 ? rankIdx + 1 : '>10';
  }

  renderLeaderboard(tableId) {
    const tbody = document.getElementById(tableId);
    if (!tbody) return;
    tbody.innerHTML = '';

    this.leaderboard.forEach((row, idx) => {
      const tr = document.createElement('tr');
      if (row.isCurrentPlayer || (row.name === this.pilotName && row.score === this.score)) {
        tr.classList.add('player-highlight');
      }

      let rankPillClass = '';
      if (idx === 0) rankPillClass = 'rank-gold';
      else if (idx === 1) rankPillClass = 'rank-silver';
      else if (idx === 2) rankPillClass = 'rank-bronze';

      tr.innerHTML = `
        <td><span class="rank-pill ${rankPillClass}">#${idx + 1}</span></td>
        <td>${row.name}</td>
        <td>W${row.wave}</td>
        ${tableId === 'leaderboard-rows' ? `<td>${row.kills || 0}</td>` : ''}
        <td style="font-family: 'Orbitron'; font-weight: 800;">${row.score.toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  /* ---------------- Three.js & Lighting Setup ---------------- */
  initThree() {
    this.container = document.getElementById('canvas-container');
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x080911);
    this.scene.fog = new THREE.FogExp2(0x080911, 0.013);

    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.cameraOffset = new THREE.Vector3(0, 36, 26);
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

    this.raycaster = new THREE.Raycaster();
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    window.addEventListener('resize', () => this.onResize());
  }

  initScene() {
    const ambLight = new THREE.AmbientLight(0x1a2138, 1.25);
    this.scene.add(ambLight);

    this.dirLight = new THREE.DirectionalLight(0xdcf8ff, 1.85);
    this.dirLight.position.set(40, 75, 35);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 160;
    const d = 72;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    const cyanRim = new THREE.DirectionalLight(0x00f3ff, 0.8);
    cyanRim.position.set(-45, 25, -45);
    this.scene.add(cyanRim);

    const magRim = new THREE.PointLight(0xff0055, 1.3, 110);
    magRim.position.set(0, 6, 0);
    this.scene.add(magRim);

    // 1. Expanded Arena Floor Plane (140 x 140)
    const floorGeo = new THREE.PlaneGeometry(140, 140);
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

    // 2. Expanded Arena Outer Boundary Ring
    const ringGeo = new THREE.CylinderGeometry(this.arenaRadius, this.arenaRadius, 4.0, 72, 1, true);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    this.boundaryRing = new THREE.Mesh(ringGeo, ringMat);
    this.boundaryRing.position.y = 2.0;
    this.scene.add(this.boundaryRing);

    const baseRingGeo = new THREE.RingGeometry(this.arenaRadius - 0.5, this.arenaRadius + 0.5, 72);
    const baseRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      side: THREE.DoubleSide
    });
    const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
    baseRing.rotation.x = -Math.PI / 2;
    baseRing.position.y = 0.05;
    this.scene.add(baseRing);

    // 3. Perimeter Neon Defense Pylons (12 Pylons)
    const pylonTex = createPylonTexture();
    const pylonGeo = new THREE.BoxGeometry(2.4, 7, 2.4);
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const px = Math.cos(angle) * this.arenaRadius;
      const pz = Math.sin(angle) * this.arenaRadius;

      const pylonMat = new THREE.MeshStandardMaterial({
        map: pylonTex,
        roughness: 0.3,
        metalness: 0.7
      });
      const pylon = new THREE.Mesh(pylonGeo, pylonMat);
      pylon.position.set(px, 3.5, pz);
      pylon.castShadow = true;
      this.scene.add(pylon);

      const beacon = new THREE.PointLight(0x00f3ff, 0.7, 14);
      beacon.position.set(px, 7.2, pz);
      this.scene.add(beacon);
    }

    // 4. Ground Target Reticle
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

    // Laser Line
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
    const pillarGeo = new THREE.CylinderGeometry(1.8, 2.0, 5.5, 8);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x161c2e,
      roughness: 0.25,
      metalness: 0.8
    });

    // 10 tactical cover pylons spaced across 65-unit arena
    const positions = [
      [-28, -28], [28, -28],
      [-32, 16],  [32, 16],
      [0, -38],   [0, 38],
      [-18, 0],   [18, 0],
      [-22, 38],  [22, 38]
    ];

    positions.forEach(([x, z]) => {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, 2.75, z);
      pillar.castShadow = true;
      pillar.receiveShadow = true;

      const bandGeo = new THREE.CylinderGeometry(1.82, 1.82, 0.65, 8);
      const bandMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.position.y = 0.5;
      pillar.add(band);

      this.scene.add(pillar);
      this.pillars.push({ mesh: pillar, radius: 2.2, x, z });
    });
  }

  /* ---------------- Player Combat Mech Assembly ---------------- */
  initPlayer() {
    this.player = new THREE.Group();
    this.player.position.set(0, 0, 0);

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

    const visorGeo = new THREE.BoxGeometry(0.85, 0.22, 1.15);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.45, 0.4);
    this.player.add(visor);

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

    this.thrusterLight = new THREE.PointLight(0x00f3ff, 1.5, 6);
    this.thrusterLight.position.set(0, 1.0, -1.2);
    this.player.add(this.thrusterLight);

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
    this.comboDecayBar = document.getElementById('combo-decay-bar');
    this.waveDisplay = document.getElementById('wave-display');
    this.healthBar = document.getElementById('health-bar');
    this.healthNum = document.getElementById('health-num');
    this.shieldBar = document.getElementById('shield-bar');
    this.shieldNum = document.getElementById('shield-num');
    this.dashMeter = document.getElementById('dash-meter');
    this.empMeter = document.getElementById('emp-meter');
    this.skillDashCard = document.getElementById('skill-dash-card');
    this.skillEmpCard = document.getElementById('skill-emp-card');
    this.hudPilotName = document.getElementById('hud-pilot-name');
    this.damageOverlay = document.getElementById('damage-overlay');
    this.bossWarningOverlay = document.getElementById('boss-warning-overlay');
    this.waveBanner = document.getElementById('wave-banner');
    this.bannerTitle = document.getElementById('banner-title');
    this.bannerSub = document.getElementById('banner-sub');
    this.damageTextLayer = document.getElementById('damage-text-layer');

    // Boss HUD Elements
    this.bossHud = document.getElementById('boss-hud');
    this.bossName = document.getElementById('boss-name');
    this.bossPhase = document.getElementById('boss-phase');
    this.bossHpBar = document.getElementById('boss-hp-bar');
    this.bossHpText = document.getElementById('boss-hp-text');

    // Screens
    this.startScreen = document.getElementById('start-screen');
    this.pauseScreen = document.getElementById('pause-screen');
    this.gameOverScreen = document.getElementById('gameover-screen');
    this.leaderboardScreen = document.getElementById('leaderboard-screen');

    // Callsign Input
    this.pilotInput = document.getElementById('pilot-input');
    if (this.pilotInput) {
      this.pilotInput.value = this.pilotName;
      this.pilotInput.addEventListener('input', (e) => {
        this.pilotName = (e.target.value.trim().toUpperCase() || 'NEO_PILOT').slice(0, 12);
        localStorage.setItem('cyberdome_pilot_name', this.pilotName);
        this.hudPilotName.textContent = this.pilotName;
      });
    }
    this.hudPilotName.textContent = this.pilotName;

    // Callsign randomizer dice button
    const randomBtn = document.getElementById('random-pilot-btn');
    if (randomBtn) {
      const names = ['CYBER_ACE', 'GHOST_01', 'VIPER_X', 'NEXUS_99', 'SHADOW_K', 'TITAN_SLAYER', 'CHRONO_P', 'APEX_CORE'];
      randomBtn.addEventListener('click', () => {
        const rand = names[Math.floor(Math.random() * names.length)];
        this.pilotName = rand;
        this.pilotInput.value = rand;
        localStorage.setItem('cyberdome_pilot_name', rand);
        this.hudPilotName.textContent = rand;
      });
    }

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

    document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
    document.getElementById('resume-btn').addEventListener('click', () => this.togglePause());
    document.getElementById('restart-from-pause-btn').addEventListener('click', () => this.restartGame());
    document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());

    // Leaderboard modal buttons
    const openLdrBtn = document.getElementById('open-leaderboard-btn');
    if (openLdrBtn) {
      openLdrBtn.addEventListener('click', () => {
        this.renderLeaderboard('leaderboard-rows');
        this.leaderboardScreen.classList.add('active');
      });
    }

    const topLdrBtn = document.getElementById('leaderboard-top-btn');
    if (topLdrBtn) {
      topLdrBtn.addEventListener('click', () => {
        this.renderLeaderboard('leaderboard-rows');
        this.leaderboardScreen.classList.add('active');
      });
    }

    const closeLdrBtn = document.getElementById('close-leaderboard-btn');
    if (closeLdrBtn) {
      closeLdrBtn.addEventListener('click', () => {
        this.leaderboardScreen.classList.remove('active');
      });
    }
  }

  /* ---------------- Floating Damage Text ---------------- */
  spawnDamageText(worldPos, amount, isCrit = false, isBoss = false) {
    if (!this.damageTextLayer) return;

    // Project 3D coordinate to 2D screen coordinate
    const v = worldPos.clone();
    v.y += 1.2;
    v.project(this.camera);

    const x = (v.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(v.y * 0.5) + 0.5) * window.innerHeight;

    const el = document.createElement('div');
    el.className = `floating-dmg ${isCrit ? 'crit' : ''} ${isBoss ? 'boss-dmg' : ''}`;
    el.textContent = isCrit ? `${amount} CRIT!` : `${amount}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    this.damageTextLayer.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 750);
  }

  /* ---------------- Game State Transitions ---------------- */
  startGame() {
    this.startScreen.classList.remove('active');
    this.pauseScreen.classList.remove('active');
    this.gameOverScreen.classList.remove('active');
    this.leaderboardScreen.classList.remove('active');
    this.state = 'PLAYING';
    this.resetStats();
    this.startWave(1);
  }

  restartGame() {
    this.pauseScreen.classList.remove('active');
    this.gameOverScreen.classList.remove('active');
    this.leaderboardScreen.classList.remove('active');
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
    this.bossHud.classList.remove('active');
    this.bossWarningOverlay.classList.remove('pulsing');

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('cyberdome_high_score', this.highScore.toString());
      this.highScoreDisplay.textContent = this.highScore.toString().padStart(5, '0');
    }

    const rank = this.savePlayerScore();

    document.getElementById('final-score').textContent = this.score.toLocaleString();
    document.getElementById('final-wave').textContent = `WAVE ${this.wave}`;
    document.getElementById('final-kills').textContent = this.killsTotal;
    document.getElementById('final-cores').textContent = this.coresTotal;
    document.getElementById('player-rank-val').textContent = `#${rank}`;

    this.renderLeaderboard('gameover-leaderboard-rows');
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
    this.bossHud.classList.remove('active');
    this.bossWarningOverlay.classList.remove('pulsing');
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
    this.bossShockwaves.forEach(s => this.scene.remove(s.mesh));
    this.bossShockwaves = [];
    if (this.activeBoss) {
      this.scene.remove(this.activeBoss.mesh);
      this.activeBoss = null;
    }
  }

  /* ---------------- Wave Spawning & Progression ---------------- */
  startWave(num) {
    this.wave = num;
    this.waveDisplay.textContent = `WAVE ${num.toString().padStart(2, '0')}`;
    this.isBossWave = (num % 5 === 0);

    if (this.isBossWave) {
      // Trigger Boss Encounter Protocol!
      audio.playBossAlarm();
      this.bossWarningOverlay.classList.add('pulsing');

      this.bannerTitle.textContent = `WAVE ${num.toString().padStart(2, '0')} // BOSS ENCOUNTER`;
      this.bannerTitle.className = 'banner-main boss';
      this.bannerSub.textContent = num === 5 ? '⚠️ CYBER COLOSSUS DETECTED // PREPARE FOR BATTLE' : '⚠️ DREADNOUGHT CLASS VIPER // EXTREME THREAT';
      this.waveBanner.classList.add('show');
      setTimeout(() => {
        this.waveBanner.classList.remove('show');
      }, 2800);

      // Spawn Boss
      this.spawnBoss(num);
      this.dronesToSpawn = 3; // Light drone support
      this.spawnTimer = 4.0;
    } else {
      this.bossWarningOverlay.classList.remove('pulsing');
      this.bossHud.classList.remove('active');
      audio.playWaveFanfare();

      this.bannerTitle.textContent = `WAVE ${num.toString().padStart(2, '0')}`;
      this.bannerTitle.className = 'banner-main';
      const subMsgs = [
        'CHASER RECON DETECTED // PURGE SECTOR',
        'RANGED TURRETS ONLINE // TAKE COVER',
        'HEAVY JUGGERNAUTS INBOUND // EVASIVE MANEUVERS',
        'HIGH THREAT OVERLOAD // MAXIMUM AGGRESSION'
      ];
      this.bannerSub.textContent = subMsgs[(num - 1) % subMsgs.length];
      this.waveBanner.classList.add('show');
      setTimeout(() => {
        this.waveBanner.classList.remove('show');
      }, 2200);

      this.dronesToSpawn = 6 + num * 3;
      this.spawnTimer = 0.5;
    }
    this.waveIntermission = 0;
  }

  /* ---------------- BOSS ARCHITECTURE (Wave 5, 10...) ---------------- */
  spawnBoss(waveNum) {
    const isViper = waveNum >= 10;
    const bossNameText = isViper ? 'DREADNOUGHT VIPER // PROTOCOL-X' : 'CYBER COLOSSUS // TITAN-01';

    // Show Boss HUD
    this.bossName.textContent = bossNameText;
    this.bossPhase.textContent = 'PHASE 1';
    this.bossHpBar.style.width = '100%';
    this.bossHpText.textContent = '100%';
    this.bossHud.classList.add('active');

    // Boss Group
    const bossGroup = new THREE.Group();
    const spawnDist = this.arenaRadius - 12;
    bossGroup.position.set(0, 0, -spawnDist);

    // 1. Massive Armored Chassis
    const coreGeo = new THREE.DodecahedronGeometry(3.6, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x121728,
      metalness: 0.9,
      roughness: 0.15
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 3.6;
    core.castShadow = true;
    bossGroup.add(core);

    // 2. Central Cyclops Eye
    const eyeGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(0, 3.6, 2.8);
    bossGroup.add(eye);

    // 3. Rotating Orbital Armor Plates
    const ringGeo1 = new THREE.TorusGeometry(4.8, 0.35, 8, 32);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.3
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 3.6;
    bossGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(5.4, 0.25, 8, 32);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat1);
    ring2.rotation.y = Math.PI / 4;
    ring2.position.y = 3.6;
    bossGroup.add(ring2);

    // 4. Heavy Twin Rotary Cannons
    const gunGeo = new THREE.CylinderGeometry(0.35, 0.45, 3.2, 12);
    gunGeo.rotateX(Math.PI / 2);
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });

    const leftGun = new THREE.Mesh(gunGeo, gunMat);
    leftGun.position.set(-3.2, 3.0, 1.6);
    bossGroup.add(leftGun);

    const rightGun = new THREE.Mesh(gunGeo, gunMat);
    rightGun.position.set(3.2, 3.0, 1.6);
    bossGroup.add(rightGun);

    // 5. Ground Shadow
    const shadowGeo = new THREE.CircleGeometry(4.5, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.05;
    bossGroup.add(shadow);

    this.scene.add(bossGroup);

    const maxHp = 900 + (waveNum - 5) * 220;

    this.activeBoss = {
      mesh: bossGroup,
      core,
      eye,
      ring1,
      ring2,
      leftGun,
      rightGun,
      maxHp,
      hp: maxHp,
      speed: 6.0,
      phase: 1,
      barrageTimer: 2.0,
      spiralTimer: 3.5,
      stompTimer: 5.5,
      bobOffset: 0,
      isViper
    };
  }

  updateBoss(dt) {
    const boss = this.activeBoss;
    if (!boss) return;

    boss.bobOffset += dt * 2.0;
    boss.mesh.position.y = Math.sin(boss.bobOffset) * 0.35;

    boss.ring1.rotation.z += 1.5 * dt;
    boss.ring2.rotation.x += 1.8 * dt;

    // Boss Phase tracking
    const hpRatio = boss.hp / boss.maxHp;
    if (hpRatio <= 0.45 && boss.phase === 1) {
      boss.phase = 2;
      boss.speed = 9.0;
      boss.eye.material.color.setHex(0xff7700); // Berserk fire color
      this.bossPhase.textContent = 'PHASE 2: BERSERK';
      this.bossPhase.style.background = 'var(--neon-yellow)';
      this.bossPhase.style.color = '#000';
      audio.playBossAlarm();
      this.addScreenShake(0.5);

      // Spawn escort minion wave
      for (let i = 0; i < 4; i++) {
        this.spawnDrone();
      }
    }

    // Move smoothly towards player
    const toPlayer = this.player.position.clone().sub(boss.mesh.position);
    toPlayer.y = 0;
    const distToPlayer = toPlayer.length();
    toPlayer.normalize();

    boss.mesh.position.addScaledVector(toPlayer, boss.speed * dt);
    boss.mesh.lookAt(this.player.position.x, 0, this.player.position.z);

    // Collision with Player
    if (distToPlayer < 4.8) {
      this.takeDamage(32);
      // Push player away
      const push = this.player.position.clone().sub(boss.mesh.position).normalize();
      this.player.position.addScaledVector(push, 4.0);
    }

    // Pattern 1: Targeted Heavy Missile Bursts
    boss.barrageTimer -= dt;
    if (boss.barrageTimer <= 0) {
      boss.barrageTimer = (boss.phase === 2 ? 1.4 : 2.2);
      this.fireBossBurst();
    }

    // Pattern 2: Omnidirectional Plasma Spiral (16 directions)
    boss.spiralTimer -= dt;
    if (boss.spiralTimer <= 0) {
      boss.spiralTimer = (boss.phase === 2 ? 2.8 : 3.8);
      this.fireBossSpiral();
    }

    // Pattern 3: Ground Stomp Shockwave
    boss.stompTimer -= dt;
    if (boss.stompTimer <= 0) {
      boss.stompTimer = (boss.phase === 2 ? 4.5 : 6.0);
      this.triggerBossStomp();
    }

    // Update Boss HUD
    const pct = Math.max(0, Math.round(hpRatio * 100));
    this.bossHpBar.style.width = `${pct}%`;
    this.bossHpText.textContent = `${pct}% [${Math.max(0, Math.round(boss.hp))} / ${boss.maxHp}]`;
  }

  fireBossBurst() {
    if (!this.activeBoss) return;
    const boss = this.activeBoss;
    audio.playEnemyShoot();

    // Fire from left & right cannons
    const origins = [new THREE.Vector3(), new THREE.Vector3()];
    boss.leftGun.getWorldPosition(origins[0]);
    boss.rightGun.getWorldPosition(origins[1]);

    origins.forEach(orig => {
      const dir = this.player.position.clone().sub(orig).normalize();
      const boltGeo = new THREE.SphereGeometry(0.38, 8, 8);
      const boltMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
      const bolt = new THREE.Mesh(boltGeo, boltMat);
      bolt.position.copy(orig);
      this.scene.add(bolt);

      this.enemyProjectiles.push({
        mesh: bolt,
        dir: dir,
        speed: 24,
        life: 0,
        maxLife: 3.5,
        damage: 22
      });
    });
  }

  fireBossSpiral() {
    if (!this.activeBoss) return;
    const center = this.activeBoss.mesh.position.clone();
    center.y = 2.0;
    audio.playEnemyShoot();
    this.addScreenShake(0.15);

    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dir = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));

      const boltGeo = new THREE.SphereGeometry(0.32, 8, 8);
      const boltMat = new THREE.MeshBasicMaterial({ color: 0xff6600 });
      const bolt = new THREE.Mesh(boltGeo, boltMat);
      bolt.position.copy(center);
      this.scene.add(bolt);

      this.enemyProjectiles.push({
        mesh: bolt,
        dir: dir,
        speed: 16,
        life: 0,
        maxLife: 4.0,
        damage: 18
      });
    }
  }

  triggerBossStomp() {
    if (!this.activeBoss) return;
    const pos = this.activeBoss.mesh.position.clone();
    pos.y = 0.15;
    audio.playBossStomp();
    this.addScreenShake(0.4);

    // Stomp particle burst
    this.particles.spawn(pos.x, 1.0, pos.z, 35, { r: 1, g: 0.2, b: 0.1 }, 12, 1.8);

    // Expanding shockwave mesh
    const ringGeo = new THREE.RingGeometry(0.5, 1.8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff0044,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(pos);
    this.scene.add(ring);

    this.bossShockwaves.push({
      mesh: ring,
      radius: 1.8,
      maxRadius: 28.0,
      center: pos.clone()
    });
  }

  updateBossShockwaves(dt) {
    for (let i = this.bossShockwaves.length - 1; i >= 0; i--) {
      const s = this.bossShockwaves[i];
      s.radius += 26 * dt;
      s.mesh.scale.set(s.radius, s.radius, 1);
      s.mesh.material.opacity = Math.max(0, 1.0 - (s.radius / s.maxRadius));

      // Player collision check
      const dist = this.player.position.distanceTo(s.center);
      if (Math.abs(dist - s.radius) < 1.6) {
        if (!this.isDashing) {
          this.takeDamage(26);
        }
      }

      if (s.radius >= s.maxRadius) {
        this.scene.remove(s.mesh);
        this.bossShockwaves.splice(i, 1);
      }
    }
  }

  killBoss() {
    if (!this.activeBoss) return;
    const bPos = this.activeBoss.mesh.position.clone();

    // Huge multi-stage explosions
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        audio.playExplosion(true);
        this.addScreenShake(0.5);
        this.particles.spawn(
          bPos.x + (Math.random() * 4 - 2),
          bPos.y + (Math.random() * 4 - 2),
          bPos.z + (Math.random() * 4 - 2),
          45,
          { r: 1, g: 0.5, b: 0 },
          14,
          2.0
        );
      }, i * 160);
    }

    // Guaranteed 6 Energy Cores dropped
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      this.spawnEnergyCore(bPos.x + Math.cos(angle) * 4.5, bPos.z + Math.sin(angle) * 4.5);
    }

    // Mega Score Award
    this.score += Math.round(5000 * this.comboMultiplier);
    this.killsTotal++;
    this.bossHud.classList.remove('active');
    this.bossWarningOverlay.classList.remove('pulsing');

    this.scene.remove(this.activeBoss.mesh);
    this.activeBoss = null;
  }

  /* ---------------- Regular Drone Spawning ---------------- */
  spawnDrone() {
    const angle = Math.random() * Math.PI * 2;
    const dist = this.arenaRadius - 6;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

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
      const geom = new THREE.ConeGeometry(0.8, 1.8, 4);
      geom.rotateX(Math.PI / 2);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x1f1a24,
        roughness: 0.3,
        metalness: 0.85
      });
      mesh = new THREE.Mesh(geom, mat);

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
      const geom = new THREE.CylinderGeometry(1.1, 1.1, 0.5, 8);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0f2334,
        roughness: 0.2,
        metalness: 0.9
      });
      mesh = new THREE.Mesh(geom, mat);

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

    const cannon = (this.cannonSide === 1) ? this.leftCannon : this.rightCannon;
    this.cannonSide *= -1;

    const origin = new THREE.Vector3();
    cannon.getWorldPosition(origin);

    const target = this.mouseWorld.clone();
    target.y = origin.y;
    const dir = target.sub(origin).normalize();

    const boltGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8);
    boltGeo.rotateX(Math.PI / 2);
    const boltMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
    const bolt = new THREE.Mesh(boltGeo, boltMat);

    bolt.position.copy(origin);
    bolt.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    this.scene.add(bolt);

    const isCrit = Math.random() < 0.2;
    const dmg = isCrit ? 56 : 28;

    this.projectiles.push({
      mesh: bolt,
      dir: dir,
      speed: 60,
      life: 0,
      maxLife: 1.6,
      damage: dmg,
      isCrit: isCrit
    });

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
      speed: 20,
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

    if (this.velocity.lengthSq() > 0.1) {
      this.dashDir.copy(this.velocity).normalize();
    } else {
      this.player.getWorldDirection(this.dashDir);
    }

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

    // Destroy all enemy projectiles
    this.enemyProjectiles.forEach(p => {
      this.particles.spawn(p.mesh.position.x, p.mesh.position.y, p.mesh.position.z, 8, { r: 1, g: 0.5, b: 0 });
      this.scene.remove(p.mesh);
    });
    this.enemyProjectiles = [];

    // Damage Boss if active
    if (this.activeBoss) {
      const dist = this.activeBoss.mesh.position.distanceTo(this.player.position);
      if (dist < 32) {
        this.activeBoss.hp -= 150;
        this.spawnDamageText(this.activeBoss.mesh.position, 150, true, true);
        if (this.activeBoss.hp <= 0) {
          this.killBoss();
        }
      }
    }

    // Damage all drones
    this.drones.forEach(d => {
      const dist = d.mesh.position.distanceTo(this.player.position);
      if (dist < 30) {
        d.hp -= 90;
        const pushDir = d.mesh.position.clone().sub(this.player.position).normalize();
        d.mesh.position.addScaledVector(pushDir, 6.0);
        this.particles.spawn(d.mesh.position.x, d.mesh.position.y, d.mesh.position.z, 15, { r: 0, g: 1, b: 1 });
        this.spawnDamageText(d.mesh.position, 90, true, false);
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

    const haloGeo = new THREE.TorusGeometry(0.85, 0.06, 6, 16);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    mesh.add(halo);

    this.scene.add(mesh);
    this.energyCores.push({
      mesh,
      life: 18.0,
      bobPhase: Math.random() * Math.PI * 2
    });
  }

  takeDamage(amount) {
    if (this.isDashing) return;
    this.shieldRechargeDelay = 3.5;
    this.addScreenShake(amount * 0.025);
    audio.playDamage();

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

  /* ---------------- Update Loop ---------------- */
  update(dt) {
    if (this.state !== 'PLAYING') return;

    this.updatePlayer(dt);
    this.updateAiming();
    this.updateProjectiles(dt);
    if (this.activeBoss) {
      this.updateBoss(dt);
      this.updateBossShockwaves(dt);
    }
    this.updateDrones(dt);
    this.updateCores(dt);
    this.updateEmpShockwave(dt);
    this.updateSpawner(dt);
    this.updateCamera(dt);
    this.particles.update(dt);
    this.updateHUD();
  }

  updatePlayer(dt) {
    if (this.isDashing) {
      this.dashDuration -= dt;
      this.player.position.addScaledVector(this.dashDir, 38 * dt);
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
      const moveDir = new THREE.Vector3();
      if (this.keys['KeyW'] || this.keys['ArrowUp']) moveDir.z -= 1;
      if (this.keys['KeyS'] || this.keys['ArrowDown']) moveDir.z += 1;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveDir.x -= 1;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) moveDir.x += 1;

      if (moveDir.lengthSq() > 0) {
        moveDir.normalize();
        this.velocity.addScaledVector(moveDir, this.playerSpeed * 6.5 * dt);
      }

      this.velocity.multiplyScalar(Math.pow(0.04, dt));
      this.player.position.addScaledVector(this.velocity, dt);
    }

    if (this.dashCooldown > 0) {
      this.dashCooldown = Math.max(0, this.dashCooldown - dt);
    }
    if (this.shootCooldown > 0) {
      this.shootCooldown = Math.max(0, this.shootCooldown - dt);
    }

    if (this.shieldRechargeDelay > 0) {
      this.shieldRechargeDelay -= dt;
    } else if (this.shield < this.maxShield) {
      this.shield = Math.min(this.maxShield, this.shield + 12 * dt);
    }

    // Combo Multiplier Decay Timer
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
      this.velocity.multiplyScalar(-0.4);
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

    if (this.isShooting) {
      this.firePlayerCannon();
    }

    this.playerCore.rotation.y += 1.2 * dt;
    this.armorRing.rotation.z += 0.8 * dt;
  }

  updateAiming() {
    this.raycaster.setFromCamera(this.mousePos, this.camera);
    const hit = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.groundPlane, hit)) {
      this.mouseWorld.copy(hit);
      this.reticle.position.x = hit.x;
      this.reticle.position.z = hit.z;
      this.reticle.rotation.z += 0.02;

      const lookTarget = new THREE.Vector3(hit.x, this.player.position.y, hit.z);
      this.player.lookAt(lookTarget);

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

      // Check hit against Boss
      if (!hitSomething && this.activeBoss) {
        const distToBoss = p.mesh.position.distanceTo(this.activeBoss.mesh.position);
        if (distToBoss < 4.8) {
          hitSomething = true;
          this.activeBoss.hp -= p.damage;
          audio.playHit();
          this.particles.spawn(p.mesh.position.x, p.mesh.position.y, p.mesh.position.z, 10, { r: 1, g: 0.3, b: 0 });
          this.spawnDamageText(p.mesh.position, p.damage, p.isCrit, true);

          if (this.activeBoss.hp <= 0) {
            this.killBoss();
          }
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
            this.spawnDamageText(p.mesh.position, p.damage, p.isCrit, false);

            if (drone.hp <= 0) {
              this.killDrone(di);
            }
            break;
          }
        }
      }

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

      const distToPlayer = ep.mesh.position.distanceTo(this.player.position);
      if (distToPlayer < 1.4) {
        this.takeDamage(ep.damage);
        this.scene.remove(ep.mesh);
        this.enemyProjectiles.splice(i, 1);
        continue;
      }

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

    const col = heavy ? { r: 1, g: 0.2, b: 0 } : (d.type === 'SHOOTER' ? { r: 1, g: 0.8, b: 0 } : { r: 1, g: 0, b: 0.4 });
    this.particles.spawn(d.mesh.position.x, d.mesh.position.y, d.mesh.position.z, heavy ? 45 : 22, col, heavy ? 10 : 7, 1.4);

    if (Math.random() < (heavy ? 0.95 : 0.4)) {
      this.spawnEnergyCore(d.mesh.position.x, d.mesh.position.z);
    }

    const basePts = heavy ? 500 : (d.type === 'SHOOTER' ? 250 : 100);
    this.score += Math.round(basePts * this.comboMultiplier);
    this.comboMultiplier = Math.min(4.0, this.comboMultiplier + 0.2);
    this.comboTimer = this.comboMaxDuration;
    this.killsTotal++;

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

      if (d.type === 'CHASER') {
        d.mesh.position.addScaledVector(toPlayer, d.speed * dt);
        d.mesh.lookAt(this.player.position.x, d.mesh.position.y, this.player.position.z);
        d.mesh.position.y = 1.2 + Math.sin(d.bobOffset) * 0.25;

        if (distToPlayer < d.radius + 1.2) {
          this.takeDamage(15);
          d.mesh.position.addScaledVector(toPlayer, -2.5);
        }
      } else if (d.type === 'SHOOTER') {
        if (distToPlayer > 24) {
          d.mesh.position.addScaledVector(toPlayer, d.speed * dt);
        } else if (distToPlayer < 14) {
          d.mesh.position.addScaledVector(toPlayer, -d.speed * dt * 0.8);
        } else {
          const strafe = new THREE.Vector3(-toPlayer.z, 0, toPlayer.x);
          d.mesh.position.addScaledVector(strafe, d.speed * dt * 0.6);
        }
        d.mesh.lookAt(this.player.position.x, d.mesh.position.y, this.player.position.z);
        d.mesh.position.y = 2.0 + Math.sin(d.bobOffset) * 0.3;

        d.shootTimer -= dt;
        if (d.shootTimer <= 0) {
          d.shootTimer = d.shootDelay + Math.random() * 0.8;
          this.fireEnemyBullet(d.mesh.position.clone().add(new THREE.Vector3(0, -0.2, 0)), this.player.position);
        }
      } else if (d.type === 'HEAVY') {
        d.mesh.position.addScaledVector(toPlayer, d.speed * dt);
        d.mesh.lookAt(this.player.position.x, d.mesh.position.y, this.player.position.z);
        d.mesh.position.y = 1.8;

        if (distToPlayer < d.radius + 1.2) {
          this.takeDamage(35);
          d.mesh.position.addScaledVector(toPlayer, -2.0);
        }
      }

      // Flocking separation
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

      const dist = core.mesh.position.distanceTo(this.player.position);
      if (dist < 10.5) {
        const pullDir = this.player.position.clone().sub(core.mesh.position).normalize();
        core.mesh.position.addScaledVector(pullDir, 20 * dt);
      }

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

      if (core.life <= 0) {
        this.scene.remove(core.mesh);
        this.energyCores.splice(i, 1);
      }
    }
  }

  updateEmpShockwave(dt) {
    if (!this.empExpanding) return;
    this.empRadius += 40 * dt;
    this.empMesh.scale.set(this.empRadius, this.empRadius, 1);
    this.empMesh.position.x = this.player.position.x;
    this.empMesh.position.z = this.player.position.z;
    this.empMesh.material.opacity = Math.max(0, 1.0 - (this.empRadius / 32));

    if (this.empRadius >= 32) {
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
    } else if (this.drones.length === 0 && !this.activeBoss) {
      this.waveIntermission += dt;
      if (this.waveIntermission >= 2.5) {
        this.startWave(this.wave + 1);
      }
    }
  }

  updateCamera(dt) {
    const targetPos = this.player.position.clone().add(this.cameraOffset);
    this.camera.position.lerp(targetPos, 0.1);

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

    // Combo Decay Bar width %
    const decayPct = this.comboMultiplier > 1.0 ? Math.max(0, (this.comboTimer / this.comboMaxDuration) * 100) : 0;
    this.comboDecayBar.style.width = `${decayPct}%`;

    this.healthBar.style.width = `${(this.health / this.maxHealth) * 100}%`;
    this.healthNum.textContent = `${Math.round((this.health / this.maxHealth) * 100)}%`;
    this.shieldBar.style.width = `${(this.shield / this.maxShield) * 100}%`;
    this.shieldNum.textContent = `${Math.round((this.shield / this.maxShield) * 100)}%`;

    const dashPct = Math.max(0, 1 - (this.dashCooldown / this.dashMaxCooldown)) * 100;
    this.dashMeter.style.width = `${dashPct}%`;
    this.empMeter.style.width = `${this.empCharge}%`;

    // Highlight Ready cards
    if (this.dashCooldown <= 0) {
      this.skillDashCard.classList.add('ready');
    } else {
      this.skillDashCard.classList.remove('ready');
    }

    if (this.empCharge >= 100) {
      this.skillEmpCard.classList.add('ready');
    } else {
      this.skillEmpCard.classList.remove('ready');
    }
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
