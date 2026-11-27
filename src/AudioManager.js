/**
 * AudioManager — procedural sound for Big Rig Wrecker.
 *
 * One-shot effects (crash, horn, siren, ...) are pre-rendered into AudioBuffers.
 * The ENGINE is different: it is a live synthesis graph that is re-parameterised
 * every frame from the truck's speed/load, so it behaves like a real engine
 * instead of a looping synth pad.
 *
 * Diesel model (6-cylinder, 4-stroke):
 *   firingRate = (rpm / 60) * (cylinders / 2)     -> 600rpm = 30Hz thump
 * The "thump" comes from a pulse train at firingRate; the roar comes from
 * harmonics of that same train plus a band-passed noise bed. A low-pass filter
 * opens with rpm (classic engine growl), and a quiet turbo whistle tracks load.
 */

const ENGINE_CYLINDERS = 6;      // big-rig diesel
const ENGINE_GEARS = 6;          // simulated gearcount so rpm sweeps + drops
const ENGINE_MIN_RPM = 550;      // idle, no load
const ENGINE_MAX_RPM = 2100;     // redline-ish

export default class AudioManager {
  constructor() {
    this.ctx = null;
    this.buffers = {};
    this.volume = 0.6;
    this.muted = false;
    this.loops = {};
    this._initialized = false;

    // Live engine graph state
    this.engine = null;
    this._engineGear = 0;
    this._engineRpm = ENGINE_MIN_RPM;
    this._engineLoad = 0;
  }

  init() {
    if (this._initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();

      // Master bus: everything routes through here so setVolume()/setMuted()
      // affect *currently playing* sounds too (previously they only affected
      // sounds started after the change).
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      // Gentle compressor keeps the mix from clipping when many things overlap.
      this.comp = this.ctx.createDynamicsCompressor();
      this.comp.threshold.value = -12;
      this.comp.knee.value = 12;
      this.comp.ratio.value = 4;
      this.comp.attack.value = 0.004;
      this.comp.release.value = 0.16;
      this.master.connect(this.comp);
      this.comp.connect(this.ctx.destination);

      this._generateAll();

      this._initialized = true;
    } catch (e) {
      console.warn('AudioManager: Web Audio API not available', e);
    }
  }

  // Some browsers hand back a suspended context even after a gesture.
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
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

    // Reusable one-second noise buffer for one-shots that need it.
    this.noiseBuf = mkBuf(1.0, () => Math.random() * 2 - 1);

    // 1. horn (~0.8s) — dual-tone air horn, slightly detained partials
    this.buffers.horn = mkBuf(0.8, (i, n, sr) => {
      const t = i / sr;
      const env = i < n * 0.04 ? i / (n * 0.04) : i > n * 0.8 ? (n - i) / (n * 0.2) : 1;
      const a = Math.sin(2 * Math.PI * 220 * t) * 0.4;
      const b = Math.sin(2 * Math.PI * 277.5 * t) * 0.35;
      const c = Math.sin(2 * Math.PI * 334 * t) * 0.15;
      return (a + b + c) * env * 0.45;
    });

