/* ==========================================================================
   Background music
   - Starts automatically when the website opens.
   - Browsers block sound until the visitor first taps / clicks / presses a key,
     so if autoplay is blocked, the song starts on her very first touch.
   - The music button (top of the stack, bottom-right corner) stops / plays it.
     Once she stops it, it stays stopped until she presses play again.
   - If CONTENT.music.file is empty or the file is missing, a soft built-in
     music-box melody is played instead.
   ========================================================================== */
(function () {
  "use strict";

  var settings = (window.CONTENT && window.CONTENT.music) || {};
  var volume = typeof settings.volume === "number" ? Math.min(Math.max(settings.volume, 0), 1) : 0.35;
  var file = (settings.file || "").trim();

  var useSynth = !file;
  var playing = false;   // is sound actually coming out right now
  var wanted = false;    // should music be playing (false after she presses stop)
  var listeners = [];

  function setPlaying(value) {
    if (playing === value) return;
    playing = value;
    listeners.forEach(function (fn) { fn(playing); });
  }

  /* ---------------- Built-in music box ---------------- */
  var ctx = null;
  var master = null;
  var timer = null;
  var nextTime = 0;
  var step = 0;

  var BPM = 68;
  var EIGHTH = 60 / BPM / 2;
  // C - G - Am - F, one bar each (8 eighth notes per bar)
  var CHORDS = [
    { root: 60, minor: false },
    { root: 55, minor: false },
    { root: 57, minor: true },
    { root: 53, minor: false },
  ];
  // gentle melody: [eighth-step within the 4-bar loop, midi note, length in eighths]
  var MELODY = [
    [0, 76, 4], [4, 79, 4],
    [8, 74, 6], [14, 71, 2],
    [16, 72, 4], [20, 76, 4],
    [24, 69, 3], [27, 72, 2], [29, 74, 3],
  ];

  function freq(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

  function bell(time, midi, gain, decay, type) {
    var osc = ctx.createOscillator();
    var shimmer = ctx.createOscillator();
    var g = ctx.createGain();
    var gs = ctx.createGain();
    osc.type = type || "triangle";
    shimmer.type = "sine";
    osc.frequency.value = freq(midi);
    shimmer.frequency.value = freq(midi + 12);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(gain, time + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, time + decay);
    gs.gain.value = 0.25;
    osc.connect(g);
    shimmer.connect(gs);
    gs.connect(g);
    g.connect(master);
    osc.start(time);
    shimmer.start(time);
    osc.stop(time + decay + 0.05);
    shimmer.stop(time + decay + 0.05);
  }

  function scheduleStep(s, time) {
    var bar = Math.floor(s / 8) % 4;
    var inBar = s % 8;
    var chord = CHORDS[bar];
    var third = chord.minor ? 3 : 4;
    var arp = [0, 7, 12, 12 + third, 19, 12 + third, 12, 7];

    bell(time, chord.root + arp[inBar] - 12, 0.05, 1.4, "triangle");
    if (inBar === 0) bell(time, chord.root - 24, 0.06, 2.6, "sine");

    var loopStep = s % 32;
    MELODY.forEach(function (m) {
      if (m[0] === loopStep) bell(time, m[1], 0.07, m[2] * EIGHTH + 1.2, "sine");
    });
  }

  function scheduler() {
    while (nextTime < ctx.currentTime + 0.35) {
      scheduleStep(step, nextTime);
      nextTime += EIGHTH;
      step++;
    }
  }

  function canMakeSound() {
    // Without a tap/click yet, browsers won't allow Web Audio to start.
    var ua = navigator.userActivation;
    return !ua || ua.hasBeenActive;
  }

  function startSynth() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC || !canMakeSound()) return false;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.0001;

      // a soft echo makes it feel dreamy
      var delay = ctx.createDelay(2);
      var feedback = ctx.createGain();
      var wet = ctx.createGain();
      var lowpass = ctx.createBiquadFilter();
      delay.delayTime.value = EIGHTH * 3;
      feedback.gain.value = 0.28;
      wet.gain.value = 0.35;
      lowpass.type = "lowpass";
      lowpass.frequency.value = 3200;

      master.connect(lowpass);
      lowpass.connect(ctx.destination);
      lowpass.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    var now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
    master.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0002) * 1.6, now + 1.5);
    nextTime = now + 0.1;
    clearInterval(timer);
    timer = setInterval(scheduler, 100);
    scheduler();
    return true;
  }

  function stopSynth() {
    if (!ctx || !timer) return;
    var now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    clearInterval(timer);
    timer = null;
  }

  /* ---------------- Audio file ---------------- */
  var audioEl = null;
  var fadeTimer = null;

  function getAudio() {
    if (!audioEl) {
      audioEl = new Audio();
      audioEl.loop = true;
      audioEl.preload = "auto";
      audioEl.src = file;
      audioEl.addEventListener("error", function () {
        // file missing or unsupported: switch to the music box
        useSynth = true;
        if (wanted) attempt();
      });
    }
    return audioEl;
  }

  function fadeTo(target, done) {
    clearInterval(fadeTimer);
    fadeTimer = setInterval(function () {
      var v = audioEl.volume;
      var next = v + (target > v ? 0.03 : -0.04);
      if ((target > v && next >= target) || (target <= v && next <= target)) {
        audioEl.volume = target;
        clearInterval(fadeTimer);
        if (done) done();
      } else {
        audioEl.volume = Math.min(Math.max(next, 0), 1);
      }
    }, 60);
  }

  function startFile() {
    var a = getAudio();
    clearInterval(fadeTimer);
    if (a.paused) a.volume = 0;
    var p = a.play();
    if (p && p.then) {
      p.then(function () {
        if (!wanted) { a.pause(); return; }
        setPlaying(true);
        stopWaiting();
        fadeTo(volume);
      }).catch(function (err) {
        if (err && err.name === "NotAllowedError") {
          waitForTouch(); // browser blocked autoplay: start on her first tap
        } else if (err && err.name !== "AbortError") {
          useSynth = true;
          if (wanted) attempt();
        }
      });
    } else {
      setPlaying(true);
      fadeTo(volume);
    }
  }

  function stopFile() {
    if (!audioEl) return;
    fadeTo(0, function () { audioEl.pause(); });
  }

  /* ---------------- Start on first touch ---------------- */
  var GESTURES = ["pointerdown", "pointerup", "click", "keydown", "touchend"];
  var waiting = false;

  function onFirstTouch(e) {
    // let the music button handle its own clicks (so "stop" really stops)
    if (e.target && e.target.closest && e.target.closest("#music-toggle")) return;
    if (!wanted || playing) { stopWaiting(); return; }
    attempt();
  }
  function waitForTouch() {
    if (waiting) return;
    waiting = true;
    GESTURES.forEach(function (ev) { document.addEventListener(ev, onFirstTouch, true); });
  }
  function stopWaiting() {
    if (!waiting) return;
    waiting = false;
    GESTURES.forEach(function (ev) { document.removeEventListener(ev, onFirstTouch, true); });
  }

  function attempt() {
    if (useSynth) {
      if (startSynth()) { setPlaying(true); stopWaiting(); }
      else waitForTouch();
    } else {
      startFile();
    }
  }

  /* ---------------- Public API ---------------- */
  window.LoveMusic = {
    /** Called when the page opens: play now if allowed, otherwise on first tap. */
    autoplay: function () {
      wanted = true;
      attempt();
    },
    start: function () {
      wanted = true;
      if (!playing) attempt();
    },
    stop: function () {
      wanted = false;
      stopWaiting();
      if (useSynth) stopSynth();
      if (audioEl) stopFile();
      setPlaying(false);
    },
    toggle: function () {
      if (playing) this.stop(); else this.start();
    },
    isPlaying: function () { return playing; },
    onChange: function (fn) { listeners.push(fn); },
  };
})();
