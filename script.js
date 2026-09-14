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

  playShoot(triple = false) {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = triple ? 'square' : 'sawtooth';
    osc.frequency.setValueAtTime(triple ? 1200 : 950, t);
    osc.frequency.exponentialRampToValueAtTime(triple ? 200 : 140, t + 0.1);

    gain.gain.setValueAtTime(triple ? 0.35 : 0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.11);
  }

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

  playExplosion(heavy = false) {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const dur = heavy ? 0.85 : 0.38;

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
    filter.frequency.setValueAtTime(heavy ? 1500 : 900, t);
    filter.frequency.exponentialRampToValueAtTime(30, t + dur);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(heavy ? 0.95 : 0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(t);

    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(heavy ? 150 : 90, t);
    sub.frequency.exponentialRampToValueAtTime(18, t + dur);

    subGain.gain.setValueAtTime(heavy ? 0.9 : 0.45, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    sub.connect(subGain);
    subGain.connect(this.masterGain);
    sub.start(t);
    sub.stop(t + dur);
  }

  playCorePickup(overcharge = false) {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const freqs = overcharge ? [440, 554.37, 659.25, 880, 1108.73] : [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = t + idx * 0.04;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, start);

      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + 0.32);
    });
  }

  playPowerup() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const freqs = [329.63, 440, 554.37, 659.25, 880, 1108.73, 1318.51];
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = t + idx * 0.045;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, start);

      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.32);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + 0.35);
    });
  }

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

  playStreak() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = t + idx * 0.05;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, start);
      gain.gain.setValueAtTime(0.28, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.32);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + 0.35);
    });
  }

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

  playTeleport() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(1400, t + 0.15);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.16);
  }

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

  playLaserSweep() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.linearRampToValueAtTime(1200, t + 0.4);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.42);
  }

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

  playShock() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.linearRampToValueAtTime(140, t + 0.12);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  playChrono() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.55);
    gain.gain.setValueAtTime(0.65, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.6);
  }

  speakAnnouncement(text) {
    if (this.muted) return;
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 0.65;
        utterance.rate = 1.05;
        utterance.volume = 0.85;
        window.speechSynthesis.speak(utterance);
      } catch (e) {}
    }
  }

  playLaserSizzle() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420 + Math.random() * 200, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.12);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  playSingularityHum() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(70, t);
    osc.frequency.linearRampToValueAtTime(40, t + 0.4);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.42);
  }

  playDashReady() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(1600, t + 0.05);

    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  playHitmarkerTick() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2400, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.035);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  playCounterStun() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.45);

    gain.gain.setValueAtTime(0.55, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.46);
  }

  playHeartbeat() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    [0, 0.22].forEach((offset, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 0 ? 80 : 65, t + offset);
      osc.frequency.exponentialRampToValueAtTime(25, t + offset + 0.16);

      gain.gain.setValueAtTime(0.85, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.16);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + offset);
      osc.stop(t + offset + 0.18);
    });
  }

  playParry() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(3200, t + 0.08);
    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  playEmpChain() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.22);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.23);
  }

  /* ---------------- Procedural Synthwave BGM Engine ---------------- */
  startBgm() {
    if (this.bgmPlaying || !this.ctx) return;
    this.bgmPlaying = true;
    this.bgmStep = 0;
    this.bgmBaseBpm = 116;
    this.bgmFastBpm = 138;
    this.bgmIsFast = false;
    this.bgmBpm = this.bgmBaseBpm;

    if (!this.bgmGain) {
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.24, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);
    }

    this.scheduleBgmLoop();
  }

  stopBgm() {
    this.bgmPlaying = false;
    clearTimeout(this.bgmTimer);
  }

  setBgmTempo(fast = false) {
    this.bgmIsFast = fast;
    this.bgmBpm = fast ? this.bgmFastBpm : this.bgmBaseBpm;
  }

  scheduleBgmLoop() {
    if (!this.bgmPlaying || !this.ctx) return;
    const stepDuration = 60 / (this.bgmBpm * 4); // 16th-note clock

    this.playSynthwaveStep(this.bgmStep, this.ctx.currentTime);
    this.bgmStep = (this.bgmStep + 1) % 64;

    this.bgmTimer = setTimeout(() => {
      this.scheduleBgmLoop();
    }, stepDuration * 1000);
  }

  playSynthwaveStep(step, t) {
    if (this.muted || !this.ctx) return;

    // 1. Kick on beats 0, 4, 8, 12 ...
    const beatInBar = step % 16;
    if (beatInBar === 0 || beatInBar === 8) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(130, t);
      kickOsc.frequency.exponentialRampToValueAtTime(32, t + 0.12);
      kickGain.gain.setValueAtTime(0.65, t);
      kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      kickOsc.connect(kickGain);
      kickGain.connect(this.bgmGain);
      kickOsc.start(t);
      kickOsc.stop(t + 0.13);
    }

    // 2. Snare on beats 4 and 12
    if (beatInBar === 4 || beatInBar === 12) {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.1);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, t);
      filter.Q.value = 1.2;
      const snareGain = this.ctx.createGain();
      snareGain.gain.setValueAtTime(0.32, t);
      snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      noise.connect(filter);
      filter.connect(snareGain);
      snareGain.connect(this.bgmGain);
      noise.start(t);
    }

    // 3. Hi-Hat on off-beats & accents
    if (step % 2 === 0) {
      const hatBufferSize = Math.floor(this.ctx.sampleRate * 0.035);
      const hatBuffer = this.ctx.createBuffer(1, hatBufferSize, this.ctx.sampleRate);
      const data = hatBuffer.getChannelData(0);
      for (let i = 0; i < hatBufferSize; i++) data[i] = Math.random() * 2 - 1;
      const hatNoise = this.ctx.createBufferSource();
      hatNoise.buffer = hatBuffer;
      const hatFilter = this.ctx.createBiquadFilter();
      hatFilter.type = 'highpass';
      hatFilter.frequency.setValueAtTime(7000, t);
      const hatGain = this.ctx.createGain();
      const isAccented = (beatInBar === 2 || beatInBar === 6 || beatInBar === 10 || beatInBar === 14);
      hatGain.gain.setValueAtTime(isAccented ? 0.2 : 0.1, t);
      hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
      hatNoise.connect(hatFilter);
      hatFilter.connect(hatGain);
      hatGain.connect(this.bgmGain);
      hatNoise.start(t);
    }

    // 4. Rolling Cyber Bassline (Am -> F -> G -> Em)
    const bar = Math.floor(step / 16) % 4;
    const rootNotes = [55, 43.65, 49, 41.2]; // A1, F1, G1, E1
    const rootFreq = rootNotes[bar];
    const bassOsc = this.ctx.createOscillator();
    const bassFilter = this.ctx.createBiquadFilter();
    const bassGain = this.ctx.createGain();

    bassOsc.type = 'sawtooth';
    const octaveMult = (step % 4 === 2) ? 2.0 : 1.0;
    bassOsc.frequency.setValueAtTime(rootFreq * octaveMult, t);

    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(this.bgmIsFast ? 750 : 500, t);
    bassFilter.frequency.exponentialRampToValueAtTime(140, t + 0.09);
    bassFilter.Q.value = 4.0;

    bassGain.gain.setValueAtTime(0.35, t);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(this.bgmGain);
    bassOsc.start(t);
    bassOsc.stop(t + 0.1);
  }
}

const audio = new SoundEngine();

/* =========================================================================
   PROCEDURAL CANVAS TEXTURES
   ========================================================================= */
function createHexFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0a0d18';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const a = Math.random() * 0.04;
    ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
    ctx.fillRect(x, y, 2, 2);
  }

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

  return new THREE.CanvasTexture(canvas);
}

/* =========================================================================
   PARTICLE SYSTEM
   ========================================================================= */
class ParticleEngine {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.maxParticles = 1200;

    const geom = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.maxParticles * 3);
    this.colors = new Float32Array(this.maxParticles * 3);
    this.sizes = new Float32Array(this.maxParticles);

    geom.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    geom.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

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
          p.vy -= 9.8 * dt * 0.5;

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
   NEON MECHA PALETTES
   ========================================================================= */
const MECHA_PALETTES = {
  CYAN: {
    name: 'CYBER CYAN',
    hex: 0x00f3ff,
    css: '#00f3ff',
    accentRgb: { r: 0, g: 0.95, b: 1.0 }
  },
  EMERALD: {
    name: 'TOXIC EMERALD',
    hex: 0x00ff66,
    css: '#00ff66',
    accentRgb: { r: 0, g: 1.0, b: 0.4 }
  },
  VIOLET: {
    name: 'HYPER VIOLET',
    hex: 0xd946ef,
    css: '#d946ef',
    accentRgb: { r: 0.85, g: 0.27, b: 0.94 }
  },
  GOLD: {
    name: 'SOLAR GOLD',
    hex: 0xffe600,
    css: '#ffe600',
    accentRgb: { r: 1.0, g: 0.9, b: 0 }
  }
};

/* =========================================================================
   TIERED AUGMENT CHIP POOLS (WAVE 5, 10, 15)
   ========================================================================= */
const AUGMENT_CHIP_POOLS = {
  WAVE_5: [
    {
      id: 'RICOCHET',
      icon: '🪃',
      title: 'RICOCHET ROUNDS',
      tag: 'KINETIC DYNAMICS',
      desc: 'Plasma bolts reflect off arena walls and pillars up to 2 times, striking hostiles on rebound.',
      passiveNote: 'Shots ricochet with 100% velocity'
    },
    {
      id: 'VAMPIRIC',
      icon: '🩸',
      title: 'NANITE SIPHON',
      tag: 'NANITE HARVEST',
      desc: 'Hits harvest Nanite Stacks (up to x10). Boosts Shield regen +1.5/s per stack and leeches +6 Shield on hit.',
      passiveNote: '+1.5 Shield/s per stack & 25% siphon chance'
    },
    {
      id: 'STATIC_ARC',
      icon: '⚡',
      title: 'TESLA COIL',
      tag: 'ARC DISCHARGE',
      desc: 'Integrated Tesla coils auto-discharge high-voltage electric arcs every 1.5s to 2 nearby hostiles for 45 shock damage.',
      passiveNote: 'Auto chain lightning every 1.5s'
    }
  ],
  WAVE_10: [
    {
      id: 'OVERDRIVE',
      icon: '🌀',
      title: 'PHASE OVERDRIVE',
      tag: 'SPATIAL WARP',
      desc: 'Dash cooldown reduced to 1.1s, leaves 4 holographic ghost echoes, and expands EMP blast radius by +40%.',
      passiveNote: '1.1s Dash CDR + 44m EMP blast'
    },
    {
      id: 'SPLINTER',
      icon: '💥',
      title: 'PLASMA SHRAPNEL',
      tag: 'CHAIN REACTION',
      desc: 'Eliminating an enemy detonates 4 seeking homing shrapnels that track down and impale nearby targets.',
      passiveNote: '4 Seeking needles on enemy kill'
    },
    {
      id: 'ADRENALINE',
      icon: '🚀',
      title: 'NITRO AFTERBURNER',
      tag: 'PROPULSION MATRIX',
      desc: '+20% base movement speed. Dashing ignites a searing thermal jet trail that burns pursuing hostiles.',
      passiveNote: '+20% Speed & Dash fire trail'
    }
  ],
  WAVE_15: [
    {
      id: 'VORTEX',
      icon: '🌌',
      title: 'GRAVITY SINGULARITY',
      tag: 'QUANTUM GRAVITY',
      desc: 'Every 4th plasma shot collapses into a miniature gravity vortex, pulling nearby hostiles together with 120 implosion damage.',
      passiveNote: 'Every 4th shot creates black hole vortex'
    },
    {
      id: 'CASCADE',
      icon: '🌋',
      title: 'GATLING CASCADE',
      tag: 'HYPER-ACCELERATOR',
      desc: 'Continuous firing builds Cascade Stacks (up to x8). Boosts fire rate by up to +60% and expands plasma projectile size.',
      passiveNote: '+60% Fire rate & massive bolts at x8'
    },
    {
      id: 'CHRONO',
      icon: '⏳',
      title: 'CHRONOSHIFT AEGIS',
      tag: 'TEMPORAL EMERGENCY',
      desc: 'When Hull drops below 25%, triggers an emergency temporal slow-mo stasis for 1.5s and restores +40 Shield (45s CD).',
      passiveNote: 'Emergency time freeze & +40 Shield'
    }
  ]
};

/* =========================================================================
   MAIN GAME CLASS
   ========================================================================= */
class CyberArenaGame {
  constructor() {
    this.state = 'MENU';
    this.arenaRadius = 65;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('cyberdome_high_score') || '0', 10);
    this.pilotName = localStorage.getItem('cyberdome_pilot_name') || 'PILOT_01';
    this.comboMultiplier = 1.0;
    this.comboTimer = 0;
    this.comboMaxDuration = 3.5;
    this.wave = 1;
    this.killsTotal = 0;
    this.coresTotal = 0;

    // Neon Palette Customization
    this.currentPalette = localStorage.getItem('cyberdome_mecha_palette') || 'CYAN';

    // Weapon Augment Chips & Passives Trackers
    this.activeAugments = new Set();
    this.vampiricStacks = 0;
    this.vampiricDecayTimer = 0;
    this.teslaCooldown = 0;
    this.vortexShotCount = 0;
    this.cascadeStacks = 0;
    this.cascadeDecayTimer = 0;
    this.chronoCooldown = 0;
    this.groundHazards = [];
    this.singularities = [];

    // Combat Performance Rating Trackers
    this.parryCount = 0;
    this.counterStunCount = 0;
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.currentComboDamage = 0;
    this.maxComboDamage = 0;
    this.maxComboMultiplier = 1.0;
    this.finalGrade = 'B';

    // Time scale for cinematic slow motion on boss kill
    this.timeScale = 1.0;
    this.slowMoTimer = 0;

    // Multi-Kill Streak Tracker
    this.recentKills = 0;
    this.killStreakTimer = 0;

    // Triple Weapon Overcharge buff
    this.overchargeTimer = 0;

    // Boss & Mechanics
    this.activeBoss = null;
    this.isBossWave = false;
    this.vortexSingularity = null;

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
    this.empCharge = 0;
    this.empMesh = null;
    this.empExpanding = false;
    this.empRadius = 0;

    // Entities
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.drones = [];
    this.energyCores = [];
    this.pillars = [];
    this.canisters = [];
    this.bossShockwaves = [];
    this.dangerTelegraphs = [];

    // Wave Spawner
    this.dronesToSpawn = 0;
    this.spawnTimer = 0;
    this.waveIntermission = 0;

    // Screen Shake
    this.shakeIntensity = 0;

    // Initialize 100% Real Leaderboard (clean, no fake pilots!)
    this.initRealLeaderboard();

    // Setup Systems
    this.initThree();
    this.initScene();
    this.initPlayer();
    this.initPillars();
    this.initParticles();
    this.initControls();
    this.initUI();

    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  /* ---------------- Real-Only Leaderboard System ---------------- */
  initRealLeaderboard() {
    localStorage.removeItem('cyberdome_leaderboard');

    const stored = localStorage.getItem('cyberdome_real_leaderboard');
    if (stored) {
      try {
        this.leaderboard = JSON.parse(stored);
      } catch (e) {
        this.leaderboard = [];
      }
    } else {
      this.leaderboard = [];
      localStorage.setItem('cyberdome_real_leaderboard', JSON.stringify(this.leaderboard));
    }
  }

  savePlayerScore() {
    const entry = {
      name: this.pilotName,
      score: this.score,
      wave: this.wave,
      kills: this.killsTotal,
      palette: this.currentPalette || 'CYAN',
      grade: this.finalGrade || 'B',
      date: new Date().toLocaleDateString(),
      isCurrentPlayer: true
    };

    this.leaderboard.forEach(item => { delete item.isCurrentPlayer; });

    this.leaderboard.push(entry);
    this.leaderboard.sort((a, b) => b.score - a.score);
    this.leaderboard = this.leaderboard.slice(0, 10);
    localStorage.setItem('cyberdome_real_leaderboard', JSON.stringify(this.leaderboard));

    const rankIdx = this.leaderboard.findIndex(item => item === entry || (item.name === this.pilotName && item.score === this.score));
    return rankIdx !== -1 ? rankIdx + 1 : '>10';
  }

