export default class AudioManager {
  constructor() {
    this.ctx = null;
    this.buffers = {};
    this.volume = 0.5;
    this.muted = false;
    this.loops = {};
    this._initialized = false;
  }

  init() {
    if (this._initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._generateAll();
      this._initialized = true;
    } catch (e) {
      console.warn('AudioManager: Web Audio API not available', e);
    }
  }

  _generateAll() {
    const sr = this.ctx.sampleRate;

    // Helper: create buffer from generator function
    const mkBuf = (dur, fn) => {
      const len = Math.floor(sr * dur);
      const buf = this.ctx.createBuffer(1, len, sr);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = fn(i, len, sr);
      return buf;
    };

    // Helper: one-pole low-pass filter state
    const lpf = (alpha) => {
      let prev = 0;
      return (x) => { prev = alpha * x + (1 - alpha) * prev; return prev; };
    };

    // 1. engine_idle (~2s) — low rumble
    this.buffers.engine_idle = mkBuf(2.0, (i, n, sr) => {
      const t = i / sr;
      const base = Math.sin(2 * Math.PI * 55 * t) * 0.3;
      const harm = Math.sin(2 * Math.PI * 110 * t) * 0.15;
      const noise = (Math.random() * 2 - 1) * 0.05;
      const lfo = 1 + 0.2 * Math.sin(2 * Math.PI * 2 * t);
      return (base + harm + noise) * lfo * 0.5;
    });

    // 2. engine_rev (~1s)
    this.buffers.engine_rev = mkBuf(1.0, (i, n, sr) => {
      const t = i / sr;
      const freq = 80 + 120 * (i / n);
      const base = Math.sin(2 * Math.PI * freq * t) * 0.35;
      const harm = Math.sin(2 * Math.PI * freq * 2 * t) * 0.15;
      const noise = (Math.random() * 2 - 1) * 0.04;
      return (base + harm + noise) * 0.6;
    });

    // 3. horn (~0.8s)
    this.buffers.horn = mkBuf(0.8, (i, n, sr) => {
      const t = i / sr;
      const env = i < n * 0.05 ? i / (n * 0.05) : i > n * 0.85 ? (n - i) / (n * 0.15) : 1;
      const a = Math.sin(2 * Math.PI * 220 * t) * 0.4;
      const b = Math.sin(2 * Math.PI * 277 * t) * 0.35;
      const c = Math.sin(2 * Math.PI * 330 * t) * 0.15;
      return (a + b + c) * env * 0.5;
    });

    // 4. crash (~0.5s)
    this.buffers.crash = mkBuf(0.5, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 12);
      const noise = (Math.random() * 2 - 1);
      const metal = Math.sin(2 * Math.PI * 800 * t + Math.sin(2 * Math.PI * 50 * t) * 5) * 0.3;
      return (noise * 0.6 + metal) * env;
    });

    // 5. explosion (~1s)
    this.buffers.explosion = mkBuf(1.0, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 4);
      const freq = 150 * Math.exp(-t * 3) + 30;
      const boom = Math.sin(2 * Math.PI * freq * t) * 0.5;
      const noise = (Math.random() * 2 - 1) * 0.4;
      return (boom + noise) * env;
    });

    // 6. screech (~0.5s)
    this.buffers.screech = mkBuf(0.5, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 6);
      const noise = (Math.random() * 2 - 1);
      const mod = Math.sin(2 * Math.PI * 30 * t);
      const alpha = 0.15 + 0.1 * mod;
      // Simple high-pass via complement of low-pass
      const lp = alpha * noise + (1 - alpha) * ((i > 0) ? noise * 0.5 : 0);
      return (noise - lp * 0.5) * env * 0.7;
    });

    // 7. coin (~0.3s)
    this.buffers.coin = mkBuf(0.3, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 10);
      const f1 = 1318.5; // E6
      const f2 = 1975.5; // B6
      const freq = t < 0.1 ? f1 : f2;
      return Math.sin(2 * Math.PI * freq * t) * env * 0.5;
    });

    // 8. powerup (~0.5s)
    this.buffers.powerup = mkBuf(0.5, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 5);
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
      const idx = Math.min(Math.floor(t / 0.12), 3);
      const freq = notes[idx];
      return Math.sin(2 * Math.PI * freq * t) * env * 0.45;
    });

    // 9. siren (~2s)
    this.buffers.siren = mkBuf(2.0, (i, n, sr) => {
      const t = i / sr;
      const lfo = Math.sin(2 * Math.PI * 2 * t); // 2 Hz wobble
      const freq = 600 + 200 * lfo;
      const env = 0.35;
      return Math.sin(2 * Math.PI * freq * t) * env;
    });

    // 10. menu_click (~0.1s)
    this.buffers.menu_click = mkBuf(0.1, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 40);
      return Math.sin(2 * Math.PI * 800 * t) * env * 0.4;
    });

    // 11. menu_hover (~0.05s)
    this.buffers.menu_hover = mkBuf(0.05, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 60);
      return Math.sin(2 * Math.PI * 600 * t) * env * 0.25;
    });

    // 12. countdown (~0.2s)
    this.buffers.countdown = mkBuf(0.2, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 15);
      return Math.sin(2 * Math.PI * 440 * t) * env * 0.5;
    });

    // 13. go (~0.4s)
    this.buffers.go = mkBuf(0.4, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 6);
      return Math.sin(2 * Math.PI * 880 * t) * env * 0.5;
    });

    // 14. wind (~2s)
    this.buffers.wind = mkBuf(2.0, (i, n, sr) => {
      const t = i / sr;
      const noise = (Math.random() * 2 - 1);
      const mod = 0.15 + 0.1 * Math.sin(2 * Math.PI * 0.5 * t);
      let prev = 0;
      prev = mod * noise + (1 - mod) * prev;
      return prev * 0.4;
    });

    // 15. nitro (~1s)
    this.buffers.nitro = mkBuf(1.0, (i, n, sr) => {
      const t = i / sr;
      const env = t < 0.2 ? t / 0.2 : Math.exp(-(t - 0.2) * 3);
      const noise = (Math.random() * 2 - 1) * 0.5;
      const low = Math.sin(2 * Math.PI * 60 * t) * 0.3;
      const alpha = 0.1 + 0.3 * (i / n);
      return (alpha * noise + (1 - alpha) * low) * env * 0.7;
    });

    // 16. wreck (~1.5s)
    this.buffers.wreck = mkBuf(1.5, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 3);
      const boom = Math.sin(2 * Math.PI * (100 * Math.exp(-t * 2)) * t) * 0.4;
      const metal = (Math.random() * 2 - 1) * 0.4 * Math.exp(-t * 6);
      const glass = (Math.random() * 2 - 1) * 0.2 * Math.exp(-(t - 0.1) * 10) * (t > 0.1 ? 1 : 0);
      return (boom + metal + glass) * env;
    });

    // 17. level_complete (~1.5s)
    this.buffers.level_complete = mkBuf(1.5, (i, n, sr) => {
      const t = i / sr;
      const notes = [261.63, 329.63, 392, 523.25]; // C4 E4 G4 C5
      const dur = 0.35;
      const idx = Math.min(Math.floor(t / dur), 3);
      const localT = t - idx * dur;
      const env = Math.exp(-localT * 4);
      return Math.sin(2 * Math.PI * notes[idx] * t) * env * 0.4;
    });

    // 18. game_over (~1.5s)
    this.buffers.game_over = mkBuf(1.5, (i, n, sr) => {
      const t = i / sr;
      const notes = [392, 349.23, 293.66, 261.63]; // G4 F4 D4 C4
      const dur = 0.35;
      const idx = Math.min(Math.floor(t / dur), 3);
      const localT = t - idx * dur;
      const env = Math.exp(-localT * 3);
      return Math.sin(2 * Math.PI * notes[idx] * t) * env * 0.4;
    });
  }

  play(name, loop = false) {
    if (!this.ctx || !this.buffers[name]) return null;
    if (this.muted) return null;

    const source = this.ctx.createBufferSource();
    source.buffer = this.buffers[name];
    source.loop = loop;

    const gain = this.ctx.createGain();
    gain.gain.value = this.volume;

    source.connect(gain);
    gain.connect(this.ctx.destination);
    source.start(0);

    if (loop) {
      // Stop any previous loop of this sound
      if (this.loops[name]) {
        try { this.loops[name].stop(); } catch (e) { /* already stopped */ }
      }
      this.loops[name] = source;
    }

    return source;
  }

  stopLoop(name) {
    if (this.loops[name]) {
      try { this.loops[name].stop(); } catch (e) { /* already stopped */ }
      delete this.loops[name];
    }
  }

  stopAll() {
    for (const name of Object.keys(this.loops)) {
      this.stopLoop(name);
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  getVolume() {
    return this.volume;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) this.stopAll();
    return this.muted;
  }

  setMuted(muted) {
    this.muted = !!muted;
    if (this.muted) this.stopAll();
  }

  isMuted() {
    return this.muted;
  }
}