    // 2. crash (~0.5s) — broadband + metallic ring
    this.buffers.crash = mkBuf(0.5, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 12);
      const noise = (Math.random() * 2 - 1);
      const metal = Math.sin(2 * Math.PI * 800 * t + Math.sin(2 * Math.PI * 50 * t) * 5) * 0.3;
      return (noise * 0.6 + metal) * env;
    });

    // 3. explosion (~1s)
    this.buffers.explosion = mkBuf(1.0, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 4);
      const noise = (Math.random() * 2 - 1) * 0.6;
      const boom = Math.sin(2 * Math.PI * 50 * t) * Math.exp(-t * 8) * 0.5;
      return (boom + noise) * env;
    });

    // 4. screech (~0.5s) — tyre/steel scrape
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

    // 5. coin (~0.3s)
    this.buffers.coin = mkBuf(0.3, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 10);
      const freq = 1000 + 200 * Math.sin(2 * Math.PI * 40 * t);
      return Math.sin(2 * Math.PI * freq * t) * env * 0.5;
    });

    // 6. powerup (~0.5s)
    this.buffers.powerup = mkBuf(0.5, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 5);
      const freq = 500 + 400 * (i / n);
      return Math.sin(2 * Math.PI * freq * t) * env * 0.45;
    });

    // 7. siren (~2s) — yelp
    this.buffers.siren = mkBuf(2.0, (i, n, sr) => {
      const t = i / sr;
      const lfo = Math.sin(2 * Math.PI * 2 * t);
      const freq = 600 + 200 * lfo;
      const env = i < n * 0.1 ? i / (n * 0.1) : i > n * 0.9 ? (n - i) / (n * 0.1) : 1;
      return Math.sin(2 * Math.PI * freq * t) * env * 0.35;
    });

    // 8. countdown (~0.2s) — UI beep
    this.buffers.countdown = mkBuf(0.2, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 15);
      return Math.sin(2 * Math.PI * 880 * t) * env * 0.4;
    });

    // 9. go (~0.25s) — UI beep (higher)
    this.buffers.go = mkBuf(0.25, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 12);
      return Math.sin(2 * Math.PI * 1320 * t) * env * 0.45;
    });

    // 10. level_complete (~0.5s) — rising arp
    this.buffers.level_complete = mkBuf(0.5, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 6);
      const freq = 440 + 440 * (i / n);
      return Math.sin(2 * Math.PI * freq * t) * env * 0.35;
    });

    // 11. game_over (~1.5s) — descending sad tone
    this.buffers.game_over = mkBuf(1.5, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 2.5);
      const freq = 440 * Math.pow(0.5, t);
      return Math.sin(2 * Math.PI * freq * t) * env * 0.3;
    });

    // 12. menu_click (~0.05s) — tiny tick
    this.buffers.menu_click = mkBuf(0.05, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 60);
      return Math.sin(2 * Math.PI * 1200 * t) * env * 0.3;
    });

    // 13. menu_hover (~0.03s) — even tinier
    this.buffers.menu_hover = mkBuf(0.03, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 80);
      return Math.sin(2 * Math.PI * 1600 * t) * env * 0.2;
    });

    // 14. wind (~3s) — ambient loop
    this.buffers.wind = mkBuf(3.0, (i, n, sr) => {
      const t = i / sr;
      const noise = (Math.random() * 2 - 1) * 0.2;
      const lfo = Math.sin(2 * Math.PI * 0.1 * t) * 0.5;
      return (noise + lfo) * 0.1;
    });

    // 15. wreck (~0.4s) — heavy impact
    this.buffers.wreck = mkBuf(0.4, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 8);
      const noise = (Math.random() * 2 - 1) * 0.5;
      const thump = Math.sin(2 * Math.PI * 60 * t) * Math.exp(-t * 12) * 0.4;
      return (noise + thump) * env;
    });

    // 16. nitro (~0.3s) — whoosh
    this.buffers.nitro = mkBuf(0.3, (i, n, sr) => {
      const t = i / sr;
      const env = Math.exp(-t * 10);
      const noise = (Math.random() * 2 - 1) * 0.4;
      const sweep = Math.sin(2 * Math.PI * (500 + 1500 * t) * t) * 0.2;
      return (noise + sweep) * env;
    });

    // Build the live engine synthesis graph
    this._buildEngineGraph();
  }

  // ==== Live Engine Graph ====
  _buildEngineGraph() {
    const ctx = this.ctx;
    const amp = ctx.createGain();
    amp.gain.value = 0;
    amp.connect(this.master);

    // Master pulse train at firing rate (rpm * cylinders / 120)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 30; // idle firing rate
    osc1.connect(amp);

    // Harmonic layers
    const osc2 = ctx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.value = 60;
    const gain2 = ctx.createGain();
    gain2.gain.value = 0.35;
    osc2.connect(gain2).connect(amp);

    const osc3 = ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.value = 120;
    const gain3 = ctx.createGain();
    gain3.gain.value = 0.2;
    osc3.connect(gain3).connect(amp);

    // Low-pass filter opens with rpm
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 300;
    tone.Q.value = 1;
    amp.connect(tone).connect(this.master);

    // Noise bed for roar
    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuf;
    noise.loop = true;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.05;
    const noiseTone = ctx.createBiquadFilter();
    noiseTone.type = 'bandpass';
    noiseTone.frequency.value = 500;
    noiseTone.Q.value = 2;
    noise.connect(noiseGain).connect(noiseTone).connect(this.master);
    noise.start();

    // Turbo whistle (high freq sine)
    const turbo = ctx.createOscillator();
    turbo.type = 'sine';
    turbo.frequency.value = 1700;
    const turboGain = ctx.createGain();
    turboGain.gain.value = 0;
    turbo.connect(turboGain).connect(this.master);
    turbo.start();

    // Wobble (frequency modulation for roughness)
    const wobble = ctx.createOscillator();
    wobble.type = 'sine';
    wobble.frequency.value = 4;
    const wobbleDepth = ctx.createGain();
    wobbleDepth.gain.value = 1;
    wobble.connect(wobbleDepth).connect(osc1.frequency);
    wobble.connect(wobbleDepth).connect(osc2.frequency);
    wobble.connect(wobbleDepth).connect(osc3.frequency);
    wobble.start();

    // 2nd wobble for detune
    const wobble2 = ctx.createOscillator();
    wobble2.type = 'sine';
    wobble2.frequency.value = 1.8;
    const wobbleDetune2 = ctx.createGain();
    wobbleDetune2.gain.value = 1;
    wobble2.connect(wobbleDetune2).connect(osc1.detune);
    wobble2.connect(wobbleDetune2).connect(osc2.detune);
    wobble2.start();

    osc1.start();
    osc2.start();
    osc3.start();

    this.engine = {
      amp,
      // Aliases for test compatibility
      fireA: osc1,
      fireB: osc2,
      fireC: osc3,
      osc1,
      osc2,
      osc3,
      tone,
      noiseGain,
      noiseTone,
      turbo,
      turboGain,
      wobble,
      wobbleDepth,
      wobble2,
      wobbleDetune2,
      suspended: true,
    };
  }

  // Helpers to compute target amp
  _engineTargetAmp() {
    // Base amp rises with rpm/load
    return 0.15 + this._engineRpm / ENGINE_MAX_RPM * 0.4 + this._engineLoad * 0.25;
  }

  startEngine() {
    if (!this.engine || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.engine.suspended = false;
    this.engine.amp.gain.setTargetAtTime(this._engineTargetAmp(), this.ctx.currentTime, 0.12);
  }

  setEngineSuspended(suspended) {
    if (!this.engine || !this.ctx) return;
    this.engine.suspended = suspended;
    const t = this.ctx.currentTime;
    if (suspended) {
      this.engine.amp.gain.setTargetAtTime(0, t, 0.1);
    } else {
      this.engine.amp.gain.setTargetAtTime(this._engineTargetAmp(), t, 0.12);
    }
  }

  stopEngine() {
    this.setEngineSuspended(true);
  }

  updateEngine(rpmNorm, load) {
    if (!this.engine || !this.ctx) return;
    const e = this.engine;
    const t = this.ctx.currentTime;
    const tc = 0.06; // time constant for smooth changes

    // Gear logic: step rpm up/down with speed, add small drops on "shift"
    const rpmRaw = ENGINE_MIN_RPM + rpmNorm * (ENGINE_MAX_RPM - ENGINE_MIN_RPM);
    const newGear = Math.min(ENGINE_GEARS - 1, Math.floor(rpmNorm * ENGINE_GEARS));
    if (newGear !== this._engineGear) {
      // Simulate gear shift: brief rpm drop then rise
      this._engineGear = newGear;
      // Schedule a quick dip+recovery
      const dipRpm = Math.max(ENGINE_MIN_RPM, rpmRaw * 0.72);
      e.osc1.frequency.setTargetAtTime(dipRpm / 20, t, 0.03);
      e.osc2.frequency.setTargetAtTime(dipRpm / 10, t, 0.03);
      e.osc3.frequency.setTargetAtTime(dipRpm / 5, t, 0.03);
      setTimeout(() => {
        e.osc1.frequency.setTargetAtTime(rpmRaw / 20, t + 0.15, tc);
        e.osc2.frequency.setTargetAtTime(rpmRaw / 10, t + 0.15, tc);
        e.osc3.frequency.setTargetAtTime(rpmRaw / 5, t + 0.15, tc);
      }, 30);
    } else {
      e.osc1.frequency.setTargetAtTime(rpmRaw / 20, t, tc);
      e.osc2.frequency.setTargetAtTime(rpmRaw / 10, t, tc);
      e.osc3.frequency.setTargetAtTime(rpmRaw / 5, t, tc);
    }
    this._engineRpm = rpmRaw;

    // Detune: spread oscillators slightly for thicker tone
    e.osc1.detune.setTargetAtTime(-6, t, tc);
    e.osc2.detune.setTargetAtTime(7, t, tc);

    // Filter opens with rpm; load pushes it further
    const toneHz = 220 + rpmNorm * 2600 + load * 900;
    e.tone.frequency.setTargetAtTime(toneHz, t, tc);
    e.tone.Q.setTargetAtTime(1.1 + rpmNorm * 1.6, t, tc);

    // Roar layer
    e.noiseGain.gain.setTargetAtTime(0.05 + rpmNorm * 0.16 + load * 0.10, t, tc);
    e.noiseTone.frequency.setTargetAtTime(500 + rpmNorm * 2400 + load * 600, t, tc);

    // Turbo whistle: audible mainly under load at high rpm
    e.turbo.frequency.setTargetAtTime(1700 + rpmNorm * 2400, t, tc);
    e.turboGain.gain.setTargetAtTime(load * (0.012 + rpmNorm * 0.02), t, tc);

    // Wobble depth grows with rpm (rougher engine)
    e.wobbleDepth.gain.setTargetAtTime(1 + rpmNorm * 4, t, tc);
    e.wobbleDetune2.gain.setTargetAtTime(1 + rpmNorm * 3, t, tc);

    if (!this.engine.suspended) {
      e.amp.gain.setTargetAtTime(this._engineTargetAmp(), t, 0.12);
    }
  }

  play(name, loop = false) {
    if (!this.ctx || !this.buffers[name]) return null;
    const src = this.ctx.createBufferSource();
    src.buffer = this.buffers[name];
    src.loop = loop;
    src.connect(this.master);
    src.start(0);
    if (loop) this.loops[name] = src;
    return src;
  }

  stopLoop(name) {
    const src = this.loops[name];
    if (src) {
      try { src.stop(); } catch (_) {}
      delete this.loops[name];
    }
  }

  stopAll() {
    for (const name of Object.keys(this.loops)) this.stopLoop(name);
    this.stopEngine();
  }

  setMuted(muted) {
    if (!this.ctx) return;
    this.muted = muted;
    const t = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(muted ? 0 : this.volume, t, 0.05);
    if (muted) {
      this.setEngineSuspended(true);
    } else if (this.started) {
      this.startEngine();
    }
  }

  isMuted() {
    return this.muted;
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (!this.muted && this.ctx) {
      this.master.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  getVolume() {
    return this.volume;
  }
}