  renderLeaderboard(tableId) {
    const tbody = document.getElementById(tableId);
    if (!tbody) return;
    tbody.innerHTML = '';

    if (this.leaderboard.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="6">
          <div class="leaderboard-empty">NO COMBAT RECORDS FOUND // DEPLOY AND CLAIM RANK #1</div>
        </td>
      `;
      tbody.appendChild(tr);
      return;
    }

    this.leaderboard.forEach((row, idx) => {
      const tr = document.createElement('tr');
      if (row.isCurrentPlayer || (row.name === this.pilotName && row.score === this.score)) {
        tr.classList.add('player-highlight');
      }

      let rankPillClass = '';
      if (idx === 0) rankPillClass = 'rank-gold';
      else if (idx === 1) rankPillClass = 'rank-silver';
      else if (idx === 2) rankPillClass = 'rank-bronze';

      const palDot = `<span class="pilot-palette-dot dot-${(row.palette || 'cyan').toLowerCase()}"></span>`;
      const gradePill = `<span class="pilot-grade-pill grade-${(row.grade || 'b').toLowerCase()}">${row.grade || 'B'}</span>`;

      tr.innerHTML = `
        <td><span class="rank-pill ${rankPillClass}">#${idx + 1}</span></td>
        <td>${palDot}${row.name}</td>
        <td>${gradePill}</td>
        <td>W${row.wave}</td>
        ${tableId === 'leaderboard-rows' ? `<td>${row.kills || 0}</td>` : ''}
        <td style="font-family: 'Orbitron'; font-weight: 800;">${row.score.toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  clearLeaderboard() {
    this.leaderboard = [];
    localStorage.removeItem('cyberdome_real_leaderboard');
    this.renderLeaderboard('leaderboard-rows');
    this.renderLeaderboard('gameover-leaderboard-rows');
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

    // Arena Floor
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

    // Arena Boundary Ring
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

    // 12 Perimeter Pylons
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

    // Ground Aim Reticle
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

    // Laser Sight Line
    const laserMat = new THREE.LineBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.25
    });
    const laserPoints = [new THREE.Vector3(), new THREE.Vector3()];
    const laserGeo = new THREE.BufferGeometry().setFromPoints(laserPoints);
    this.laserLine = new THREE.Line(laserGeo, laserMat);
    this.scene.add(this.laserLine);

    // EMP Mesh
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

    const pal = MECHA_PALETTES[this.currentPalette] || MECHA_PALETTES['CYAN'];

    const visorGeo = new THREE.BoxGeometry(0.85, 0.22, 1.15);
    this.visorMat = new THREE.MeshBasicMaterial({ color: pal.hex });
    this.visor = new THREE.Mesh(visorGeo, this.visorMat);
    this.visor.position.set(0, 1.45, 0.4);
    this.player.add(this.visor);

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

    this.thrusterLight = new THREE.PointLight(pal.hex, 1.5, 6);
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

  setPalette(palKey) {
    if (!MECHA_PALETTES[palKey]) palKey = 'CYAN';
    this.currentPalette = palKey;
    localStorage.setItem('cyberdome_mecha_palette', palKey);
    const pal = MECHA_PALETTES[palKey];

    if (this.visorMat) this.visorMat.color.setHex(pal.hex);
    if (this.thrusterLight) this.thrusterLight.color.setHex(pal.hex);

    document.querySelectorAll('.palette-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.palette === palKey);
    });
  }

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

      // DEV SHORTCUT KEYS (Warp to Boss 5, 10, 15)
      if (e.code === 'Digit1') {
        console.log('DEV WARP: Wave 5 (Titan-01)');
        this.clearCombatEntities();
        this.startWave(5);
      } else if (e.code === 'Digit2') {
        console.log('DEV WARP: Wave 10 (Dreadnought Viper)');
        this.clearCombatEntities();
        this.startWave(10);
      } else if (e.code === 'Digit3') {
        console.log('DEV WARP: Wave 15 (Omega Overlord)');
        this.clearCombatEntities();
        this.startWave(15);
      } else if (e.code === 'Digit4') {
        console.log('DEV WARP: Wave 16 (Deep Sector)');
        this.clearCombatEntities();
        this.startWave(16);
      } else if (e.code === 'Digit5') {
        console.log('DEV WARP: Wave 20 (Apex Horizon)');
        this.clearCombatEntities();
        this.startWave(20);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    window.addEventListener('mousemove', (e) => {
      this.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (this.cyberCrosshair) {
        this.cyberCrosshair.style.left = `${e.clientX}px`;
        this.cyberCrosshair.style.top = `${e.clientY}px`;
      }
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
    this.cyberCrosshair = document.getElementById('cyber-crosshair');
    this.bossVulnIndicator = document.getElementById('boss-vuln-indicator');
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

    // Off-Screen Boss Pointer
    this.bossOffscreenPointer = document.getElementById('boss-offscreen-pointer');
    this.bossPointerArrow = document.getElementById('boss-pointer-arrow');
    this.bossPointerText = document.getElementById('boss-pointer-text');

    // Multi-Kill Streak Banner
    this.streakBanner = document.getElementById('streak-banner');
    this.streakText = document.getElementById('streak-text');

    // Overcharge Weapon Buff HUD
    this.overchargeHud = document.getElementById('overcharge-hud');
    this.ocTimerDisplay = document.getElementById('oc-timer');

    // Boss HUD Elements
    this.bossHud = document.getElementById('boss-hud');
    this.bossWarningBadge = document.getElementById('boss-warning-badge');
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
        this.pilotName = (e.target.value.trim().toUpperCase() || 'PILOT_01').slice(0, 12);
        localStorage.setItem('cyberdome_pilot_name', this.pilotName);
        this.hudPilotName.textContent = this.pilotName;
      });
    }
    this.hudPilotName.textContent = this.pilotName;

    // Callsign randomizer
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

    // Leaderboard buttons
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

    // Palette Selection Buttons
    document.querySelectorAll('.palette-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setPalette(btn.dataset.palette);
        audio.playClick();
      });
    });
    this.setPalette(this.currentPalette);

    // Augment Chip Selection
    document.querySelectorAll('.augment-card').forEach(card => {
      const augKey = card.dataset.augment;
      const btn = card.querySelector('.select-aug-btn');
      const pick = () => this.selectAugment(augKey);
      if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); pick(); });
      card.addEventListener('click', pick);
    });
  }

  /* ---------------- Floating Damage Text ---------------- */
  spawnDamageText(worldPos, amount, isCrit = false, isBoss = false) {
    if (!this.damageTextLayer) return;

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

  /* ---------------- Multi-Kill Streak Arcade Announcements ---------------- */
  showStreakAnnouncement(text) {
    if (!this.streakBanner || !this.streakText) return;
    audio.playStreak();
    this.streakText.textContent = text;
    this.streakBanner.classList.add('show');
    clearTimeout(this.streakTimeout);
    this.streakTimeout = setTimeout(() => {
      this.streakBanner.classList.remove('show');
    }, 1200);
  }

  triggerHitmarker() {
    if (!this.cyberCrosshair) return;
    this.cyberCrosshair.classList.add('hit');
    audio.playHitmarkerTick();
    clearTimeout(this.hitmarkerTimeout);
    this.hitmarkerTimeout = setTimeout(() => {
      if (this.cyberCrosshair) this.cyberCrosshair.classList.remove('hit');
    }, 90);
  }

  checkBossCounterStun(source = 'EMP') {
    const boss = this.activeBoss;
    if (!boss || boss.stunTimer > 0) return false;
    let isVulnerable = false;
    if (boss.tier === 'VIPER' && (boss.isTeleportCharging || boss.deathRayStage === 'charge')) {
      isVulnerable = true;
      boss.isTeleportCharging = false;
      boss.deathRayActive = false;
      boss.deathRayStage = 'idle';
      if (boss.laserBeamMesh) {
        this.scene.remove(boss.laserBeamMesh);
        boss.laserBeamMesh = null;
      }
    } else if (boss.tier === 'OMEGA' && boss.isLaserWheelCharging) {
      isVulnerable = true;
      boss.isLaserWheelCharging = false;
    } else if (boss.tier === 'TITAN' && boss.stompTimer <= 0.8) {
      isVulnerable = true;
      boss.stompTimer = 4.5;
    }

    if (isVulnerable) {
      this.counterStunCount++;
      boss.stunTimer = 1.6;
      audio.playCounterStun();
      this.addScreenShake(0.65);
      this.particles.spawn(boss.mesh.position.x, boss.mesh.position.y + 1.5, boss.mesh.position.z, 40, { r: 0, g: 0.95, b: 1 }, 14, 1.8);
      this.spawnDamageText(boss.mesh.position, '⚡ COUNTER STUN! ⚡', true, true);
      this.showStreakAnnouncement('COUNTER STUN!');
      return true;
    }
    return false;
  }

  isBossChargingVulnerable() {
    const boss = this.activeBoss;
    if (!boss || boss.stunTimer > 0) return false;
    if (boss.tier === 'VIPER') {
      return boss.isTeleportCharging || boss.deathRayStage === 'charge';
    }
    if (boss.tier === 'OMEGA') {
      return boss.isLaserWheelCharging;
    }
    if (boss.tier === 'TITAN') {
      return boss.stompTimer <= 0.8;
    }
    return false;
  }

  updateBossVulnIndicator() {
    if (!this.bossVulnIndicator) return;
    if (!this.activeBoss || !this.isBossChargingVulnerable()) {
      this.bossVulnIndicator.classList.remove('active');
      return;
    }

    const bossPos = this.activeBoss.mesh.position.clone();
    bossPos.y += (this.activeBoss.tier === 'OMEGA' ? 6.2 : 5.2);
    bossPos.project(this.camera);

    if (bossPos.z > 1) {
      this.bossVulnIndicator.classList.remove('active');
      return;
    }

    const x = (bossPos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(bossPos.y * 0.5) + 0.5) * window.innerHeight;

    this.bossVulnIndicator.style.left = `${x}px`;
    this.bossVulnIndicator.style.top = `${y}px`;
    this.bossVulnIndicator.classList.add('active');
  }

  clampToArena(vec, maxRadius = this.arenaRadius - 5) {
    const dist = Math.hypot(vec.x, vec.z);
    if (dist > maxRadius) {
      const angle = Math.atan2(vec.z, vec.x);
      return new THREE.Vector3(Math.cos(angle) * maxRadius, vec.y, Math.sin(angle) * maxRadius);
    }
    return vec;
  }

  /* ---------------- Telegraph Ground Danger Decals ---------------- */
  createDangerDecal(pos, radius, duration = 1.0, isLine = false, endPos = null) {
    let mesh;
    if (isLine && endPos) {
      const points = [pos.clone(), endPos.clone()];
      points[0].y = 0.1;
      points[1].y = 0.1;
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({ color: 0xff0033, linewidth: 3 });
      mesh = new THREE.Line(geom, mat);
    } else {
      const geom = new THREE.RingGeometry(radius - 0.4, radius, 32);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xff0033,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(pos.x, 0.08, pos.z);
    }

    this.scene.add(mesh);
    this.dangerTelegraphs.push({
      mesh,
      duration,
      life: 0
    });
  }

  updateDangerTelegraphs(dt) {
    for (let i = this.dangerTelegraphs.length - 1; i >= 0; i--) {
      const d = this.dangerTelegraphs[i];
      d.life += dt;
      if (d.mesh.material) {
        d.mesh.material.opacity = (Math.sin(d.life * 15) * 0.3 + 0.6);
      }
      if (d.life >= d.duration) {
        this.scene.remove(d.mesh);
        this.dangerTelegraphs.splice(i, 1);
      }
    }
  }

  /* ---------------- Off-Screen Boss Pointer ---------------- */
  updateOffscreenBossPointer() {
    if (!this.bossOffscreenPointer) return;
    if (!this.activeBoss) {
      this.bossOffscreenPointer.classList.remove('active');
      return;
    }

    const bossPos = this.activeBoss.mesh.position.clone();
    const dist = this.player.position.distanceTo(bossPos);

    const projected = bossPos.clone().project(this.camera);
    const isBehind = (projected.z > 1);

    const pad = 48;
    const screenX = (projected.x * 0.5 + 0.5) * window.innerWidth;
    const screenY = (-(projected.y * 0.5) + 0.5) * window.innerHeight;

    const isOffscreen = isBehind || screenX < pad || screenX > window.innerWidth - pad || screenY < pad || screenY > window.innerHeight - pad;

    if (isOffscreen) {
      this.bossOffscreenPointer.classList.add('active');

      let dirX = projected.x;
      let dirY = projected.y;
      if (isBehind) {
        dirX = -dirX;
        dirY = -dirY;
      }

      const angle = Math.atan2(-dirY, dirX);
      const radiusX = (window.innerWidth / 2) - pad;
      const radiusY = (window.innerHeight / 2) - pad;

      const edgeX = (window.innerWidth / 2) + Math.cos(angle) * radiusX;
      const edgeY = (window.innerHeight / 2) + Math.sin(angle) * radiusY;

      this.bossOffscreenPointer.style.left = `${edgeX}px`;
      this.bossOffscreenPointer.style.top = `${edgeY}px`;

      const deg = (angle * 180 / Math.PI) + 90;
      this.bossPointerArrow.style.transform = `rotate(${deg}deg)`;

      let bLabel = 'TITAN';
      if (this.activeBoss.tier === 'VIPER') bLabel = 'VIPER';
      else if (this.activeBoss.tier === 'OMEGA') bLabel = 'OMEGA';

      this.bossPointerText.textContent = `${bLabel} [${Math.round(dist)}m]`;
    } else {
      this.bossOffscreenPointer.classList.remove('active');
    }
  }

  /* ---------------- Explosive EMP Canisters ---------------- */
  spawnCanisters(count) {
    const geom = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 12);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xff3300,
      roughness: 0.3,
      metalness: 0.8
    });

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 18 + Math.random() * (this.arenaRadius - 32);
      const cx = Math.cos(angle) * dist;
      const cz = Math.sin(angle) * dist;

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(cx, 1.25, cz);
      mesh.castShadow = true;

      const band = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 0.6, 12), new THREE.MeshBasicMaterial({ color: 0xffe600 }));
      band.position.y = 0.2;
      mesh.add(band);

      this.scene.add(mesh);
      this.canisters.push({ mesh, x: cx, z: cz, radius: 1.4 });
    }
  }

  explodeCanister(index) {
    if (index >= this.canisters.length) return;
    const can = this.canisters[index];
    const cPos = can.mesh.position.clone();

    this.scene.remove(can.mesh);
    this.canisters.splice(index, 1);

    audio.playExplosion(true);
    this.addScreenShake(0.5);

    // Big fiery explosion particles
    this.particles.spawn(cPos.x, cPos.y + 0.5, cPos.z, 50, { r: 1, g: 0.4, b: 0 }, 16, 2.2);

    // Shockwave damage (18-unit radius)
    const blastRadius = 18.0;

    // Damage drones
    for (let di = this.drones.length - 1; di >= 0; di--) {
      const drone = this.drones[di];
      const dist = drone.mesh.position.distanceTo(cPos);
      if (dist < blastRadius) {
        drone.hp -= 180;
        this.spawnDamageText(drone.mesh.position, 180, true, false);
        if (drone.hp <= 0) {
          this.killDrone(di);
        }
      }
    }

    // Damage Boss
    if (this.activeBoss) {
      const bDist = this.activeBoss.mesh.position.distanceTo(cPos);
      if (bDist < blastRadius) {
        this.activeBoss.hp -= 140;
        this.activeBoss.hitFlash = 0.15;
        this.spawnDamageText(this.activeBoss.mesh.position, 140, true, true);
        this.checkBossCounterStun('CANISTER');
        if (this.activeBoss.hp <= 0) {
          this.killBoss();
        }
      }
    }

    // Chain reaction with neighboring canisters
    for (let ci = this.canisters.length - 1; ci >= 0; ci--) {
      const other = this.canisters[ci];
      if (Math.hypot(other.x - cPos.x, other.z - cPos.z) < 14) {
        setTimeout(() => this.explodeCanister(ci), 120);
      }
    }

    // Drone Overload EMP Chain Lightning (up to 3 jumps)
    this.triggerDroneEmpChain(cPos, 3);
  }

  /* ---------------- Drone Overload EMP Chain Lightning ---------------- */
  triggerDroneEmpChain(startPos, maxJumps = 3) {
    if (this.drones.length === 0) return;
    let currentPos = startPos.clone();
    const hitDrones = new Set();

    for (let jump = 0; jump < maxJumps; jump++) {
      let nearestDrone = null;
      let nearestDist = 18.0;

      for (let di = 0; di < this.drones.length; di++) {
        const drone = this.drones[di];
        if (hitDrones.has(drone) || drone.hp <= 0) continue;
        const d = drone.mesh.position.distanceTo(currentPos);
        if (d < nearestDist) {
          nearestDist = d;
          nearestDrone = drone;
        }
      }

      if (!nearestDrone) break;

      hitDrones.add(nearestDrone);
      const targetPos = nearestDrone.mesh.position.clone();

      // Visual Electric Lightning Arc
      this.drawLightningArc(currentPos, targetPos);

      // Overload Damage & Stun
      nearestDrone.hp -= 95;
      nearestDrone.stunTimer = 1.4;
      this.spawnDamageText(targetPos, '⚡ CHAIN OVERLOAD ⚡', true, false);
      this.particles.spawn(targetPos.x, targetPos.y + 1.0, targetPos.z, 16, { r: 0, g: 0.95, b: 1 }, 10, 0.85);

      if (nearestDrone.hp <= 0) {
        const dIdx = this.drones.indexOf(nearestDrone);
        if (dIdx !== -1) this.killDrone(dIdx);
      }

      currentPos = targetPos;
    }

    if (hitDrones.size > 0) {
      audio.playEmpChain();
    }
  }

  drawLightningArc(from, to) {
    const points = [];
    const segments = 6;
    for (let i = 0; i <= segments; i++) {
      const p = from.clone().lerp(to, i / segments);
      if (i > 0 && i < segments) {
        p.x += (Math.random() - 0.5) * 1.5;
        p.y += (Math.random() - 0.5) * 0.9;
        p.z += (Math.random() - 0.5) * 1.5;
      }
      points.push(p);
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 3 });
    const line = new THREE.Line(geom, mat);
    this.scene.add(line);
    setTimeout(() => {
      this.scene.remove(line);
      geom.dispose();
      mat.dispose();
    }, 180);
  }

  /* ---------------- Game State Transitions ---------------- */
  startGame() {
    this.startScreen.classList.remove('active');
    this.pauseScreen.classList.remove('active');
    this.gameOverScreen.classList.remove('active');
    this.leaderboardScreen.classList.remove('active');
    this.state = 'PLAYING';
    this.resetStats();
    this.shakeIntensity = 0;
    if (this.camera && this.player) {
      this.camera.position.copy(this.player.position).add(this.cameraOffset);
      this.camera.lookAt(this.player.position.x, 0.5, this.player.position.z);
    }
    audio.startBgm();
    audio.setBgmTempo(false);
    this.startWave(1);
  }

  restartGame() {
    this.pauseScreen.classList.remove('active');
    this.gameOverScreen.classList.remove('active');
    this.leaderboardScreen.classList.remove('active');
    this.clearCombatEntities();
    this.state = 'PLAYING';
    this.resetStats();
    this.shakeIntensity = 0;
    if (this.camera && this.player) {
      this.camera.position.copy(this.player.position).add(this.cameraOffset);
      this.camera.lookAt(this.player.position.x, 0.5, this.player.position.z);
    }
    audio.startBgm();
    audio.setBgmTempo(false);
    this.startWave(1);
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.pauseScreen.classList.add('active');
      audio.stopBgm();
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.pauseScreen.classList.remove('active');
      audio.startBgm();
    }
  }

  calculateCombatGrade() {
    const accuracy = this.shotsFired > 0 ? Math.round((this.shotsHit / this.shotsFired) * 100) : 0;
    const scoreFactor = (this.parryCount * 500) + (this.counterStunCount * 750) + (accuracy * 35) + Math.floor(this.maxComboDamage * 1.5) + (this.wave * 450);

    let grade = 'C';
    let gradeClass = 'grade-c';
    let gradeTitle = 'RECRUIT PILOT';

    if (scoreFactor >= 8500 || (this.counterStunCount >= 3 && this.parryCount >= 4 && accuracy >= 55)) {
      grade = 'SSS';
      gradeClass = 'grade-sss';
      gradeTitle = 'CYBER TRANSCENDENT';
    } else if (scoreFactor >= 6500 || (this.counterStunCount >= 2 && this.parryCount >= 2)) {
      grade = 'SS';
      gradeClass = 'grade-ss';
      gradeTitle = 'APEX CYBER-ACE';
    } else if (scoreFactor >= 4500 || (this.counterStunCount >= 1 && this.parryCount >= 1)) {
      grade = 'S';
      gradeClass = 'grade-s';
      gradeTitle = 'VETERAN STRIKER';
    } else if (scoreFactor >= 2800) {
      grade = 'A';
      gradeClass = 'grade-a';
      gradeTitle = 'COMBAT SPECIALIST';
    } else if (scoreFactor >= 1500) {
      grade = 'B';
      gradeClass = 'grade-b';
      gradeTitle = 'OPERATOR';
    }

    return {
      grade,
      gradeClass,
      gradeTitle,
      accuracy,
      parryCount: this.parryCount,
      counterStunCount: this.counterStunCount,
      maxComboDamage: Math.round(this.maxComboDamage),
      maxComboMultiplier: this.maxComboMultiplier || 1.0
    };
  }

  gameOver() {
    this.state = 'GAMEOVER';
    this.shakeIntensity = 0;
    audio.stopBgm();
    audio.playExplosion(true);
    this.bossHud.classList.remove('active');
    this.bossWarningOverlay.classList.remove('pulsing');
    this.overchargeHud.classList.remove('active');
    if (this.bossOffscreenPointer) this.bossOffscreenPointer.classList.remove('active');
    if (this.bossVulnIndicator) this.bossVulnIndicator.classList.remove('active');

    const rating = this.calculateCombatGrade();
    this.finalGrade = rating.grade;

    const gradeEl = document.getElementById('combat-rating-grade');
    if (gradeEl) {
      gradeEl.className = `rating-grade-stamp ${rating.gradeClass}`;
      gradeEl.textContent = rating.grade;
    }
    const titleEl = document.getElementById('grade-title');
    if (titleEl) titleEl.textContent = rating.gradeTitle;

    const parryEl = document.getElementById('grade-parries');
    if (parryEl) parryEl.textContent = rating.parryCount;

    const stunEl = document.getElementById('grade-stuns');
    if (stunEl) stunEl.textContent = rating.counterStunCount;

    const accEl = document.getElementById('grade-accuracy');
    if (accEl) accEl.textContent = `${rating.accuracy}%`;

    const comboEl = document.getElementById('grade-max-combo');
    if (comboEl) comboEl.textContent = `${rating.maxComboDamage} DMG (x${rating.maxComboMultiplier.toFixed(1)})`;

    if (rating.grade === 'SSS' || rating.grade === 'SS' || rating.grade === 'S') {
      setTimeout(() => this.fireNeonConfetti('victory'), 300);
    }

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
    this.recentKills = 0;
    this.killStreakTimer = 0;
    this.wave = 1;
    this.killsTotal = 0;
    this.coresTotal = 0;
    this.overchargeTimer = 0;
    this.health = this.maxHealth;
    this.shield = this.maxShield;
    this.dashCooldown = 0;
    this.empCharge = 0;
    this.shakeIntensity = 0;

    // Reset Combat & Augment Stats
    this.parryCount = 0;
    this.counterStunCount = 0;
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.currentComboDamage = 0;
    this.maxComboDamage = 0;
    this.maxComboMultiplier = 1.0;
    this.activeAugments = new Set();
    this.vampiricStacks = 0;
    this.vampiricDecayTimer = 0;
    this.teslaCooldown = 0;
    this.vortexShotCount = 0;
    this.cascadeStacks = 0;
    this.cascadeDecayTimer = 0;
    this.chronoCooldown = 0;
    if (this.groundHazards) {
      this.groundHazards.forEach(h => { if (h.mesh) this.scene.remove(h.mesh); });
    }
    this.groundHazards = [];
    if (this.singularities) {
      this.singularities.forEach(s => { if (s.mesh) this.scene.remove(s.mesh); });
    }
    this.singularities = [];
    this.dashMaxCooldown = 1.8;

    const augContainer = document.getElementById('augments-hud-container');
    if (augContainer) augContainer.innerHTML = '';
    const augScreen = document.getElementById('augment-screen');
    if (augScreen) augScreen.classList.remove('active');

    this.player.position.set(0, 0, 0);
    this.velocity.set(0, 0, 0);
    this.bossHud.classList.remove('active');
    this.bossWarningOverlay.classList.remove('pulsing');
    this.overchargeHud.classList.remove('active');
    if (this.bossOffscreenPointer) this.bossOffscreenPointer.classList.remove('active');
    this.bossCombatTimer = 0;
    this.dropPodSpawned = false;
    this.adrenalineCooldown = 0;
    if (this.dropPod) {
      if (this.dropPod.beacon) this.scene.remove(this.dropPod.beacon);
      if (this.dropPod.mesh) this.scene.remove(this.dropPod.mesh);
      this.dropPod = null;
    }
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
    this.canisters.forEach(c => this.scene.remove(c.mesh));
    this.canisters = [];
    this.bossShockwaves.forEach(s => this.scene.remove(s.mesh));
    this.bossShockwaves = [];
    if (this.dropPod) {
      if (this.dropPod.beacon) this.scene.remove(this.dropPod.beacon);
      if (this.dropPod.mesh) this.scene.remove(this.dropPod.mesh);
      this.dropPod = null;
    }
    this.dangerTelegraphs.forEach(t => this.scene.remove(t.mesh));
    this.dangerTelegraphs = [];
    if (this.vortexSingularity) {
      this.scene.remove(this.vortexSingularity.mesh);
      this.vortexSingularity = null;
    }
    if (this.activeBoss) {
      if (this.activeBoss.laserBeamMesh) {
        this.scene.remove(this.activeBoss.laserBeamMesh);
        this.activeBoss.laserBeamMesh = null;
      }
      if (this.activeBoss.crossBeamGroup) {
        this.scene.remove(this.activeBoss.crossBeamGroup);
        this.activeBoss.crossBeamGroup = null;
      }
      this.scene.remove(this.activeBoss.mesh);
      this.activeBoss = null;
    }
    if (this.bossOffscreenPointer) this.bossOffscreenPointer.classList.remove('active');
  }

  /* ---------------- Wave Spawning & Progression ---------------- */
  startWave(num) {
    this.wave = num;
    this.waveDisplay.textContent = `WAVE ${num.toString().padStart(2, '0')}`;
    this.isBossWave = (num === 5 || num === 10 || num === 15);
    audio.setBgmTempo(false);
    this.bossCombatTimer = 0;
    this.dropPodSpawned = false;
    if (this.dropPod) {
      if (this.dropPod.beacon) this.scene.remove(this.dropPod.beacon);
      if (this.dropPod.mesh) this.scene.remove(this.dropPod.mesh);
      this.dropPod = null;
    }

    // Clear and randomly spawn Explosive Canisters (55% chance per wave, not every wave)
    this.canisters.forEach(c => this.scene.remove(c.mesh));
    this.canisters = [];
    if (Math.random() < 0.55) {
      this.spawnCanisters(3 + Math.floor(Math.random() * 2));
    }

    if (this.isBossWave) {
      audio.playBossAlarm();
      this.bossWarningOverlay.classList.add('pulsing');

      let bossTitle = 'CYBER COLOSSUS // TITAN-01';
      let threatLevel = 'HEAVY MECHA TANK DETECTED';
      if (num === 10) {
        bossTitle = 'DREADNOUGHT VIPER // PROTOCOL-X';
        threatLevel = 'HIGH MOBILITY STEALTH PREDATOR DETECTED';
        audio.speakAnnouncement('Warning. Viper interceptor detected.');
      } else if (num === 15) {
        bossTitle = 'OMEGA OVERLORD // SINGULARITY CORE';
        threatLevel = 'EXTREME END-TIER ANOMALY DETECTED';
        audio.speakAnnouncement('Critical alert. Singularity anomaly detected.');
      } else {
        audio.speakAnnouncement('Warning. Titan colossus incoming.');
      }

      this.bannerTitle.textContent = '⚠️ BOSS DETECTED ⚠️';
      this.bannerTitle.className = 'banner-main boss';
      this.bannerSub.textContent = `${bossTitle} // ${threatLevel}`;
      this.waveBanner.classList.add('show');
      setTimeout(() => {
        this.waveBanner.classList.remove('show');
      }, 1500);

      this.spawnBoss(num);
      this.dronesToSpawn = num === 15 ? 4 : (num === 10 ? 2 : 3);
      this.spawnTimer = 4.0;
    } else {
      this.bossWarningOverlay.classList.remove('pulsing');
      this.bossHud.classList.remove('active');
      if (this.bossOffscreenPointer) this.bossOffscreenPointer.classList.remove('active');
      this.waveBanner.classList.remove('show');
      audio.playWaveFanfare();

      this.dronesToSpawn = 6 + Math.min(num, 20) * 3;
      this.spawnTimer = 0.5;
    }
    this.waveIntermission = 0;
  }

  /* =========================================================================
     BOSS ARCHITECTURE: DISTINCT TIERS (WAVE 5 vs 10 vs 15+)
     ========================================================================= */
  spawnBoss(waveNum) {
    const bossGroup = new THREE.Group();
    const spawnDist = this.arenaRadius - 14;
    bossGroup.position.set(0, 0, -spawnDist);

    let tier = 'TITAN';
    if (waveNum === 10) tier = 'VIPER';
    else if (waveNum >= 15) tier = 'OMEGA';

    this.bossHud.className = 'boss-hud-container active';

    if (tier === 'TITAN') {
      this.bossName.textContent = 'CYBER COLOSSUS // TITAN-01';
      this.bossPhase.textContent = 'PHASE 1: ARMORED';

      const coreGeo = new THREE.DodecahedronGeometry(3.6, 1);
      const coreMat = new THREE.MeshStandardMaterial({ color: 0x121728, metalness: 0.9, roughness: 0.15 });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 3.6;
      core.castShadow = true;
      bossGroup.add(core);

      const eyeGeo = new THREE.SphereGeometry(1.2, 16, 16);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(0, 3.6, 2.8);
      bossGroup.add(eye);

      const ringGeo1 = new THREE.TorusGeometry(4.8, 0.35, 8, 32);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
      const ring1 = new THREE.Mesh(ringGeo1, ringMat);
      ring1.rotation.x = Math.PI / 2;
      ring1.position.y = 3.6;
      bossGroup.add(ring1);

      const gunGeo = new THREE.CylinderGeometry(0.35, 0.45, 3.2, 12);
      gunGeo.rotateX(Math.PI / 2);
      const gunMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
      const leftGun = new THREE.Mesh(gunGeo, gunMat);
      leftGun.position.set(-3.2, 3.0, 1.6);
      bossGroup.add(leftGun);
      const rightGun = new THREE.Mesh(gunGeo, gunMat);
      rightGun.position.set(3.2, 3.0, 1.6);
      bossGroup.add(rightGun);

      this.activeBoss = {
        tier: 'TITAN',
        mesh: bossGroup,
        core,
        eye,
        ring1,
        leftGun,
        rightGun,
        maxHp: 900,
        hp: 900,
        speed: 6.0,
        phase: 1,
        barrageTimer: 2.2,
        spiralTimer: 3.8,
        stompTimer: 5.5,
        bobOffset: 0,
        hitFlash: 0,
        stunTimer: 0
      };

    } else if (tier === 'VIPER') {
      this.bossHud.classList.add('viper-mode');
      this.bossName.textContent = 'DREADNOUGHT VIPER // PROTOCOL-X';
      this.bossPhase.textContent = 'PHASE 1: STEALTH';
      this.bossPhase.style.background = 'var(--neon-purple)';

      // 1. Sleek Delta-Wing Stealth Fighter Hull
      const fuseGeo = new THREE.ConeGeometry(2.0, 9.5, 4);
      fuseGeo.rotateX(Math.PI / 2);
      fuseGeo.scale(1.4, 0.55, 1.0);
      const viperMat = new THREE.MeshStandardMaterial({
        color: 0x11071f,
        metalness: 0.95,
        roughness: 0.18,
        emissive: 0x220033
      });
      const fuselage = new THREE.Mesh(fuseGeo, viperMat);
      fuselage.position.y = 3.6;
      bossGroup.add(fuselage);

      // 2. Cockpit Visor
      const visorGeo = new THREE.BoxGeometry(1.4, 0.35, 2.4);
      const visorMat = new THREE.MeshBasicMaterial({ color: 0xd946ef });
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0, 3.85, 1.4);
      bossGroup.add(visor);

      // 3. Forward-Swept Delta Wings
      const wingGeo = new THREE.BoxGeometry(12.5, 0.25, 4.2);
      const wingMat = new THREE.MeshStandardMaterial({
        color: 0x1f0b38,
        metalness: 0.92,
        roughness: 0.22,
        emissive: 0x100020
      });
      const wings = new THREE.Mesh(wingGeo, wingMat);
      wings.position.set(0, 3.5, -0.6);
      bossGroup.add(wings);

      // Wingtip vertical stabilizer fins
      const finGeo = new THREE.BoxGeometry(0.18, 1.5, 2.2);
      const finMat = new THREE.MeshStandardMaterial({ color: 0x3b0764, metalness: 0.9 });
      const leftFin = new THREE.Mesh(finGeo, finMat);
      leftFin.position.set(-6.1, 4.1, -1.2);
      leftFin.rotation.z = -0.28;
      bossGroup.add(leftFin);

      const rightFin = new THREE.Mesh(finGeo, finMat);
      rightFin.position.set(6.1, 4.1, -1.2);
      rightFin.rotation.z = 0.28;
      bossGroup.add(rightFin);

      // Wing leading edge glow strips
      const stripMat = new THREE.MeshBasicMaterial({ color: 0xc026d3 });
      const leftStrip = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.08, 0.15), stripMat);
      leftStrip.position.set(-3.2, 3.55, 1.2);
      leftStrip.rotation.y = -0.35;
      bossGroup.add(leftStrip);

      const rightStrip = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.08, 0.15), stripMat);
      rightStrip.position.set(3.2, 3.55, 1.2);
      rightStrip.rotation.y = 0.35;
      bossGroup.add(rightStrip);

      // 4. Twin Heavy Thrusters
      const thrusterGeo = new THREE.CylinderGeometry(0.65, 0.8, 2.6, 12);
      thrusterGeo.rotateX(Math.PI / 2);
      const thrusterMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.95 });
      const leftThruster = new THREE.Mesh(thrusterGeo, thrusterMat);
      leftThruster.position.set(-1.9, 3.5, -3.2);
      bossGroup.add(leftThruster);

      const rightThruster = new THREE.Mesh(thrusterGeo, thrusterMat);
      rightThruster.position.set(1.9, 3.5, -3.2);
      bossGroup.add(rightThruster);

      // Glowing nozzle discs
      const glowGeo = new THREE.CircleGeometry(0.6, 16);
      const glowMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, side: THREE.DoubleSide });
      const leftNozzle = new THREE.Mesh(glowGeo, glowMat);
      leftNozzle.position.set(-1.9, 3.5, -4.51);
      bossGroup.add(leftNozzle);

      const rightNozzle = new THREE.Mesh(glowGeo, glowMat);
      rightNozzle.position.set(1.9, 3.5, -4.51);
      bossGroup.add(rightNozzle);

      // Twin underwing railguns
      const gunGeo = new THREE.CylinderGeometry(0.18, 0.22, 3.4, 8);
      gunGeo.rotateX(Math.PI / 2);
      const gunMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 });
      const leftGun = new THREE.Mesh(gunGeo, gunMat);
      leftGun.position.set(-2.8, 3.1, 0.8);
      bossGroup.add(leftGun);

      const rightGun = new THREE.Mesh(gunGeo, gunMat);
      rightGun.position.set(2.8, 3.1, 0.8);
      bossGroup.add(rightGun);

      // Viper Point Light
      const viperLight = new THREE.PointLight(0xd946ef, 2.4, 30);
      viperLight.position.set(0, 3.6, 0);
      bossGroup.add(viperLight);

      this.activeBoss = {
        tier: 'VIPER',
        mesh: bossGroup,
        fuselage,
        visor,
        viperMat,
        wingMat,
        maxHp: 1600,
        hp: 1600,
        speed: 13.0,
        phase: 1,
        // Flight maneuvering
        orbitAngle: Math.PI * 0.5,
        orbitRadius: 21.0,
        orbitDir: 1,
        currentRoll: 0,
        thrusterTimer: 0,
        bobOffset: 0,
        hitFlash: 0,
        // Attacks
        teleportTimer: 4.8,
        isTeleportCharging: false,
        teleportChargeTime: 0,
        deathRayTimer: 3.5,
        deathRayActive: false,
        deathRayStage: 'idle',
        deathRayTime: 0,
        deathRayBaseAngle: 0,
        deathRayStartAngle: 0,
        deathRayCurrentAngle: 0,
        deathRayTick: 0,
        laserBeamMesh: null,
        seekerTimer: 5.5,
        fanTimer: 2.2,
        stunTimer: 0
      };

    } else {
      this.bossHud.classList.add('omega-mode');
      this.bossName.textContent = 'OMEGA OVERLORD // SINGULARITY CORE';
      this.bossPhase.textContent = 'PHASE 1: EVENT HORIZON';
      this.bossPhase.style.background = '#ff0033';

      // 1. Faceted Obsidian Core
      const coreGeo = new THREE.DodecahedronGeometry(4.2, 1);
      const omegaMat = new THREE.MeshStandardMaterial({
        color: 0x05020a,
        metalness: 0.98,
        roughness: 0.08,
        emissive: 0x330011
      });
      const core = new THREE.Mesh(coreGeo, omegaMat);
      core.position.y = 4.4;
      bossGroup.add(core);

      // 2. Inner Pulsing Star Heart
      const heartGeo = new THREE.SphereGeometry(2.2, 20, 20);
      const heartMat = new THREE.MeshBasicMaterial({ color: 0xff002b });
      const heart = new THREE.Mesh(heartGeo, heartMat);
      heart.position.y = 4.4;
      bossGroup.add(heart);

      // 3. Spiked Celestial Gyro Rings helper
      const makeSpikedRing = (radius, tube, spikeCount, color) => {
        const ringGrp = new THREE.Group();
        const rGeo = new THREE.TorusGeometry(radius, tube, 8, 36);
        const rMat = new THREE.MeshStandardMaterial({ color, metalness: 0.95, roughness: 0.2 });
        ringGrp.add(new THREE.Mesh(rGeo, rMat));

        for (let i = 0; i < spikeCount; i++) {
          const a = (i / spikeCount) * Math.PI * 2;
          const spikeGeo = new THREE.ConeGeometry(0.35, 1.4, 6);
          spikeGeo.rotateZ(-Math.PI / 2);
          const spikeMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
          const spike = new THREE.Mesh(spikeGeo, spikeMat);
          spike.position.set(Math.cos(a) * (radius + 0.6), Math.sin(a) * (radius + 0.6), 0);
          spike.rotation.z = a;
          ringGrp.add(spike);
        }
        return ringGrp;
      };

      const ring1 = makeSpikedRing(5.6, 0.35, 6, 0x1f0714);
      ring1.position.y = 4.4;
      bossGroup.add(ring1);

      const ring2 = makeSpikedRing(6.8, 0.3, 8, 0x2e0a1c);
      ring2.position.y = 4.4;
      ring2.rotation.x = Math.PI / 3;
      bossGroup.add(ring2);

      const ring3 = makeSpikedRing(8.0, 0.25, 10, 0x180510);
      ring3.position.y = 4.4;
      ring3.rotation.y = Math.PI / 3;
      bossGroup.add(ring3);

      // 4. Orbiting Dark Matter Crystal Shards (6 crystals)
      const shards = [];
      const shardGeo = new THREE.OctahedronGeometry(0.9, 0);
      const shardMat = new THREE.MeshStandardMaterial({
        color: 0x100208,
        emissive: 0xff0044,
        emissiveIntensity: 0.9,
        metalness: 0.9
      });

      for (let i = 0; i < 6; i++) {
        const sMesh = new THREE.Mesh(shardGeo, shardMat);
        bossGroup.add(sMesh);
        shards.push({
          mesh: sMesh,
          angle: (i / 6) * Math.PI * 2,
          orbitRadius: 10.2,
          orbitSpeed: 0.85 + (i % 2) * 0.45,
          tilt: (i * Math.PI) / 6
        });
      }

      // Crimson core point light
      const omegaLight = new THREE.PointLight(0xff0033, 2.8, 38);
      omegaLight.position.set(0, 4.4, 0);
      bossGroup.add(omegaLight);

      this.activeBoss = {
        tier: 'OMEGA',
        mesh: bossGroup,
        core,
        heart,
        omegaMat,
        ring1, ring2, ring3,
        shards,
        maxHp: 2500,
        hp: 2500,
        speed: 6.0,
        phase: 1,
        bobOffset: 0,
        hitFlash: 0,
        // Attacks
        vortexTimer: 7.5,
        laserWheelTimer: 4.5,
        isLaserWheelCharging: false,
        laserWheelChargeTime: 0,
        isLaserWheelActive: false,
        laserWheelDuration: 0,
        crossAngle: 0,
        crossBeamGroup: null,
        laserWheelTick: 0,
        mortarTimer: 3.2,
        stunTimer: 0
      };
    }

    this.scene.add(bossGroup);
    this.bossHpBar.style.width = '100%';
    this.bossHpText.textContent = `100% [${this.activeBoss.hp} / ${this.activeBoss.maxHp}]`;
  }

  updateBoss(dt) {
    const boss = this.activeBoss;
    if (!boss) return;

    boss.bobOffset += dt * 2.0;
    const hpRatio = boss.hp / boss.maxHp;

    // Hit flash handling across all boss materials
    if (boss.hitFlash > 0) {
      boss.hitFlash -= dt;
      if (boss.tier === 'TITAN') {
        boss.eye.material.color.setHex(0xffffff);
      } else if (boss.tier === 'VIPER') {
        boss.viperMat.emissive.setHex(0xffffff);
        boss.viperMat.emissiveIntensity = 2.0;
        boss.visor.material.color.setHex(0xffffff);
      } else if (boss.tier === 'OMEGA') {
        boss.omegaMat.emissive.setHex(0xffffff);
        boss.omegaMat.emissiveIntensity = 2.5;
        boss.heart.material.color.setHex(0xffffff);
      }
    } else {
      if (boss.tier === 'TITAN') {
        boss.eye.material.color.setHex(boss.phase === 2 ? 0xff7700 : 0xff0033);
      } else if (boss.tier === 'VIPER') {
        boss.viperMat.emissive.setHex(boss.phase === 2 ? 0x660066 : 0x220033);
        boss.viperMat.emissiveIntensity = 1.0;
        boss.visor.material.color.setHex(0xd946ef);
      } else if (boss.tier === 'OMEGA') {
        boss.omegaMat.emissive.setHex(boss.phase === 2 ? 0x660022 : 0x330011);
        boss.omegaMat.emissiveIntensity = 1.0;
        boss.heart.material.color.setHex(0xff002b);
      }
    }

    if (boss.stunTimer > 0) {
      boss.stunTimer -= dt;
      boss.mesh.position.x += (Math.random() - 0.5) * 0.25;
      boss.mesh.position.z += (Math.random() - 0.5) * 0.25;

      // Armor Separation & Core Exposure Effect
      const openProgress = Math.min(1.0, boss.stunTimer / 1.6);
      if (boss.tier === 'TITAN') {
        boss.leftGun.position.x = -3.2 - openProgress * 1.8;
        boss.rightGun.position.x = 3.2 + openProgress * 1.8;
        boss.ring1.scale.setScalar(1.0 + openProgress * 0.45);
        boss.core.material.emissive.setHex(0xff5500);
        boss.core.material.emissiveIntensity = 3.2;
        boss.eye.material.color.setHex(0xffbb00);
      } else if (boss.tier === 'VIPER') {
        boss.fuselage.scale.set(1.4, 0.55 + openProgress * 0.5, 1.0);
        boss.viperMat.emissive.setHex(0xff0055);
        boss.viperMat.emissiveIntensity = 3.2;
        boss.visor.material.color.setHex(0xffe600);
      } else if (boss.tier === 'OMEGA') {
        boss.ring1.scale.setScalar(1.0 + openProgress * 0.55);
        boss.ring2.scale.setScalar(1.0 + openProgress * 0.55);
        boss.ring3.scale.setScalar(1.0 + openProgress * 0.55);
        boss.omegaMat.emissive.setHex(0xff5500);
        boss.omegaMat.emissiveIntensity = 3.6;
        boss.heart.material.color.setHex(0xffaa00);
      }

      if (Math.random() < 0.45) {
        this.particles.spawn(
          boss.mesh.position.x + (Math.random() - 0.5) * 3,
          boss.mesh.position.y + 1.5 + Math.random() * 2,
          boss.mesh.position.z + (Math.random() - 0.5) * 3,
          2,
          { r: 1, g: 0.6, b: 0 },
          4,
          0.38
        );
      }

      if (boss.stunTimer <= 0) {
        // Restore normal armor geometry when stun expires
        if (boss.tier === 'TITAN') {
          boss.leftGun.position.x = -3.2;
          boss.rightGun.position.x = 3.2;
          boss.ring1.scale.setScalar(1.0);
          boss.core.material.emissive.setHex(0x000000);
          boss.core.material.emissiveIntensity = 0;
        } else if (boss.tier === 'VIPER') {
          boss.fuselage.scale.set(1.4, 0.55, 1.0);
        } else if (boss.tier === 'OMEGA') {
          boss.ring1.scale.setScalar(1.0);
          boss.ring2.scale.setScalar(1.0);
          boss.ring3.scale.setScalar(1.0);
        }
      }
      return;
    }

    // Boss Armor Break Sparks & Hull Damage Smoke
    if (hpRatio <= 0.60) {
      boss.damageSparkTimer = (boss.damageSparkTimer || 0) - dt;
      if (boss.damageSparkTimer <= 0) {
        boss.damageSparkTimer = hpRatio <= 0.30 ? 0.12 : 0.28;

        const spread = (boss.tier === 'TITAN' ? 4.2 : 3.2);
        const ox = (Math.random() - 0.5) * spread;
        const oy = 1.8 + Math.random() * 2.2;
        const oz = (Math.random() - 0.5) * spread;

        // Sparks
        this.particles.spawn(
          boss.mesh.position.x + ox,
          boss.mesh.position.y + oy,
          boss.mesh.position.z + oz,
          hpRatio <= 0.30 ? 8 : 4,
          hpRatio <= 0.30 ? { r: 1, g: 0.55, b: 0 } : { r: 1, g: 0.85, b: 0.2 },
          hpRatio <= 0.30 ? 11 : 6,
          0.45
        );

        // Smoldering smoke
        this.particles.spawn(
          boss.mesh.position.x + ox,
          boss.mesh.position.y + oy + 0.6,
          boss.mesh.position.z + oz,
          hpRatio <= 0.30 ? 5 : 3,
          { r: 0.18, g: 0.18, b: 0.22 },
          3.5,
          0.75
        );
      }
    }

    const toPlayer = this.player.position.clone().sub(boss.mesh.position);
    toPlayer.y = 0;
    const distToPlayer = toPlayer.length();
    toPlayer.normalize();

    // ---------------- TIER 1: TITAN (Wave 5) ----------------
    if (boss.tier === 'TITAN') {
      boss.mesh.position.y = Math.sin(boss.bobOffset) * 0.35;
      boss.ring1.rotation.z += 1.5 * dt;

      if (hpRatio <= 0.45 && boss.phase === 1) {
        boss.phase = 2;
        boss.speed = 9.0;
        boss.eye.material.color.setHex(0xff7700);
        this.bossPhase.textContent = 'PHASE 2: BERSERK';
        this.bossPhase.style.background = 'var(--neon-yellow)';
        this.bossPhase.style.color = '#000';
        this.bossHud.classList.add('enraged');
        audio.playBossAlarm();
        audio.speakAnnouncement('TARGET LOCK CONFIRMED. BERSERK PROTOCOL ENGAGED.');
        audio.setBgmTempo(true);
        this.addScreenShake(0.5);
        for (let i = 0; i < 4; i++) this.spawnDrone();
      }

      boss.mesh.position.addScaledVector(toPlayer, boss.speed * dt);
      boss.mesh.lookAt(this.player.position.x, 0, this.player.position.z);

      if (distToPlayer < 4.8) {
        this.takeDamage(32);
        const push = this.player.position.clone().sub(boss.mesh.position).normalize();
        this.player.position.addScaledVector(push, 4.0);
      }

      boss.barrageTimer -= dt;
      if (boss.barrageTimer <= 0) {
        boss.barrageTimer = (boss.phase === 2 ? 1.4 : 2.2);
        this.fireBossBurst();
      }

      boss.spiralTimer -= dt;
      if (boss.spiralTimer <= 0) {
        boss.spiralTimer = (boss.phase === 2 ? 2.8 : 3.8);
        this.fireBossSpiral();
      }

      boss.stompTimer -= dt;
      if (boss.stompTimer <= 0) {
        boss.stompTimer = (boss.phase === 2 ? 4.5 : 6.0);
        this.createDangerDecal(boss.mesh.position, 18, 0.8);
        setTimeout(() => this.triggerBossStomp(), 800);
      }

    // ---------------- TIER 2: VIPER (Wave 10) ----------------
    } else if (boss.tier === 'VIPER') {
      if (hpRatio <= 0.45 && boss.phase === 1) {
        boss.phase = 2;
        boss.speed = 15.0;
        this.bossPhase.textContent = 'PHASE 2: OVERCLOCK';
        this.bossPhase.style.background = 'var(--neon-magenta)';
        this.bossHud.classList.add('enraged');
        audio.playBossAlarm();
        audio.speakAnnouncement('SYSTEM OVERDRIVE. TARGET ACQUIRED.');
        audio.setBgmTempo(true);
        this.addScreenShake(0.6);
      }

      // 1. Aerodynamic Swooping Flight & Banking Turn Physics
      if (!boss.isTeleportCharging && !boss.deathRayActive) {
        boss.orbitAngle += (boss.speed / boss.orbitRadius) * boss.orbitDir * dt * 0.8;
        const destX = this.player.position.x + Math.cos(boss.orbitAngle) * boss.orbitRadius;
        const destZ = this.player.position.z + Math.sin(boss.orbitAngle) * boss.orbitRadius;
        const rawDist = Math.hypot(destX, destZ);
        const maxR = this.arenaRadius - 6;
        const clampedX = rawDist > maxR ? (destX / rawDist) * maxR : destX;
        const clampedZ = rawDist > maxR ? (destZ / rawDist) * maxR : destZ;
        const targetPos = new THREE.Vector3(clampedX, 3.6 + Math.sin(boss.bobOffset * 1.5) * 0.5, clampedZ);
        boss.mesh.position.lerp(targetPos, dt * 2.8);

        boss.mesh.lookAt(this.player.position.x, boss.mesh.position.y, this.player.position.z);

        // Dynamic 3D Bank/Roll into turns
        const targetRoll = -boss.orbitDir * 0.38;
        boss.currentRoll = THREE.MathUtils.lerp(boss.currentRoll, targetRoll, dt * 4.0);
        boss.mesh.rotateZ(boss.currentRoll);

        // Ion Thruster Exhaust Particle Trails
        boss.thrusterTimer += dt;
        if (boss.thrusterTimer >= 0.04) {
          boss.thrusterTimer = 0;
          const leftNozzleWorld = new THREE.Vector3(-1.9, 0, -4.5).applyMatrix4(boss.mesh.matrixWorld);
          const rightNozzleWorld = new THREE.Vector3(1.9, 0, -4.5).applyMatrix4(boss.mesh.matrixWorld);
          this.particles.spawn(leftNozzleWorld.x, leftNozzleWorld.y, leftNozzleWorld.z, 2, { r: 0, g: 0.9, b: 1 }, 6, 0.4);
          this.particles.spawn(rightNozzleWorld.x, rightNozzleWorld.y, rightNozzleWorld.z, 2, { r: 0.8, g: 0.1, b: 1 }, 6, 0.4);
        }
      }

      // 2. Phase-Blink Teleport (with charging telegraph)
      if (boss.isTeleportCharging) {
        boss.teleportChargeTime -= dt;
        boss.mesh.position.x += (Math.random() - 0.5) * 0.3;
        boss.mesh.position.z += (Math.random() - 0.5) * 0.3;
        this.particles.spawn(boss.mesh.position.x, boss.mesh.position.y, boss.mesh.position.z, 4, { r: 0.8, g: 0.1, b: 1 }, 10, 0.8);

        if (boss.teleportChargeTime <= 0) {
          boss.isTeleportCharging = false;
          audio.playTeleport();
          this.particles.spawn(boss.mesh.position.x, boss.mesh.position.y, boss.mesh.position.z, 35, { r: 0.8, g: 0.1, b: 1 }, 14, 1.8);

          // Warp to flank/rear
          boss.orbitAngle += Math.PI * (0.75 + Math.random() * 0.5);
          boss.orbitDir *= -1;
          const newX = Math.max(-this.arenaRadius + 6, Math.min(this.arenaRadius - 6, this.player.position.x + Math.cos(boss.orbitAngle) * boss.orbitRadius));
          const newZ = Math.max(-this.arenaRadius + 6, Math.min(this.arenaRadius - 6, this.player.position.z + Math.sin(boss.orbitAngle) * boss.orbitRadius));
          boss.mesh.position.set(newX, 3.6, newZ);
          this.particles.spawn(newX, 3.6, newZ, 35, { r: 0.8, g: 0.1, b: 1 }, 14, 1.8);
          this.createDangerDecal(boss.mesh.position, 10, 0.6);
          boss.teleportTimer = (boss.phase === 2 ? 3.2 : 4.8);
        }
      } else {
        boss.teleportTimer -= dt;
        if (boss.teleportTimer <= 0 && !boss.deathRayActive) {
          boss.isTeleportCharging = true;
          boss.teleportChargeTime = 0.45;
          audio.playLaserSweep();
        }
      }

      // 3. Volumetric Continuous Sweeping Death Ray
      if (boss.deathRayActive) {
        if (boss.deathRayStage === 'charge') {
          boss.deathRayTime -= dt;
          this.particles.spawn(boss.mesh.position.x, 3.6, boss.mesh.position.z + 4.2, 2, { r: 0.9, g: 0.1, b: 1 }, 8, 0.5);

          if (boss.deathRayTime <= 0) {
            boss.deathRayStage = 'fire';
            boss.deathRayTime = 1.35;
            boss.deathRayStartAngle = boss.deathRayBaseAngle - 0.4;
            boss.deathRayCurrentAngle = boss.deathRayStartAngle;

            const bGeo = new THREE.CylinderGeometry(0.45, 0.55, 1, 8);
            bGeo.rotateX(Math.PI / 2);
            const bMat = new THREE.MeshBasicMaterial({ color: 0xdf22ff, transparent: true, opacity: 0.88 });
            boss.laserBeamMesh = new THREE.Mesh(bGeo, bMat);
            this.scene.add(boss.laserBeamMesh);

            audio.playLaserSweep();
            this.addScreenShake(0.3);
          }
        } else if (boss.deathRayStage === 'fire') {
          boss.deathRayTime -= dt;
          const progress = 1.0 - (boss.deathRayTime / 1.35);
          boss.deathRayCurrentAngle = boss.deathRayStartAngle + progress * 0.8;

          const nosePos = new THREE.Vector3(0, 0, 4.5).applyMatrix4(boss.mesh.matrixWorld);
          const hitPos = new THREE.Vector3(
            nosePos.x + Math.cos(boss.deathRayCurrentAngle) * 38,
            0.1,
            nosePos.z + Math.sin(boss.deathRayCurrentAngle) * 38
          );

          if (boss.laserBeamMesh) {
            const beamLen = nosePos.distanceTo(hitPos);
            boss.laserBeamMesh.scale.set(1, 1, beamLen);
            boss.laserBeamMesh.position.copy(nosePos).lerp(hitPos, 0.5);
            boss.laserBeamMesh.lookAt(hitPos);
          }

          // Sparks at floor impact point
          this.particles.spawn(hitPos.x, 0.2, hitPos.z, 3, { r: 0.9, g: 0.2, b: 1 }, 8, 0.6);

          boss.deathRayTick -= dt;
          if (boss.deathRayTick <= 0) {
            boss.deathRayTick = 0.14;
            audio.playLaserSizzle();
          }

          // Player beam segment collision
          const seg = hitPos.clone().sub(nosePos);
          const l2 = seg.lengthSq();
          let t = 0;
          if (l2 > 0.001) {
            t = Math.max(0, Math.min(1, this.player.position.clone().sub(nosePos).dot(seg) / l2));
          }
          const proj = nosePos.clone().addScaledVector(seg, t);
          const pDist = proj.distanceTo(this.player.position);
          if (pDist < 2.2 && !this.isDashing) {
            this.takeDamage(14);
            this.addScreenShake(0.2);
            this.particles.spawn(this.player.position.x, 1.0, this.player.position.z, 6, { r: 1, g: 0.1, b: 0.8 });
          }

          if (boss.deathRayTime <= 0) {
            if (boss.laserBeamMesh) {
              this.scene.remove(boss.laserBeamMesh);
              boss.laserBeamMesh = null;
            }
            boss.deathRayActive = false;
            boss.deathRayStage = 'idle';
            boss.deathRayTimer = (boss.phase === 2 ? 3.0 : 4.5);
          }
        }
      } else {
        boss.deathRayTimer -= dt;
        if (boss.deathRayTimer <= 0 && !boss.isTeleportCharging) {
          this.triggerViperDeathRay();
        }
      }

      // 4. Seeker Missiles & Plasma Fan
      boss.seekerTimer -= dt;
      if (boss.seekerTimer <= 0) {
        boss.seekerTimer = (boss.phase === 2 ? 4.5 : 6.0);
        this.spawnViperSeekers();
      }

      boss.fanTimer -= dt;
      if (boss.fanTimer <= 0) {
        boss.fanTimer = (boss.phase === 2 ? 1.4 : 2.0);
        this.fireViperFan();
      }

    // ---------------- TIER 3: OMEGA OVERLORD (Wave 15+) ----------------
    } else if (boss.tier === 'OMEGA') {
      // 1. Spiked Celestial Gyro Rings independent rotation
      boss.ring1.rotation.x += 1.8 * dt;
      boss.ring2.rotation.y += 2.2 * dt;
      boss.ring3.rotation.z += 2.6 * dt;

      // 2. Orbiting Dark Matter Crystal Shards
      boss.shards.forEach(s => {
        s.angle += (s.orbitSpeed + (boss.phase === 2 ? 0.7 : 0)) * dt;
        const sx = Math.cos(s.angle) * s.orbitRadius;
        const sz = Math.sin(s.angle) * s.orbitRadius;
        const sy = Math.sin(s.angle * 2 + s.tilt) * 2.2;
        s.mesh.position.set(sx, 4.4 + sy, sz);
        s.mesh.rotation.x += 2.0 * dt;
        s.mesh.rotation.y += 1.5 * dt;
      });

      if (hpRatio <= 0.45 && boss.phase === 1) {
        boss.phase = 2;
        boss.speed = 8.5;
        this.bossPhase.textContent = 'PHASE 2: EVENT HORIZON COLLAPSE';
        this.bossPhase.style.background = '#ff0055';
        this.bossHud.classList.add('enraged');
        audio.playBossAlarm();
        audio.speakAnnouncement('SINGULARITY COLLAPSE. ZERO ESCAPE.');
        audio.setBgmTempo(true);
        this.addScreenShake(0.8);
        for (let i = 0; i < 3; i++) this.spawnDrone();
      }

      // Ominous slow hover towards center
      const targetCenter = new THREE.Vector3(0, 4.2 + Math.sin(boss.bobOffset) * 0.4, 0);
      boss.mesh.position.lerp(targetCenter, dt * 0.6);
      boss.mesh.lookAt(this.player.position.x, boss.mesh.position.y, this.player.position.z);

      // 3. Continuous Quad Orbital Laser Wheel (Bullet Hell!)
      if (boss.isLaserWheelActive) {
        boss.laserWheelDuration -= dt;
        boss.crossAngle += (boss.phase === 2 ? 1.5 : 1.0) * dt;

        if (boss.crossBeamGroup) {
          boss.crossBeamGroup.position.copy(boss.mesh.position);
          boss.crossBeamGroup.position.y = 1.6;
          boss.crossBeamGroup.rotation.y = boss.crossAngle;
        }

        boss.laserWheelTick -= dt;
        if (boss.laserWheelTick <= 0) {
          boss.laserWheelTick = 0.16;
          audio.playLaserSizzle();
        }

        // Tick down laser hit invulnerability cooldown
        if (boss.laserHitCooldown === undefined) boss.laserHitCooldown = 0;
        if (boss.laserHitCooldown > 0) boss.laserHitCooldown -= dt;

        // Collision detection for each of the 4 rotating continuous beams
        for (let i = 0; i < 4; i++) {
          const a = boss.crossAngle + (i * Math.PI / 2);
          const bDir = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
          const bStart = boss.mesh.position.clone();
          bStart.y = 1.6;

          const toPlayer = this.player.position.clone().sub(bStart);
          const projLen = Math.max(0, Math.min(44, toPlayer.dot(bDir)));
          const closestPt = bStart.clone().addScaledVector(bDir, projLen);
          closestPt.y = this.player.position.y;

          if (closestPt.distanceTo(this.player.position) < 2.0 && !this.isDashing) {
            if (boss.laserHitCooldown <= 0) {
              boss.laserHitCooldown = 0.55; // Fair 0.55s damage tick cooldown prevents instant melting
              this.takeDamage(18); // Fair 18 damage instead of 1-hit kill
              this.addScreenShake(0.35);
              this.particles.spawn(this.player.position.x, 1.0, this.player.position.z, 14, { r: 1, g: 0.1, b: 0.1 }, 10, 1.2);

              // Knockback: push player away from the laser beam
              const pushDir = this.player.position.clone().sub(closestPt);
              if (pushDir.lengthSq() < 0.001) {
                pushDir.copy(this.player.position).sub(boss.mesh.position);
              }
              pushDir.y = 0;
              pushDir.normalize();
              this.player.position.addScaledVector(pushDir, 2.6);
              const pDist = Math.hypot(this.player.position.x, this.player.position.z);
              if (pDist > 46) {
                this.player.position.multiplyScalar(46 / pDist);
              }
            }
          }

          // Scorch sparks
          const sx = boss.mesh.position.x + Math.cos(a) * 32;
          const sz = boss.mesh.position.z + Math.sin(a) * 32;
          this.particles.spawn(sx, 0.2, sz, 2, { r: 1, g: 0.2, b: 0 }, 6, 0.5);
        }

        if (boss.laserWheelDuration <= 0) {
          if (boss.crossBeamGroup) {
            this.scene.remove(boss.crossBeamGroup);
            boss.crossBeamGroup = null;
          }
          boss.isLaserWheelActive = false;
          boss.laserWheelTimer = (boss.phase === 2 ? 4.8 : 7.0);
        }
      } else if (boss.isLaserWheelCharging) {
        boss.laserWheelChargeTime -= dt;
        this.particles.spawn(boss.mesh.position.x, 4.4, boss.mesh.position.z, 3, { r: 1, g: 0, b: 0.2 }, 8, 0.6);

        if (boss.laserWheelChargeTime <= 0) {
          boss.isLaserWheelCharging = false;
          boss.isLaserWheelActive = true;
          boss.laserWheelDuration = 6.4;
          audio.playBossAlarm();
          this.addScreenShake(0.4);

          const group = new THREE.Group();
          for (let i = 0; i < 4; i++) {
            const bGeo = new THREE.CylinderGeometry(0.42, 0.42, 44, 8);
            bGeo.rotateZ(Math.PI / 2);
            bGeo.translate(22, 0, 0);
            const bMat = new THREE.MeshBasicMaterial({ color: 0xff002b, transparent: true, opacity: 0.88 });
            const beam = new THREE.Mesh(bGeo, bMat);
            beam.rotation.y = i * Math.PI / 2;
            group.add(beam);
          }
          group.position.copy(boss.mesh.position);
          group.position.y = 1.6;
          this.scene.add(group);
          boss.crossBeamGroup = group;
        }
      } else {
        boss.laserWheelTimer -= dt;
        if (boss.laserWheelTimer <= 0) {
          boss.isLaserWheelCharging = true;
          boss.laserWheelChargeTime = 0.85;
          audio.playLaserSweep();
          for (let i = 0; i < 4; i++) {
            const a = boss.crossAngle + (i * Math.PI / 2);
            const end = boss.mesh.position.clone().add(new THREE.Vector3(Math.cos(a) * 44, 0, Math.sin(a) * 44));
            this.createDangerDecal(boss.mesh.position, 0, 0.85, true, end);
          }
        }
      }

      // 4. Gravitational Vortex
      boss.vortexTimer -= dt;
      if (boss.vortexTimer <= 0) {
        boss.vortexTimer = (boss.phase === 2 ? 6.5 : 9.0);
        this.triggerGravitationalVortex();
      }

      // 5. Orbital Strike Mortars
      boss.mortarTimer -= dt;
      if (boss.mortarTimer <= 0) {
        boss.mortarTimer = (boss.phase === 2 ? 2.6 : 3.8);
        this.triggerOmegaMortars();
      }
    }

    const pct = Math.max(0, Math.round(hpRatio * 100));
    this.bossHpBar.style.width = `${pct}%`;
    this.bossHpText.textContent = `${pct}% [${Math.max(0, Math.round(boss.hp))} / ${boss.maxHp}]`;
  }

  teleportViper() {
    if (!this.activeBoss) return;
    const boss = this.activeBoss;
    boss.isTeleportCharging = true;
    boss.teleportChargeTime = 0.45;
    audio.playLaserSweep();
  }

  triggerViperDeathRay() {
    if (!this.activeBoss) return;
    const boss = this.activeBoss;
    boss.deathRayActive = true;
    boss.deathRayStage = 'charge';
    boss.deathRayTime = 0.75;

    const toP = this.player.position.clone().sub(boss.mesh.position);
    toP.y = 0;
    boss.deathRayBaseAngle = Math.atan2(toP.z, toP.x);
    const aimPos = boss.mesh.position.clone().add(toP.normalize().multiplyScalar(40));
    this.createDangerDecal(boss.mesh.position, 0, 0.75, true, aimPos);
    audio.playLaserSweep();
  }

  spawnViperSeekers() {
    if (!this.activeBoss) return;
    const center = this.activeBoss.mesh.position.clone();
    audio.playEnemyShoot();

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const geom = new THREE.SphereGeometry(0.65, 8, 8);
      const mat = new THREE.MeshBasicMaterial({ color: 0xb026ff });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(center.x + Math.cos(angle) * 3.2, 3.0, center.z + Math.sin(angle) * 3.2);
      this.scene.add(mesh);

      this.drones.push({
        type: 'SEEKER',
        mesh,
        hp: 24,
        maxHp: 24,
        speed: 9.5,
        radius: 0.65,
        bobOffset: Math.random() * Math.PI * 2,
        stunTimer: 0
      });
    }
  }

  fireViperFan() {
    if (!this.activeBoss) return;
    const origin = this.activeBoss.mesh.position.clone();
    origin.y = 3.2;
    audio.playEnemyShoot();

    const forward = this.player.position.clone().sub(origin).normalize();
    const baseAngle = Math.atan2(forward.z, forward.x);
    const count = (this.activeBoss.phase === 2 ? 7 : 5);
    const spread = (this.activeBoss.phase === 2 ? [-0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45] : [-0.35, -0.18, 0, 0.18, 0.35]);

    spread.forEach(offset => {
      const ang = baseAngle + offset;
      const dir = new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang));

      const boltGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.8, 6);
      boltGeo.rotateX(Math.PI / 2);
      const boltMat = new THREE.MeshBasicMaterial({ color: 0xff00aa });
      const bolt = new THREE.Mesh(boltGeo, boltMat);
      bolt.position.copy(origin);
      bolt.lookAt(origin.clone().add(dir));
      this.scene.add(bolt);

      this.enemyProjectiles.push({
        mesh: bolt,
        dir: dir,
        speed: 28,
        life: 0,
        maxLife: 3.5,
        damage: 18
      });
    });
  }

  triggerGravitationalVortex() {
    audio.playSingularityHum();
    this.addScreenShake(0.6);

    const vortexGrp = new THREE.Group();
    // Outer accretion ring
    const outerGeo = new THREE.RingGeometry(2.5, 18.0, 48);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x660018,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    outerMesh.rotation.x = -Math.PI / 2;
    vortexGrp.add(outerMesh);

    // Inner event horizon ring
    const innerGeo = new THREE.RingGeometry(0.8, 3.2, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xff002b,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMesh.rotation.x = -Math.PI / 2;
    vortexGrp.add(innerMesh);

    vortexGrp.position.set(0, 0.08, 0);
    this.scene.add(vortexGrp);

    this.vortexSingularity = {
      mesh: vortexGrp,
      outer: outerMesh,
      inner: innerMesh,
      duration: 6.0,
      life: 0,
      damageTimer: 0
    };
  }

  updateVortexSingularity(dt) {
    if (!this.vortexSingularity) return;
    const v = this.vortexSingularity;
    v.life += dt;
    v.outer.rotation.z += 2.5 * dt;
    v.inner.rotation.z -= 4.0 * dt;

    // Emit inward spiraling dark matter particles
    for (let i = 0; i < 3; i++) {
      const pAngle = Math.random() * Math.PI * 2;
      const pRad = 4.0 + Math.random() * 14.0;
      const px = Math.cos(pAngle) * pRad;
      const pz = Math.sin(pAngle) * pRad;
      this.particles.spawn(px, 0.3, pz, 1, { r: 1, g: 0.05, b: 0.15 }, -6, 0.6);
    }

    const toCenter = new THREE.Vector3(0, 0, 0).sub(this.player.position);
    const dist = toCenter.length();
    toCenter.normalize();

    // Pull player
    if (dist > 1.0) {
      this.player.position.addScaledVector(toCenter, 9.5 * dt);
    }

    // Event horizon damage if sucked inside core
    if (dist < 3.2 && !this.isDashing) {
      v.damageTimer -= dt;
      if (v.damageTimer <= 0) {
        v.damageTimer = 0.28;
        this.takeDamage(16);
        audio.playDamage();
        this.addScreenShake(0.35);
      }
    }

    // Pull energy cores
    this.energyCores.forEach(c => {
      const cPull = new THREE.Vector3(0, 0, 0).sub(c.mesh.position).normalize();
      c.mesh.position.addScaledVector(cPull, 14.0 * dt);
    });

    if (v.life >= v.duration) {
      this.scene.remove(v.mesh);
      this.vortexSingularity = null;
    }
  }

  triggerOmegaMortars() {
    for (let i = 0; i < 4; i++) {
      const rx = (Math.random() * 2 - 1) * (this.arenaRadius - 15);
      const rz = (Math.random() * 2 - 1) * (this.arenaRadius - 15);
      const targetPos = new THREE.Vector3(rx, 0, rz);

      this.createDangerDecal(targetPos, 7.5, 1.1);

      setTimeout(() => {
        audio.playExplosion(true);
        audio.playLaserSweep();
        this.addScreenShake(0.4);

        // Vertical sky-to-ground plasma pillar
        const pillarGeo = new THREE.CylinderGeometry(1.6, 1.6, 40, 10);
        const pillarMat = new THREE.MeshBasicMaterial({ color: 0xff0033, transparent: true, opacity: 0.9 });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(rx, 20, rz);
        this.scene.add(pillar);

        setTimeout(() => this.scene.remove(pillar), 220);

        this.particles.spawn(rx, 1.0, rz, 40, { r: 1, g: 0.1, b: 0.1 }, 16, 2.0);

        const pDist = Math.hypot(this.player.position.x - rx, this.player.position.z - rz);
        if (pDist < 7.5 && !this.isDashing) {
          this.takeDamage(35);
        }
      }, 1100);
    }
  }

  fireBossBurst() {
    if (!this.activeBoss) return;
    const boss = this.activeBoss;
    audio.playEnemyShoot();

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
    this.addScreenShake(0.45);

    this.particles.spawn(pos.x, 1.0, pos.z, 35, { r: 1, g: 0.2, b: 0.1 }, 12, 1.8);

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

    // Trigger Cinematic Slow-Mo Bullet Time
    this.slowMoTimer = 0.55;

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        audio.playExplosion(true);
        this.addScreenShake(0.55);
        this.particles.spawn(
          bPos.x + (Math.random() * 6 - 3),
          bPos.y + (Math.random() * 6 - 3),
          bPos.z + (Math.random() * 6 - 3),
          55,
          { r: 1, g: 0.5, b: 0 },
          16,
          2.2
        );
      }, i * 140);
    }

    // Drop Golden Overcharge Core
    this.spawnOverchargeCore(bPos.x, bPos.z);

    // Standard 6 energy cores
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      this.spawnEnergyCore(bPos.x + Math.cos(angle) * 4.5, bPos.z + Math.sin(angle) * 4.5);
    }

    this.score += Math.round(5000 * this.comboMultiplier);
    this.killsTotal++;
    this.bossHud.classList.remove('active');
    this.bossWarningOverlay.classList.remove('pulsing');
    if (this.bossOffscreenPointer) this.bossOffscreenPointer.classList.remove('active');

    if (this.vortexSingularity) {
      this.scene.remove(this.vortexSingularity.mesh);
      this.vortexSingularity = null;
    }

    this.showStreakAnnouncement('BOSS PURGED!');
    audio.setBgmTempo(false);
    if (this.bossVulnIndicator) this.bossVulnIndicator.classList.remove('active');

    if (this.activeBoss) {
      if (this.activeBoss.laserBeamMesh) {
        this.scene.remove(this.activeBoss.laserBeamMesh);
        this.activeBoss.laserBeamMesh = null;
      }
      if (this.activeBoss.crossBeamGroup) {
        this.scene.remove(this.activeBoss.crossBeamGroup);
        this.activeBoss.crossBeamGroup = null;
      }
      this.scene.remove(this.activeBoss.mesh);
      this.activeBoss = null;
    }
  }

  openAugmentModal() {
    this.state = 'AUGMENT';
    const modal = document.getElementById('augment-screen');
    const grid = document.getElementById('augment-cards-grid');
    const subtitle = document.getElementById('augment-modal-subtitle');

    let tierKey = 'WAVE_5';
    let tierName = 'TIER 1 // PLASMA INDUCTION PROTOCOLS';
    if (this.wave >= 15) {
      tierKey = 'WAVE_15';
      tierName = 'TIER 3 // SINGULARITY & CHRONO APEX';
    } else if (this.wave >= 10) {
      tierKey = 'WAVE_10';
      tierName = 'TIER 2 // VELOCITY & DEMOLITION MASTERY';
    }

    if (subtitle) subtitle.textContent = `// ${tierName} (WAVE ${this.wave}) //`;

    const pool = AUGMENT_CHIP_POOLS[tierKey] || AUGMENT_CHIP_POOLS['WAVE_5'];

    if (grid) {
      grid.innerHTML = '';
      pool.forEach(chip => {
        const card = document.createElement('div');
        card.className = `augment-card aug-${chip.id.toLowerCase()}`;
        card.dataset.augment = chip.id;
        card.innerHTML = `
          <div class="aug-tier-tag">${chip.tag}</div>
          <div class="aug-icon">${chip.icon}</div>
          <div class="aug-title">${chip.title}</div>
          <div class="aug-desc">${chip.desc}</div>
          <div class="aug-passive-detail">PASSIVE: <span>${chip.passiveNote}</span></div>
          <button type="button" class="action-btn select-aug-btn">INSTALL CHIP</button>
        `;
        const pick = () => this.selectAugment(chip.id);
        card.addEventListener('click', pick);
        const btn = card.querySelector('.select-aug-btn');
        if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); pick(); });
        grid.appendChild(card);
      });
    }

    if (modal) modal.classList.add('active');
    audio.playPowerup();
  }

  selectAugment(augKey) {
    if (!augKey) return;
    this.activeAugments.add(augKey);

    if (augKey === 'OVERDRIVE') {
      this.dashMaxCooldown = 1.1;
    }

    const modal = document.getElementById('augment-screen');
    if (modal) modal.classList.remove('active');

    audio.playPowerup();
    // Confetti on chip selection removed per user request (preserved for victory game over only)
    this.showStreakAnnouncement('CHIP INSTALLED: ' + augKey);
    this.state = 'PLAYING';
    this.updateHUD();
    if (this.clock) this.clock.getDelta();
  }

  spawnSingularity(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 1.2, z);

    const ringGeo = new THREE.TorusGeometry(1.6, 0.18, 12, 32);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd946ef, transparent: true, opacity: 0.85 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    group.add(ring);

    const coreGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x220033 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    this.scene.add(group);
    this.singularities.push({
      mesh: group,
      ring: ring,
      x: x,
      z: z,
      life: 1.8,
      maxLife: 1.8,
      radius: 18
    });
    audio.playShock();
    this.particles.spawn(x, 1.2, z, 18, { r: 0.85, g: 0.2, b: 1 }, 12, 1.2);
  }

  spawnFlamePatch(x, z) {
    this.groundHazards.push({
      x: x,
      z: z,
      life: 2.2,
      radius: 2.6
    });
    this.particles.spawn(x, 0.2, z, 6, { r: 1, g: 0.4, b: 0 }, 5, 0.8);
  }

  fireNeonConfetti(type = 'victory') {
    if (typeof confetti !== 'function') return;
    if (type === 'victory') {
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#ffd700', '#00f3ff', '#ff0055', '#00ff66']
      });
    }
  }

  spawnOverchargeCore(x, z) {
    const geom = new THREE.DodecahedronGeometry(1.1, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffe600,
      emissive: 0xffaa00,
      roughness: 0.1,
      metalness: 0.95
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(x, 1.4, z);

    const haloGeo = new THREE.TorusGeometry(1.5, 0.1, 8, 24);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    mesh.add(halo);

    this.scene.add(mesh);
    this.energyCores.push({
      mesh,
      life: 25.0,
      bobPhase: 0,
      isOvercharge: true
    });
  }

  /* ---------------- Player Combat & Shooting ---------------- */
  firePlayerCannon() {
    if (this.shootCooldown > 0) return;

    // Gatling Cascade Accumulation
    if (this.activeAugments.has('CASCADE')) {
      this.cascadeStacks = Math.min(8, (this.cascadeStacks || 0) + 1);
      this.cascadeDecayTimer = 1.2;
    }
    const rofMultiplier = this.activeAugments.has('CASCADE') ? Math.max(0.42, 1.0 - (this.cascadeStacks * 0.075)) : 1.0;
    this.shootCooldown = this.shootFireRate * rofMultiplier;

    // Gravity Singularity 4th-shot charging
    let isSingularityShot = false;
    if (this.activeAugments.has('VORTEX')) {
      this.vortexShotCount = ((this.vortexShotCount || 0) + 1) % 4;
      if (this.vortexShotCount === 0) {
        isSingularityShot = true;
      }
    }

    const isOvercharge = (this.overchargeTimer > 0);
    audio.playShoot(isOvercharge);

    const cannon = (this.cannonSide === 1) ? this.leftCannon : this.rightCannon;
    this.cannonSide *= -1;

    const origin = new THREE.Vector3();
    cannon.getWorldPosition(origin);

    const target = this.mouseWorld.clone();
    target.y = origin.y;
    const baseDir = target.sub(origin).normalize();

    const isCrit = Math.random() < 0.22;
    const cascadeBonusDmg = (this.activeAugments.has('CASCADE') ? this.cascadeStacks * 4 : 0);
    const dmg = (isCrit ? 56 : 28) + cascadeBonusDmg;

    const dirs = [baseDir];
    if (isOvercharge) {
      const baseAng = Math.atan2(baseDir.z, baseDir.x);
      const dirLeft = new THREE.Vector3(Math.cos(baseAng - 0.18), 0, Math.sin(baseAng - 0.18));
      const dirRight = new THREE.Vector3(Math.cos(baseAng + 0.18), 0, Math.sin(baseAng + 0.18));
      dirs.push(dirLeft, dirRight);
    }

    const pal = MECHA_PALETTES[this.currentPalette] || MECHA_PALETTES['CYAN'];

    dirs.forEach(dir => {
      const cascadeScale = 1.0 + (this.activeAugments.has('CASCADE') ? this.cascadeStacks * 0.12 : 0);
      const boltRadius = (isSingularityShot ? 0.35 : (0.1 * cascadeScale));
      const boltLength = (isSingularityShot ? 1.8 : (1.3 * cascadeScale));
      const boltGeo = new THREE.CylinderGeometry(boltRadius, boltRadius, boltLength, 8);
      boltGeo.rotateX(Math.PI / 2);

      let boltColor = pal.hex;
      if (isSingularityShot) {
        boltColor = 0xd946ef;
      } else if (isOvercharge) {
        boltColor = 0xffe600;
      } else if (this.activeAugments.has('CASCADE') && this.cascadeStacks >= 5) {
        boltColor = 0xff5a00;
      }

      const boltMat = new THREE.MeshBasicMaterial({ color: boltColor });
      const bolt = new THREE.Mesh(boltGeo, boltMat);

      bolt.position.copy(origin);
      bolt.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
      this.scene.add(bolt);

      this.shotsFired++;

      this.projectiles.push({
        mesh: bolt,
        dir: dir,
        speed: isSingularityShot ? 52 : 62,
        life: 0,
        maxLife: 1.6,
        damage: isSingularityShot ? 75 : dmg,
        isCrit: isCrit,
        bounces: 0,
        isVortexBullet: isSingularityShot
      });
    });

    const sparkColor = isSingularityShot ? { r: 0.85, g: 0.2, b: 1 } : (isOvercharge ? { r: 1, g: 0.9, b: 0 } : pal.accentRgb);
    this.particles.spawn(origin.x, origin.y, origin.z, 6, sparkColor, 8, 0.8);
  }

  /* ---------------- Holographic Dash After-Images (Ghost Echo) ---------------- */
  spawnDashGhost() {
    const pal = MECHA_PALETTES[this.currentPalette] || MECHA_PALETTES['CYAN'];
    const ghostGroup = new THREE.Group();
    ghostGroup.position.copy(this.player.position);
    ghostGroup.quaternion.copy(this.player.quaternion);

    // Glowing palette additive holographic materials
    const ghostFillMat = new THREE.MeshBasicMaterial({
      color: pal.hex,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    const ghostWireMat = new THREE.MeshBasicMaterial({
      color: pal.hex,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    // 1. Core Dodecahedron (Solid & Wireframe overlay)
    const coreGeo = new THREE.DodecahedronGeometry(1.2, 1);
    const coreMesh = new THREE.Mesh(coreGeo, ghostFillMat);
    coreMesh.position.y = 1.35;
    ghostGroup.add(coreMesh);
    const wireMesh = new THREE.Mesh(coreGeo, ghostWireMat);
    wireMesh.position.y = 1.35;
    ghostGroup.add(wireMesh);

    // 2. Visor
    const visorGeo = new THREE.BoxGeometry(0.85, 0.22, 1.15);
    const visorMesh = new THREE.Mesh(visorGeo, ghostFillMat);
    visorMesh.position.set(0, 1.45, 0.4);
    ghostGroup.add(visorMesh);

    // 3. Outer Armor Ring
    const ringGeo = new THREE.TorusGeometry(1.5, 0.12, 8, 24);
    const ringMesh = new THREE.Mesh(ringGeo, ghostFillMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 1.35;
    ghostGroup.add(ringMesh);

    // 4. Dual Cannons
    const cannonGeo = new THREE.CylinderGeometry(0.14, 0.18, 1.4, 8);
    cannonGeo.rotateX(Math.PI / 2);
    const leftCannon = new THREE.Mesh(cannonGeo, ghostFillMat);
    leftCannon.position.set(-1.3, 1.25, 0.5);
    ghostGroup.add(leftCannon);
    const rightCannon = new THREE.Mesh(cannonGeo, ghostFillMat);
    rightCannon.position.set(1.3, 1.25, 0.5);
    ghostGroup.add(rightCannon);

    this.scene.add(ghostGroup);

    let life = 0;
    const maxLife = 0.32;
    const fadeInterval = setInterval(() => {
      life += 0.035;
      const progress = life / maxLife;
      const currentOpacity = Math.max(0, (1 - progress) * 0.45);
      ghostFillMat.opacity = currentOpacity;
      ghostWireMat.opacity = currentOpacity * 1.3;
      ghostGroup.scale.multiplyScalar(1.0 + 0.018);

      if (progress >= 1) {
        clearInterval(fadeInterval);
        this.scene.remove(ghostGroup);
      }
    }, 35);
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

    // Holographic Cyber Clones along dash path
    this.spawnDashGhost();
    setTimeout(() => this.spawnDashGhost(), 55);
    setTimeout(() => this.spawnDashGhost(), 110);
    if (this.activeAugments.has('OVERDRIVE')) {
      setTimeout(() => this.spawnDashGhost(), 165);
    }

    // Nitro Afterburner flame trail
    if (this.activeAugments.has('ADRENALINE')) {
      this.spawnFlamePatch(this.player.position.x, this.player.position.z);
      setTimeout(() => this.spawnFlamePatch(this.player.position.x, this.player.position.z), 70);
      setTimeout(() => this.spawnFlamePatch(this.player.position.x, this.player.position.z), 140);
    }

    this.particles.spawn(
      this.player.position.x,
      this.player.position.y + 0.5,
      this.player.position.z,
      25,
      this.activeAugments.has('ADRENALINE') ? { r: 1, g: 0.5, b: 0 } : { r: 0.2, g: 0.8, b: 1 },
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

    this.enemyProjectiles.forEach(p => {
      this.particles.spawn(p.mesh.position.x, p.mesh.position.y, p.mesh.position.z, 8, { r: 1, g: 0.5, b: 0 });
      this.scene.remove(p.mesh);
    });
    this.enemyProjectiles = [];

    const isOverdrive = this.activeAugments.has('OVERDRIVE');
    const canisterRadius = isOverdrive ? 30 : 22;
    const bossRadius = isOverdrive ? 44 : 32;
    const droneRadius = isOverdrive ? 40 : 30;

    // Detonate canisters in radius
    for (let ci = this.canisters.length - 1; ci >= 0; ci--) {
      const can = this.canisters[ci];
      if (Math.hypot(can.x - this.player.position.x, can.z - this.player.position.z) < canisterRadius) {
        this.explodeCanister(ci);
      }
    }

    if (this.activeBoss) {
      const dist = this.activeBoss.mesh.position.distanceTo(this.player.position);
      if (dist < bossRadius) {
        this.activeBoss.hp -= 150;
        this.activeBoss.hitFlash = 0.2;
        this.spawnDamageText(this.activeBoss.mesh.position, 150, true, true);
        this.checkBossCounterStun('EMP');
        if (this.activeBoss.hp <= 0) {
          this.killBoss();
        }
      }
    }

    this.drones.forEach(d => {
      const dist = d.mesh.position.distanceTo(this.player.position);
      if (dist < droneRadius) {
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
      bobPhase: Math.random() * Math.PI * 2,
      isOvercharge: false
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

    // Chronoshift Aegis Emergency Matrix
    if (this.activeAugments.has('CHRONO') && (!this.chronoCooldown || this.chronoCooldown <= 0) && ((this.health - amount) <= 0 || (this.health - amount) / this.maxHealth <= 0.25)) {
      this.chronoCooldown = 45.0;
      this.shield = Math.min(this.maxShield, this.shield + 45);
      this.slowMoTimer = 1.5;
      audio.playChrono();
      this.spawnDamageText(this.player.position, '⏳ CHRONOSHIFT AEGIS ⏳', true, true);
      this.showStreakAnnouncement('CHRONOSHIFT AEGIS ACTIVATED!');
      this.particles.spawn(this.player.position.x, 1.2, this.player.position.z, 28, { r: 1, g: 0.9, b: 0.2 }, 14, 1.6);
      if (this.health - amount <= 0) {
        this.health = Math.max(15, this.health);
        amount = 0;
      }
    }

    if (amount > 0) {
      this.health -= amount;
      if (this.health <= 0) {
        this.health = 0;
        this.gameOver();
      } else if (this.health / this.maxHealth <= 0.25 && (!this.adrenalineCooldown || this.adrenalineCooldown <= 0)) {
        this.triggerAdrenalineSlowMo();
      }
    }
    this.updateHUD();
  }

  triggerAdrenalineSlowMo() {
    this.slowMoTimer = 1.2;
    this.adrenalineCooldown = 28.0;
    audio.playHeartbeat();
    this.damageOverlay.classList.add('adrenaline');
    setTimeout(() => {
      if (this.damageOverlay) this.damageOverlay.classList.remove('adrenaline');
    }, 1300);
    this.spawnDamageText(this.player.position, '⚡ ADRENALINE SURGE ⚡', true, true);
    this.showStreakAnnouncement('ADRENALINE SURGE!');
    this.addScreenShake(0.45);
  }

  addScreenShake(intensity) {
    this.shakeIntensity = Math.min(this.shakeIntensity + intensity, 1.2);
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
      bobOffset: Math.random() * Math.PI * 2,
      stunTimer: 0
    });
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

    // Multi-Kill Streak Trigger
    this.recentKills++;
    this.killStreakTimer = 1.6;
    if (this.recentKills === 2) {
      this.showStreakAnnouncement('DOUBLE PURGE!');
    } else if (this.recentKills === 4) {
      this.showStreakAnnouncement('TRIPLE OVERKILL!');
    } else if (this.recentKills === 7) {
      this.showStreakAnnouncement('MASS EXTINCTION!');
    } else if (this.recentKills >= 10 && this.recentKills % 3 === 1) {
      this.showStreakAnnouncement('GODLIKE OVERDRIVE!');
    }

    // Plasma Shrapnel Splinter Cluster
    if (this.activeAugments.has('SPLINTER')) {
      const origin = d.mesh.position.clone();
      origin.y = 1.2;
      for (let s = 0; s < 4; s++) {
        const ang = (s * Math.PI / 2) + (Math.random() * 0.5 - 0.25);
        let sDir = new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang));

        // Attempt to home towards nearest drone or boss
        let targetPos = null;
        let minDist = 36;
        for (let oi = 0; oi < this.drones.length; oi++) {
          if (oi !== index) {
            const dst = origin.distanceTo(this.drones[oi].mesh.position);
            if (dst < minDist) {
              minDist = dst;
              targetPos = this.drones[oi].mesh.position;
            }
          }
        }
        if (!targetPos && this.activeBoss) {
          const bDst = origin.distanceTo(this.activeBoss.mesh.position);
          if (bDst < minDist) targetPos = this.activeBoss.mesh.position;
        }
        if (targetPos) {
          sDir = targetPos.clone().sub(origin).normalize();
          sDir.y = 0;
        }

        const needleGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.1, 6);
        needleGeo.rotateX(Math.PI / 2);
        const needleMat = new THREE.MeshBasicMaterial({ color: 0xd946ef });
        const needle = new THREE.Mesh(needleGeo, needleMat);
        needle.position.copy(origin);
        needle.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), sDir);
        this.scene.add(needle);

        this.projectiles.push({
          mesh: needle,
          dir: sDir,
          speed: 68,
          life: 0,
          maxLife: 1.2,
          damage: 34,
          isCrit: false,
          bounces: 0,
          isShrapnel: true
        });
      }
      this.particles.spawn(origin.x, origin.y, origin.z, 12, { r: 0.85, g: 0.2, b: 1 }, 10, 0.8);
    }

    this.empCharge = Math.min(100, this.empCharge + (heavy ? 20 : 8));

    this.scene.remove(d.mesh);
    this.drones.splice(index, 1);
  }

  /* ---------------- Update Loop ---------------- */
  update(rawDt) {
    if (this.state !== 'PLAYING') return;

    if (this.slowMoTimer > 0) {
      this.slowMoTimer -= rawDt;
      this.timeScale = 0.25;
    } else {
      this.timeScale = 1.0;
    }

    const dt = rawDt * this.timeScale;

    // Multi-kill streak countdown
    if (this.killStreakTimer > 0) {
      this.killStreakTimer -= dt;
      if (this.killStreakTimer <= 0) {
        this.recentKills = 0;
      }
    }

    // Overcharge timer
    if (this.overchargeTimer > 0) {
      this.overchargeTimer -= dt;
      if (this.overchargeTimer <= 0) {
        this.overchargeTimer = 0;
        this.overchargeHud.classList.remove('active');
      } else {
        this.ocTimerDisplay.textContent = `${this.overchargeTimer.toFixed(1)}s`;
      }
    }

    if (this.adrenalineCooldown > 0) {
      this.adrenalineCooldown -= rawDt;
    }

    if (this.isBossWave && this.activeBoss) {
      this.bossCombatTimer += dt;
      if (this.bossCombatTimer >= 45 && !this.dropPodSpawned) {
        this.spawnDropPod();
      }
    }

    this.updatePlayer(dt);
    this.updateAiming();
    this.updateProjectiles(dt);
    this.updateAugmentPassives(dt);
    if (this.activeBoss) {
      this.updateBoss(dt);
      this.updateBossShockwaves(dt);
      this.updateBossVulnIndicator();
    } else if (this.bossVulnIndicator) {
      this.bossVulnIndicator.classList.remove('active');
    }
    this.updateOffscreenBossPointer();
    this.updateVortexSingularity(dt);
    this.updateDangerTelegraphs(dt);
    this.updateDropPod(dt);
    this.updateDrones(dt);
    this.updateCores(dt);
    this.updateEmpShockwave(dt);
    this.updateSpawner(dt);
    this.updateCamera(dt);
    this.particles.update(dt);
    this.updateHUD();
  }

  updateAugmentPassives(dt) {
    // 1. Nanite Siphon (VAMPIRIC) decay and shield regeneration
    if (this.vampiricStacks > 0) {
      this.vampiricDecayTimer -= dt;
      if (this.vampiricDecayTimer <= 0) {
        this.vampiricStacks = Math.max(0, this.vampiricStacks - 1);
        this.vampiricDecayTimer = 0.8;
      }
      this.shield = Math.min(this.maxShield, this.shield + (this.vampiricStacks * 1.5) * dt);
      if (Math.random() < 0.2) {
        this.particles.spawn(this.player.position.x, 1.2, this.player.position.z, 2, { r: 0.0, g: 1.0, b: 0.4 }, 3, 0.5);
      }
    }

    // 2. Gatling Cascade decay
    if (this.cascadeStacks > 0) {
      this.cascadeDecayTimer -= dt;
      if (this.cascadeDecayTimer <= 0) {
        this.cascadeStacks = Math.max(0, this.cascadeStacks - 2);
        this.cascadeDecayTimer = 0.35;
      }
    }

    // 3. Chronoshift Aegis cooldown
    if (this.chronoCooldown > 0) {
      this.chronoCooldown -= dt;
    }

    // 4. Tesla Coil (STATIC_ARC) chain lightning
    if (this.activeAugments.has('STATIC_ARC')) {
      this.teslaCooldown -= dt;
      if (this.teslaCooldown <= 0) {
        const targets = [];
        this.drones.forEach((d, di) => {
          const dst = this.player.position.distanceTo(d.mesh.position);
          if (dst < 24) targets.push({ type: 'drone', drone: d, index: di, dist: dst });
        });
        if (this.activeBoss) {
          const bDst = this.player.position.distanceTo(this.activeBoss.mesh.position);
          if (bDst < 24) targets.push({ type: 'boss', boss: this.activeBoss, dist: bDst });
        }

        targets.sort((a, b) => a.dist - b.dist);
        const hitTargets = targets.slice(0, 2);

        if (hitTargets.length > 0) {
          this.teslaCooldown = 1.5;
          audio.playShock();
          hitTargets.forEach(t => {
            let targetPos;
            if (t.type === 'boss') {
              targetPos = t.boss.mesh.position;
              t.boss.hp -= 45;
              t.boss.hitFlash = 0.12;
              this.spawnDamageText(targetPos, '45 TESLA', true, true);
              if (t.boss.hp <= 0) this.killBoss();
            } else {
              targetPos = t.drone.mesh.position;
              t.drone.hp -= 45;
              this.spawnDamageText(targetPos, '45 TESLA', true, false);
              if (t.drone.hp <= 0) this.killDrone(t.index);
            }

            // Draw electric arc sparks along line from player to target
            const steps = 10;
            for (let s = 0; s <= steps; s++) {
              const alpha = s / steps;
              const pX = THREE.MathUtils.lerp(this.player.position.x, targetPos.x, alpha) + (Math.random() - 0.5) * 0.7;
              const pY = THREE.MathUtils.lerp(1.2, targetPos.y, alpha) + (Math.random() - 0.5) * 0.7;
              const pZ = THREE.MathUtils.lerp(this.player.position.z, targetPos.z, alpha) + (Math.random() - 0.5) * 0.7;
              this.particles.spawn(pX, pY, pZ, 2, { r: 0.0, g: 0.95, b: 1.0 }, 4, 0.4);
            }
          });
        }
      }
    }

    // 5. Nitro Flame Hazards (ADRENALINE)
    for (let hi = this.groundHazards.length - 1; hi >= 0; hi--) {
      const h = this.groundHazards[hi];
      h.life -= dt;
      this.particles.spawn(h.x + (Math.random() - 0.5) * 1.5, 0.2, h.z + (Math.random() - 0.5) * 1.5, 1, { r: 1, g: 0.45, b: 0 }, 3, 0.4);

      this.drones.forEach((d, di) => {
        const dst = Math.hypot(d.mesh.position.x - h.x, d.mesh.position.z - h.z);
        if (dst < h.radius) {
          d.hp -= 32 * dt;
          if (d.hp <= 0) this.killDrone(di);
        }
      });
      if (this.activeBoss) {
        const bDst = Math.hypot(this.activeBoss.mesh.position.x - h.x, this.activeBoss.mesh.position.z - h.z);
        if (bDst < h.radius) {
          this.activeBoss.hp -= 38 * dt;
          if (this.activeBoss.hp <= 0) this.killBoss();
        }
      }

      if (h.life <= 0) {
        this.groundHazards.splice(hi, 1);
      }
    }

    // 6. Gravity Singularities (VORTEX)
    for (let si = this.singularities.length - 1; si >= 0; si--) {
      const s = this.singularities[si];
      s.life -= dt;
      if (s.ring) s.ring.rotation.z += 6.0 * dt;

      this.drones.forEach(d => {
        if (d.type !== 'HEAVY') {
          const toCenter = new THREE.Vector3(s.x - d.mesh.position.x, 0, s.z - d.mesh.position.z);
          const dst = toCenter.length();
          if (dst < s.radius && dst > 0.5) {
            toCenter.normalize();
            d.mesh.position.addScaledVector(toCenter, Math.min(24, 280 / (dst + 1)) * dt);
          }
        }
      });

      const swirlAng = Math.random() * Math.PI * 2;
      const swirlDist = 2 + Math.random() * 8;
      this.particles.spawn(s.x + Math.cos(swirlAng) * swirlDist, 1.2, s.z + Math.sin(swirlAng) * swirlDist, 2, { r: 0.85, g: 0.2, b: 1 }, 6, 0.6);

      if (s.life <= 0) {
        audio.playExplosion(true);
        this.addScreenShake(0.4);
        this.particles.spawn(s.x, 1.2, s.z, 36, { r: 0.85, g: 0.2, b: 1 }, 18, 1.6);
        this.spawnDamageText(new THREE.Vector3(s.x, 1.4, s.z), '120 IMPLOSION!', true, true);

        this.drones.forEach((d, di) => {
          const dst = Math.hypot(d.mesh.position.x - s.x, d.mesh.position.z - s.z);
          if (dst < 12) {
            d.hp -= 120;
            if (d.hp <= 0) this.killDrone(di);
          }
        });
        if (this.activeBoss) {
          const bDst = Math.hypot(this.activeBoss.mesh.position.x - s.x, this.activeBoss.mesh.position.z - s.z);
          if (bDst < 14) {
            this.activeBoss.hp -= 120;
            if (this.activeBoss.hp <= 0) this.killBoss();
          }
        }

        if (s.mesh) this.scene.remove(s.mesh);
        this.singularities.splice(si, 1);
      }
    }
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
        const speedBonus = this.activeAugments.has('ADRENALINE') ? 1.20 : 1.0;
        this.velocity.addScaledVector(moveDir, this.playerSpeed * speedBonus * 6.5 * dt);
      }

      this.velocity.multiplyScalar(Math.pow(0.04, dt));
      this.player.position.addScaledVector(this.velocity, dt);
    }

    if (this.dashCooldown > 0) {
      const prevCooldown = this.dashCooldown;
      this.dashCooldown = Math.max(0, this.dashCooldown - dt);
      if (prevCooldown > 0 && this.dashCooldown === 0) {
        audio.playDashReady();
      }
    }
    if (this.shootCooldown > 0) {
      this.shootCooldown = Math.max(0, this.shootCooldown - dt);
    }

    if (this.shieldRechargeDelay > 0) {
      this.shieldRechargeDelay -= dt;
    } else if (this.shield < this.maxShield) {
      this.shield = Math.min(this.maxShield, this.shield + 12 * dt);
    }

    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboMultiplier = 1.0;
        this.currentComboDamage = 0;
      }
    }

    const distFromCenter = Math.hypot(this.player.position.x, this.player.position.z);
    if (distFromCenter > this.arenaRadius - 2.0) {
      const angle = Math.atan2(this.player.position.z, this.player.position.x);
      this.player.position.x = Math.cos(angle) * (this.arenaRadius - 2.0);
      this.player.position.z = Math.sin(angle) * (this.arenaRadius - 2.0);
      this.velocity.multiplyScalar(-0.4);
    }

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
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life += dt;
      p.mesh.position.addScaledVector(p.dir, p.speed * dt);

      let hitSomething = false;

      // Pillars
      for (let pi = 0; pi < this.pillars.length; pi++) {
        const pil = this.pillars[pi];
        if (Math.hypot(p.mesh.position.x - pil.x, p.mesh.position.z - pil.z) < pil.radius + 0.3) {
          if (this.activeAugments.has('RICOCHET') && (p.bounces || 0) < 2) {
            const normal = new THREE.Vector3(p.mesh.position.x - pil.x, 0, p.mesh.position.z - pil.z).normalize();
            p.dir.reflect(normal).normalize();
            p.mesh.position.x = pil.x + normal.x * (pil.radius + 0.45);
            p.mesh.position.z = pil.z + normal.z * (pil.radius + 0.45);
            p.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), p.dir);
            p.bounces = (p.bounces || 0) + 1;
            p.life = 0;
            audio.playHit();
            this.particles.spawn(p.mesh.position.x, p.mesh.position.y, p.mesh.position.z, 8, { r: 0.2, g: 0.9, b: 1 }, 12, 0.9);
            hitSomething = false;
          } else {
            hitSomething = true;
            audio.playHit();
            this.particles.spawn(p.mesh.position.x, p.mesh.position.y, p.mesh.position.z, 6, { r: 0, g: 0.9, b: 1 });
          }
          break;
        }
      }

      // Canisters
      if (!hitSomething) {
        for (let ci = this.canisters.length - 1; ci >= 0; ci--) {
          const can = this.canisters[ci];
          if (Math.hypot(p.mesh.position.x - can.x, p.mesh.position.z - can.z) < can.radius + 0.3) {
            hitSomething = true;
            this.shotsHit++;
            this.explodeCanister(ci);
            break;
          }
        }
      }

      // Drop Pod (shoot to open)
      if (!hitSomething && this.dropPod && this.dropPod.landed) {
        const distToPod = Math.hypot(p.mesh.position.x - this.dropPod.targetX, p.mesh.position.z - this.dropPod.targetZ);
        if (distToPod < 2.2) {
          hitSomething = true;
          this.shotsHit++;
          this.triggerHitmarker();
          this.openDropPod();
        }
      }

      // Boss
      if (!hitSomething && this.activeBoss) {
        const distToBoss = p.mesh.position.distanceTo(this.activeBoss.mesh.position);
        if (distToBoss < 5.0) {
          hitSomething = true;
          this.shotsHit++;
          this.triggerHitmarker();

          let dmg = p.damage;
          if (this.activeBoss.stunTimer > 0) {
            dmg = Math.round(dmg * 2.5);
            this.particles.spawn(p.mesh.position.x, p.mesh.position.y, p.mesh.position.z, 18, { r: 1, g: 0.75, b: 0 }, 14, 1.2);
            this.spawnDamageText(p.mesh.position, `${dmg} CORE CRIT!`, true, true);
          } else {
            this.spawnDamageText(p.mesh.position, dmg, p.isCrit, true);
          }

          this.currentComboDamage = (this.currentComboDamage || 0) + dmg;
          if (this.currentComboDamage > this.maxComboDamage) this.maxComboDamage = this.currentComboDamage;

          // Vampiric Nanite Siphon Stacks & Shield Leech
          if (this.activeAugments.has('VAMPIRIC')) {
            this.vampiricStacks = Math.min(10, (this.vampiricStacks || 0) + 1);
            this.vampiricDecayTimer = 3.8;
            if (Math.random() < 0.25) {
              this.shield = Math.min(this.maxShield, this.shield + 6);
              this.particles.spawn(this.player.position.x, this.player.position.y + 0.8, this.player.position.z, 10, { r: 0.0, g: 1.0, b: 0.4 }, 8, 0.8);
              this.particles.spawn(p.mesh.position.x, p.mesh.position.y, p.mesh.position.z, 8, { r: 0.0, g: 1.0, b: 0.4 }, 10, 0.8);
              this.spawnDamageText(this.player.position, '+6 SHIELD', false, false);
            }
          }
          if (p.isVortexBullet) {
            this.spawnSingularity(p.mesh.position.x, p.mesh.position.z);
          }

          this.activeBoss.hp -= dmg;
          this.activeBoss.hitFlash = 0.12;
          audio.playHit();
          this.particles.spawn(p.mesh.position.x, p.mesh.position.y, p.mesh.position.z, 10, { r: 1, g: 0.3, b: 0 });

          if (this.activeBoss.hp <= 0) {
            this.killBoss();
          }
        }
      }

      // Drones
      if (!hitSomething) {
        for (let di = this.drones.length - 1; di >= 0; di--) {
          const drone = this.drones[di];
          const dist = p.mesh.position.distanceTo(drone.mesh.position);
          if (dist < drone.radius + 0.4) {
            hitSomething = true;
            this.shotsHit++;
            this.triggerHitmarker();

            this.currentComboDamage = (this.currentComboDamage || 0) + p.damage;
            if (this.currentComboDamage > this.maxComboDamage) this.maxComboDamage = this.currentComboDamage;

            // Vampiric Nanite Siphon Stacks & Shield Leech
            if (this.activeAugments.has('VAMPIRIC')) {
              this.vampiricStacks = Math.min(10, (this.vampiricStacks || 0) + 1);
              this.vampiricDecayTimer = 3.8;
              if (Math.random() < 0.25) {
                this.shield = Math.min(this.maxShield, this.shield + 6);
                this.particles.spawn(this.player.position.x, this.player.position.y + 0.8, this.player.position.z, 10, { r: 0.0, g: 1.0, b: 0.4 }, 8, 0.8);
                this.particles.spawn(p.mesh.position.x, p.mesh.position.y, p.mesh.position.z, 8, { r: 0.0, g: 1.0, b: 0.4 }, 10, 0.8);
                this.spawnDamageText(this.player.position, '+6 SHIELD', false, false);
              }
            }
            if (p.isVortexBullet) {
              this.spawnSingularity(p.mesh.position.x, p.mesh.position.z);
            }

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

      // Ricochet off arena boundary
      if (!hitSomething && outOfArena && this.activeAugments.has('RICOCHET') && (p.bounces || 0) < 2) {
        const normal = new THREE.Vector3(-p.mesh.position.x, 0, -p.mesh.position.z).normalize();
        p.dir.reflect(normal).normalize();
        p.mesh.position.addScaledVector(normal, 0.9);
        p.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), p.dir);
        p.bounces = (p.bounces || 0) + 1;
        p.life = 0;
        audio.playHit();
        this.particles.spawn(p.mesh.position.x, p.mesh.position.y, p.mesh.position.z, 10, { r: 0.2, g: 0.8, b: 1 }, 12, 0.9);
        continue;
      }

      if (hitSomething || p.life >= p.maxLife || outOfArena) {
        if (p.isVortexBullet && !hitSomething) {
          this.spawnSingularity(p.mesh.position.x, p.mesh.position.z);
        }
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }

    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const ep = this.enemyProjectiles[i];
      ep.life += dt;
      ep.mesh.position.addScaledVector(ep.dir, ep.speed * dt);

      const distToPlayer = ep.mesh.position.distanceTo(this.player.position);

      // Defensive Parrying Shield (First 0.08s of Dash: this.isDashing && this.dashDuration >= 0.14)
      if (this.isDashing && this.dashDuration >= 0.14 && distToPlayer < 2.8) {
        this.scene.remove(ep.mesh);
        this.enemyProjectiles.splice(i, 1);

        this.parryCount++;
        audio.playParry();
        this.addScreenShake(0.4);
        this.particles.spawn(ep.mesh.position.x, ep.mesh.position.y, ep.mesh.position.z, 22, { r: 0, g: 0.95, b: 1 }, 14, 1.2);
        this.spawnDamageText(ep.mesh.position, '🛡️ PARRY REFLECT! ⚡', true, true);
        this.triggerHitmarker();

        // Spawn reflected supercharged plasma bolt back in dash vector
        this.spawnReflectedProjectile(this.player.position.clone(), this.dashDir.clone());
        continue;
      }

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

  spawnReflectedProjectile(origin, dir) {
    const geo = new THREE.SphereGeometry(0.38, 12, 12);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(origin);
    mesh.position.y = 1.35;

    const light = new THREE.PointLight(0x00ffff, 2.5, 9);
    mesh.add(light);
    this.scene.add(mesh);

    this.projectiles.push({
      mesh,
      dir: dir.clone().normalize(),
      speed: 42.0,
      damage: 90,
      life: 0,
      maxLife: 2.2,
      isCrit: true
    });
  }

  updateDrones(dt) {
    for (let i = 0; i < this.drones.length; i++) {
      const d = this.drones[i];

      if (d.stunTimer > 0) {
        d.stunTimer -= dt;
        d.mesh.position.x += (Math.random() - 0.5) * 0.16;
        d.mesh.position.z += (Math.random() - 0.5) * 0.16;
        if (Math.random() < 0.25) {
          this.particles.spawn(d.mesh.position.x, d.mesh.position.y + 0.8, d.mesh.position.z, 2, { r: 0, g: 0.9, b: 1 }, 3, 0.3);
        }
        continue;
      }

      d.bobOffset += dt * 3.0;

      const toPlayer = this.player.position.clone().sub(d.mesh.position);
      const distToPlayer = toPlayer.length();
      toPlayer.normalize();

      if (d.type === 'CHASER' || d.type === 'SEEKER') {
        d.mesh.position.addScaledVector(toPlayer, d.speed * dt);
        d.mesh.lookAt(this.player.position.x, d.mesh.position.y, this.player.position.z);
        d.mesh.position.y = 1.2 + Math.sin(d.bobOffset) * 0.25;

        if (distToPlayer < d.radius + 1.2) {
          this.takeDamage(d.type === 'SEEKER' ? 24 : 15);
          d.mesh.position.addScaledVector(toPlayer, -2.5);
          if (d.type === 'SEEKER') {
            d.hp = 0;
            this.killDrone(i);
            break;
          }
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
        if (core.isOvercharge) {
          audio.playCorePickup(true);
          this.score += 1500;
          this.overchargeTimer = 12.0;
          this.overchargeHud.classList.add('active');
          this.particles.spawn(core.mesh.position.x, core.mesh.position.y, core.mesh.position.z, 28, { r: 1, g: 0.9, b: 0 }, 10, 1.6);
          this.spawnDamageText(this.player.position, 'OVERCHARGE + AUGMENT READY!', true, true);

          // Open Augment Selection Modal on collecting the yellow core!
          setTimeout(() => {
            if (this.state === 'PLAYING') {
              this.openAugmentModal();
            }
          }, 320);
        } else {
          audio.playCorePickup(false);
          this.score += 250;
          this.coresTotal++;
          this.health = Math.min(this.maxHealth, this.health + 12);
          this.empCharge = Math.min(100, this.empCharge + 15);
          this.particles.spawn(core.mesh.position.x, core.mesh.position.y, core.mesh.position.z, 16, { r: 0, g: 1, b: 0.5 }, 6, 1.2);
        }

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
    const maxEmpRadius = this.activeAugments.has('OVERDRIVE') ? 44 : 32;
    this.empRadius += 40 * dt;
    this.empMesh.scale.set(this.empRadius, this.empRadius, 1);
    this.empMesh.position.x = this.player.position.x;
    this.empMesh.position.z = this.player.position.z;
    this.empMesh.material.opacity = Math.max(0, 1.0 - (this.empRadius / maxEmpRadius));

    if (this.empRadius >= maxEmpRadius) {
      this.empExpanding = false;
      this.empMesh.material.opacity = 0;
    }
  }

  /* ---------------- Orbital Supply Drop Pod ---------------- */
  spawnDropPod() {
    if (this.dropPod) return;
    this.dropPodSpawned = true;
    audio.speakAnnouncement('ORBITAL SUPPLY POD DEPLOYED. RETRIEVE PAYLOAD.');
    this.showStreakAnnouncement('SUPPLY POD INCOMING!');
    audio.playBossAlarm();

    const angle = Math.random() * Math.PI * 2;
    const podDist = 9 + Math.random() * 8;
    const px = Math.max(-this.arenaRadius + 12, Math.min(this.arenaRadius - 12, this.player.position.x + Math.cos(angle) * podDist));
    const pz = Math.max(-this.arenaRadius + 12, Math.min(this.arenaRadius - 12, this.player.position.z + Math.sin(angle) * podDist));

    // Targeted Ground Landing Beacon
    const beaconGeo = new THREE.RingGeometry(1.8, 2.4, 32);
    beaconGeo.rotateX(-Math.PI / 2);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(px, 0.05, pz);
    this.scene.add(beacon);

    // Drop Pod 3D Capsule Model
    const podGroup = new THREE.Group();
    const podHull = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.6, 3.2, 6),
      new THREE.MeshStandardMaterial({ color: 0x162035, metalness: 0.9, roughness: 0.2 })
    );
    podHull.position.y = 1.6;
    podHull.castShadow = true;
    podGroup.add(podHull);

    const capGeo = new THREE.ConeGeometry(1.2, 1.0, 6);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00aa88, emissiveIntensity: 0.8 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 3.7;
    podGroup.add(cap);

    const thrusterLight = new THREE.PointLight(0x00ffcc, 2.5, 14);
    thrusterLight.position.y = 0.5;
    podGroup.add(thrusterLight);

    podGroup.position.set(px, 46, pz);
    this.scene.add(podGroup);

    this.dropPod = {
      mesh: podGroup,
      beacon,
      targetX: px,
      targetZ: pz,
      y: 46,
      vy: -38,
      landed: false
    };
  }

  updateDropPod(dt) {
    if (!this.dropPod) return;
    const pod = this.dropPod;
    if (!pod.landed) {
      pod.y += pod.vy * dt;
      pod.mesh.position.y = pod.y;
      if (pod.beacon) pod.beacon.scale.setScalar(1.0 + Math.sin(Date.now() * 0.015) * 0.15);

      if (pod.y <= 0) {
        pod.y = 0;
        pod.mesh.position.y = 0;
        pod.landed = true;
        if (pod.beacon) {
          this.scene.remove(pod.beacon);
          pod.beacon = null;
        }
        this.addScreenShake(0.65);
        audio.playExplosion(true);
        this.particles.spawn(pod.targetX, 1.2, pod.targetZ, 35, { r: 0, g: 1, b: 0.8 }, 16, 2.0);
        this.spawnDamageText(new THREE.Vector3(pod.targetX, 3.5, pod.targetZ), '📦 POD LANDED! [TOUCH TO OPEN]', true, false);
      }
    } else {
      pod.mesh.rotation.y += 0.8 * dt;
      const distToPlayer = Math.hypot(this.player.position.x - pod.targetX, this.player.position.z - pod.targetZ);
      if (distToPlayer < 2.8) {
        this.openDropPod();
      }
    }
  }

  openDropPod() {
    if (!this.dropPod) return;
    const pod = this.dropPod;
    const px = pod.targetX;
    const pz = pod.targetZ;

    if (pod.beacon) this.scene.remove(pod.beacon);
    if (pod.mesh) this.scene.remove(pod.mesh);
    this.dropPod = null;

    // Lifeline Rewards: 100% shield + 50 EMP + 2 fresh EMP canisters
    this.shield = this.maxShield;
    this.empCharge = Math.min(100, this.empCharge + 50);

    [-3.2, 3.2].forEach(offset => {
      const geom = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 12);
      const mat = new THREE.MeshStandardMaterial({ color: 0xff3300, roughness: 0.3, metalness: 0.8 });
      const mesh = new THREE.Mesh(geom, mat);
      const cx = px + offset;
      const cz = pz + (Math.random() * 2 - 1);
      mesh.position.set(cx, 1.25, cz);
      mesh.castShadow = true;
      const band = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 0.6, 12), new THREE.MeshBasicMaterial({ color: 0xffe600 }));
      band.position.y = 0.2;
      mesh.add(band);
      this.scene.add(mesh);
      this.canisters.push({ mesh, x: cx, z: cz, radius: 1.4 });
    });

    audio.playCorePickup(true);
    this.addScreenShake(0.45);
    this.particles.spawn(px, 1.5, pz, 40, { r: 0.1, g: 0.95, b: 0.6 }, 14, 1.8);
    this.spawnDamageText(new THREE.Vector3(px, 3.8, pz), '⚡ SHIELD 100% + EMP RECHARGED! ⚡', true, true);
    this.showStreakAnnouncement('SUPPLIES SECURED!');
    this.updateHUD();
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

    const decayPct = this.comboMultiplier > 1.0 ? Math.max(0, (this.comboTimer / this.comboMaxDuration) * 100) : 0;
    this.comboDecayBar.style.width = `${decayPct}%`;

    this.healthBar.style.width = `${(this.health / this.maxHealth) * 100}%`;
    this.healthNum.textContent = `${Math.round((this.health / this.maxHealth) * 100)}%`;
    this.shieldBar.style.width = `${(this.shield / this.maxShield) * 100}%`;
    this.shieldNum.textContent = `${Math.round((this.shield / this.maxShield) * 100)}%`;

    const dashPct = Math.max(0, 1 - (this.dashCooldown / this.dashMaxCooldown)) * 100;
    this.dashMeter.style.width = `${dashPct}%`;
    this.empMeter.style.width = `${this.empCharge}%`;

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

    // Active Augment Passives & Live Stacks Dock (Above Hull Bar)
    const augContainer = document.getElementById('augments-hud-container');
    if (augContainer) {
      if (!this.activeAugments || this.activeAugments.size === 0) {
        augContainer.innerHTML = '';
      } else {
        let html = '';
        this.activeAugments.forEach(key => {
          if (key === 'RICOCHET') {
            html += `<div class="aug-stack-badge"><span class="badge-icon">🪃</span><span class="badge-title">RICOCHET:</span><span class="badge-val">2x BOUNCE</span></div>`;
          } else if (key === 'VAMPIRIC') {
            const stacks = this.vampiricStacks || 0;
            const regen = (stacks * 1.5).toFixed(1);
            html += `<div class="aug-stack-badge vampiric"><span class="badge-icon">🩸</span><span class="badge-title">SIPHON:</span><span class="badge-val">x${stacks} (+${regen}/s)</span></div>`;
          } else if (key === 'STATIC_ARC') {
            const status = (this.teslaCooldown || 0) <= 0 ? 'READY' : `${this.teslaCooldown.toFixed(1)}s`;
            html += `<div class="aug-stack-badge tesla"><span class="badge-icon">⚡</span><span class="badge-title">TESLA:</span><span class="badge-val">${status}</span></div>`;
          } else if (key === 'OVERDRIVE') {
            html += `<div class="aug-stack-badge"><span class="badge-icon">🌀</span><span class="badge-title">OVERDRIVE:</span><span class="badge-val">DASH 1.1s | EMP +40%</span></div>`;
          } else if (key === 'SPLINTER') {
            html += `<div class="aug-stack-badge"><span class="badge-icon">💥</span><span class="badge-title">SHRAPNEL:</span><span class="badge-val">ARMED</span></div>`;
          } else if (key === 'ADRENALINE') {
            html += `<div class="aug-stack-badge adrenaline"><span class="badge-icon">🚀</span><span class="badge-title">NITRO:</span><span class="badge-val">+20% SPD & FIRE</span></div>`;
          } else if (key === 'VORTEX') {
            const count = this.vortexShotCount || 0;
            const status = count === 3 ? 'PRIMED!' : `${count}/4`;
            html += `<div class="aug-stack-badge vortex"><span class="badge-icon">🌌</span><span class="badge-title">VORTEX:</span><span class="badge-val">${status}</span></div>`;
          } else if (key === 'CASCADE') {
            const stacks = this.cascadeStacks || 0;
            const rofPct = Math.round(stacks * 7.5);
            html += `<div class="aug-stack-badge cascade"><span class="badge-icon">🌋</span><span class="badge-title">CASCADE:</span><span class="badge-val">x${stacks} (+${rofPct}% ROF)</span></div>`;
          } else if (key === 'CHRONO') {
            const status = (this.chronoCooldown || 0) <= 0 ? 'READY' : `${Math.ceil(this.chronoCooldown)}s`;
            html += `<div class="aug-stack-badge chrono"><span class="badge-icon">⏳</span><span class="badge-title">CHRONO:</span><span class="badge-val">${status}</span></div>`;
          }
        });
        augContainer.innerHTML = html;
      }
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

// Launch on Window Load
window.addEventListener('DOMContentLoaded', () => {
  window.game = new CyberArenaGame();
});
