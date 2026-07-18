/* Audio engine — WebAudio synth, no external assets.
 * SFX: fishTok, slap, splat(kind), bell
 * BGM: start(mode) / stop()  modes: buddhist | christian | muslim
 * Global: mute(bool), isMuted()
 */
(function () {
  let ctx = null;
  let muted = JSON.parse(localStorage.getItem("egg-toss-muted") || "false");
  let bgm = null;

  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function gain(v, t = 0) {
    const a = ac(), g = a.createGain();
    g.gain.setValueAtTime(v, a.currentTime + t);
    g.connect(a.destination);
    return g;
  }
  function noiseBuffer(dur = 0.3) {
    const a = ac(), b = a.createBuffer(1, a.sampleRate * dur, a.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1);
    return b;
  }
  function tone({ f = 440, dur = 0.2, type = "sine", g = 0.2, attack = 0.005, decay = 0.2, dest = null, detune = 0 }) {
    if (muted) return;
    const a = ac(), o = a.createOscillator(), gn = a.createGain();
    o.type = type; o.frequency.value = f; o.detune.value = detune;
    o.connect(gn); gn.connect(dest || a.destination);
    const t = a.currentTime;
    gn.gain.setValueAtTime(0, t);
    gn.gain.linearRampToValueAtTime(g, t + attack);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    o.start(t); o.stop(t + attack + decay + 0.05);
    return { o, gn };
  }
  function noise({ dur = 0.2, g = 0.2, lp = 1200, hp = 100 }) {
    if (muted) return;
    const a = ac(), src = a.createBufferSource();
    src.buffer = noiseBuffer(dur);
    const lpF = a.createBiquadFilter(); lpF.type = "lowpass"; lpF.frequency.value = lp;
    const hpF = a.createBiquadFilter(); hpF.type = "highpass"; hpF.frequency.value = hp;
    const gn = a.createGain();
    src.connect(hpF); hpF.connect(lpF); lpF.connect(gn); gn.connect(a.destination);
    const t = a.currentTime;
    gn.gain.setValueAtTime(g, t);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.start(t); src.stop(t + dur + 0.05);
  }

  // ─── SFX ───
  function fishTok() {
    if (muted) return;
    // hollow wood "tok": low sine click + short noise burst, both fast decay
    tone({ f: 220, type: "sine", g: 0.45, attack: 0.001, decay: 0.18 });
    tone({ f: 110, type: "triangle", g: 0.25, attack: 0.001, decay: 0.22 });
    noise({ dur: 0.05, g: 0.18, lp: 800, hp: 200 });
  }
  function slap() {
    if (muted) return;
    noise({ dur: 0.12, g: 0.5, lp: 4000, hp: 800 });
    tone({ f: 180, type: "sine", g: 0.25, attack: 0.001, decay: 0.08 });
  }
  function splat(kind = "egg") {
    if (muted) return;
    if (kind === "cabbage") {
      noise({ dur: 0.22, g: 0.4, lp: 1600, hp: 60 });
      tone({ f: 90, type: "triangle", g: 0.18, attack: 0.001, decay: 0.18 });
    } else {
      noise({ dur: 0.18, g: 0.35, lp: 2400, hp: 200 });
      tone({ f: 140, type: "sine", g: 0.22, attack: 0.001, decay: 0.1 });
    }
  }
  function bell() {
    if (muted) return;
    [880, 1320, 1760].forEach((f, i) =>
      tone({ f, type: "sine", g: 0.18 / (i + 1), attack: 0.005, decay: 1.6 - i * 0.3 })
    );
  }

  // ─── BGM ───
  function stopBGM() {
    if (!bgm) return;
    const t = ctx.currentTime;
    bgm.master.gain.cancelScheduledValues(t);
    bgm.master.gain.setValueAtTime(bgm.master.gain.value, t);
    bgm.master.gain.linearRampToValueAtTime(0, t + 0.4);
    setTimeout(() => { bgm && bgm.cleanup && bgm.cleanup(); bgm = null; }, 500);
  }
  function startBGM(mode) {
    stopBGM();
    if (muted) { bgm = { mode, cleanup: () => {} }; return; }
    const a = ac();
    const master = a.createGain();
    master.gain.value = 0;
    master.connect(a.destination);
    master.gain.linearRampToValueAtTime(0.55, a.currentTime + 1.2);

    const oscs = [];
    function drone(f, type = "sine", g = 0.08, detune = 0) {
      const o = a.createOscillator(), gn = a.createGain();
      o.type = type; o.frequency.value = f; o.detune.value = detune;
      gn.gain.value = g; o.connect(gn); gn.connect(master);
      o.start(); oscs.push({ o, gn });
      // slow gain LFO for breathiness
      const lfo = a.createOscillator(), lg = a.createGain();
      lfo.frequency.value = 0.12 + Math.random() * 0.1; lg.gain.value = g * 0.4;
      lfo.connect(lg); lg.connect(gn.gain);
      lfo.start(); oscs.push({ o: lfo, gn: lg });
      return { o, gn };
    }

    let timer = null;
    if (mode === "buddhist") {
      // F + C drone, periodic bell, "om" formant via low triangle
      drone(87.31, "sine", 0.10);          // F2
      drone(130.81, "sine", 0.07);         // C3
      drone(174.61, "triangle", 0.04);     // F3
      timer = setInterval(() => {
        if (muted || !bgm) return;
        [659, 988].forEach((f, i) => tone({ f, type: "sine", g: 0.1, attack: 0.005, decay: 2.2, dest: master }));
      }, 4500);
    } else if (mode === "christian") {
      // organ-ish stacked sine: C major triad pad + slow breathy
      drone(130.81, "sawtooth", 0.05);      // C3
      drone(164.81, "sawtooth", 0.04);      // E3
      drone(196.00, "sawtooth", 0.04);      // G3
      drone(261.63, "sine", 0.05);          // C4
      // distant church bell
      timer = setInterval(() => {
        if (muted || !bgm) return;
        [523.25, 659.25, 783.99].forEach((f, i) =>
          tone({ f, type: "sine", g: 0.08 / (i + 1), attack: 0.005, decay: 2.5, dest: master }));
      }, 8000);
    } else if (mode === "muslim") {
      // microtonal drone (D + slight detune fifth A), slow sine swell
      drone(73.42, "sine", 0.10);           // D2
      drone(110.0, "sine", 0.07, 12);       // A2 +12 cents
      drone(146.83, "triangle", 0.04);      // D3
      // soft chime
      timer = setInterval(() => {
        if (muted || !bgm) return;
        [440, 587.33].forEach((f, i) => tone({ f, type: "sine", g: 0.08, attack: 0.01, decay: 2.0, dest: master }));
      }, 6500);
    }

    bgm = {
      mode, master,
      cleanup: () => {
        if (timer) clearInterval(timer);
        oscs.forEach(({ o }) => { try { o.stop(); } catch (e) {} });
      },
    };
  }
  function bgmPause() {
    if (!bgm) return;
    bgm.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
  }
  function bgmResume() {
    if (!bgm) return;
    bgm.master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.4);
  }

  function setMuted(m) {
    muted = !!m;
    localStorage.setItem("egg-toss-muted", JSON.stringify(muted));
    if (muted && bgm) bgmPause();
    else if (!muted && bgm) bgmResume();
  }

  window.GameAudio = {
    fishTok, slap, splat, bell,
    startBGM, stopBGM, bgmPause, bgmResume,
    setMuted, isMuted: () => muted, currentMode: () => bgm && bgm.mode,
  };
})();
