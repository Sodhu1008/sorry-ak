/* ==========================================================================
   A Little Apology From My Heart: interactions
   All the words come from js/content.js, so you shouldn't need to edit this.
   ========================================================================== */
(function () {
  "use strict";

  var C = window.CONTENT || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------------- Helpers ---------------- */
  function personalize(text) {
    return String(text == null ? "" : text)
      .replace(/\{herName\}/g, C.herName || "My Love")
      .replace(/\{yourName\}/g, C.yourName || "");
  }

  function getPath(path) {
    return path.split(".").reduce(function (obj, key) {
      return obj && obj[key] !== undefined ? obj[key] : undefined;
    }, C);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = personalize(text);
    return node;
  }

  function list(arr) { return Array.isArray(arr) ? arr : []; }

  function random(min, max) { return Math.random() * (max - min) + min; }

  /* ==========================================================================
     1. Fill in all the words
     ========================================================================== */
  function renderContent() {
    if (C.pageTitle) document.title = personalize(C.pageTitle);

    $$("[data-content]").forEach(function (node) {
      var value = getPath(node.getAttribute("data-content"));
      if (typeof value === "string") node.textContent = personalize(value);
    });

    // Apology
    var apology = $("#apology-message");
    list(C.apology && C.apology.paragraphs).forEach(function (p) {
      apology.appendChild(el("p", "", p));
    });

    // Special cards
    var grid = $("#special-grid");
    list(C.specialThings).forEach(function (item, i) {
      var wrap = el("div", "reveal");
      wrap.style.setProperty("--delay", (i % 3) * 0.12 + "s");
      var card = el("article", "special-card");
      var emoji = el("div", "special-card__emoji", item.emoji || "💗");
      emoji.setAttribute("aria-hidden", "true");
      emoji.style.setProperty("--float-delay", -i * 0.7 + "s");
      card.appendChild(emoji);
      card.appendChild(el("h3", "", item.title));
      card.appendChild(el("p", "", item.text));
      wrap.appendChild(card);
      grid.appendChild(wrap);
    });

    // Gallery
    var gallery = $("#gallery");
    list(C.photos).forEach(function (photo, i) {
      var li = el("li", "reveal");
      li.style.setProperty("--delay", (i % 4) * 0.1 + "s");
      var btn = el("button", "photo");
      btn.type = "button";
      btn.setAttribute("aria-label", "Open photo: " + personalize(photo.caption || photo.alt || "photo " + (i + 1)));
      btn.dataset.index = i;

      var frame = el("span", "photo__frame");
      var img = document.createElement("img");
      img.src = photo.src;
      img.alt = personalize(photo.alt || "");
      // load with the page (behind the opening screen) so the masonry
      // layout is settled before she scrolls to it
      img.decoding = "async";
      frame.appendChild(img);
      btn.appendChild(frame);
      if (photo.caption) btn.appendChild(el("span", "photo__caption", photo.caption));
      li.appendChild(btn);
      gallery.appendChild(li);
    });

    // Reasons
    var reasonsList = $("#reasons-list");
    var heartPath = "M23.6 0c-3.4 0-6.3 2.7-7.6 5.6C14.7 2.7 11.8 0 8.4 0 3.8 0 0 3.8 0 8.4c0 9.4 9.5 11.9 16 21.2 6.1-9.3 16-12.1 16-21.2C32 3.8 28.2 0 23.6 0z";
    list(C.reasons).forEach(function (reason, i) {
      var li = el("li", "reason");
      li.style.setProperty("--delay", (i % 2) * 0.15 + "s");
      var num = el("span", "reason__num");
      num.setAttribute("aria-hidden", "true");
      num.innerHTML = '<svg viewBox="0 0 32 29"><path d="' + heartPath + '"/></svg>';
      num.appendChild(el("b", "", String(i + 1)));
      li.appendChild(num);
      li.appendChild(el("p", "reason__text", reason));
      reasonsList.appendChild(li);
    });

    // Promises
    var promisesList = $("#promises-list");
    list(C.promises).forEach(function (promise, i) {
      var li = el("li", "promise");
      li.style.setProperty("--delay", i * 0.45 + "s");
      var icon = el("span", "promise__icon", "♥");
      icon.setAttribute("aria-hidden", "true");
      li.appendChild(icon);
      li.appendChild(el("p", "", promise));
      promisesList.appendChild(li);
    });

    // Letter
    var letterBody = $("#letter-body");
    list(C.letter && C.letter.paragraphs).forEach(function (p) {
      letterBody.appendChild(el("p", "", p));
    });
  }

  /* ==========================================================================
     2. Floating hearts
     ========================================================================== */
  var HEART_CHARS = ["♥", "♥", "♥", "❤", "✦", "✧"];
  var HEART_COLORS = ["#F48FB1", "#E75480", "#F8BBD0", "#FFFFFF", "#D1B3F0"];

  function spawnFloater(container, opts) {
    if (container.childElementCount >= opts.max) return;
    var s = el("span");
    var char = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
    s.textContent = char;
    s.style.left = random(2, 96) + "%";
    s.style.fontSize = random(opts.minSize, opts.maxSize) + "px";
    s.style.color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    s.style.setProperty("--sway", random(-50, 50) + "px");
    s.style.setProperty("--o", random(0.35, opts.maxOpacity).toFixed(2));
    s.style.animationDuration = random(opts.minDur, opts.maxDur) + "s";
    if (char === "✦" || char === "✧") s.style.textShadow = "0 0 6px rgba(255,255,255,.9)";
    s.addEventListener("animationend", function () { s.remove(); });
    container.appendChild(s);
  }

  var floatTimers = {};
  function startFloaters(name, container, opts) {
    if (reduceMotion || floatTimers[name]) return;
    for (var i = 0; i < (opts.initial || 0); i++) {
      setTimeout(function () { spawnFloater(container, opts); }, i * 250);
    }
    floatTimers[name] = setInterval(function () {
      if (!document.hidden) spawnFloater(container, opts);
    }, opts.every);
  }
  function stopFloaters(name) {
    clearInterval(floatTimers[name]);
    floatTimers[name] = null;
  }

  var isSmallScreen = window.innerWidth < 640;
  var openingHearts = $(".opening__hearts");
  var pageHearts = $("#floating-hearts");

  function startOpeningHearts() {
    startFloaters("opening", openingHearts, {
      every: 450, max: 26, initial: 8,
      minSize: 14, maxSize: 32, minDur: 7, maxDur: 12, maxOpacity: 0.85,
    });
  }
  function startPageHearts() {
    startFloaters("page", pageHearts, {
      every: isSmallScreen ? 2600 : 1600, max: isSmallScreen ? 6 : 12, initial: 2,
      minSize: 10, maxSize: 22, minDur: 12, maxDur: 20, maxOpacity: 0.55,
    });
  }

  /* ==========================================================================
     3. Loader → opening surprise
     ========================================================================== */
  var loader = $("#loader");
  var opening = $("#opening");
  var gift = $("#gift");
  var openBtn = $("#open-surprise");

  function hideLoader() {
    loader.classList.add("is-done");
    loader.setAttribute("aria-hidden", "true");
    startOpeningHearts();
    setTimeout(function () { openBtn.focus({ preventScroll: true }); }, 400);
  }

  function burstFromGift() {
    var burst = $(".gift__burst", gift);
    burst.innerHTML = "";
    if (reduceMotion) return;
    var chars = ["❤", "💕", "✨", "💖", "🌸", "💗"];
    for (var i = 0; i < 16; i++) {
      var s = el("span");
      s.textContent = chars[i % chars.length];
      var angle = (Math.PI * 2 * i) / 16 + random(-0.2, 0.2);
      var dist = random(110, 220);
      s.style.setProperty("--x", Math.cos(angle) * dist + "px");
      s.style.setProperty("--y", Math.sin(angle) * dist - 60 + "px");
      s.style.setProperty("--r", random(-40, 40) + "deg");
      s.style.animationDelay = random(0, 0.15) + "s";
      burst.appendChild(s);
    }
  }

  var opened = false;
  function openSurprise() {
    if (opened) return;
    opened = true;
    openBtn.disabled = true;
    gift.classList.add("is-open");
    burstFromGift();

    setTimeout(function () {
      window.scrollTo(0, 0);
      opening.classList.add("is-hidden");
      opening.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-locked");
      document.body.classList.add("is-revealed");
      stopFloaters("opening");
      startPageHearts();
      var title = $("#apology-title");
      title.setAttribute("tabindex", "-1");
      title.focus({ preventScroll: true });
    }, reduceMotion ? 50 : 1150);
  }

  function replaySurprise() {
    closeNav();
    opened = false;
    openBtn.disabled = false;
    gift.classList.remove("is-open");
    $(".gift__burst", gift).innerHTML = "";
    opening.classList.remove("is-hidden");
    opening.removeAttribute("aria-hidden");
    document.body.classList.add("is-locked");
    document.body.classList.remove("is-revealed");
    stopFloaters("page");
    startOpeningHearts();
    // restart the entrance animations
    $$(".opening__title, .opening__subtitle, .opening__inner > .btn").forEach(function (n) {
      n.style.animation = "none";
      void n.offsetWidth;
      n.style.animation = "";
    });
    setTimeout(function () { openBtn.focus({ preventScroll: true }); }, 300);
  }

  openBtn.addEventListener("click", openSurprise);
  $("#replay-btn").addEventListener("click", replaySurprise);
  $("#replay-footer").addEventListener("click", replaySurprise);

  /* ==========================================================================
     4. Music toggle
     ========================================================================== */
  var musicBtn = $("#music-toggle");
  function syncMusicButton(isOn) {
    musicBtn.setAttribute("aria-pressed", isOn ? "true" : "false");
    musicBtn.setAttribute("aria-label", isOn ? "Pause music" : "Play music");
    musicBtn.title = isOn ? "Pause music" : "Play music";
  }
  window.LoveMusic.onChange(syncMusicButton);
  syncMusicButton(false);
  musicBtn.addEventListener("click", function () { window.LoveMusic.toggle(); });

  /* ==========================================================================
     5. Navigation
     ========================================================================== */
  var navToggle = $("#nav-toggle");
  var nav = $("#site-nav");

  function closeNav() {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }
  navToggle.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", closeNav); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { closeNav(); navToggle.focus(); }
  });
  document.addEventListener("click", function (e) {
    if (nav.classList.contains("is-open") && !e.target.closest(".site-header")) closeNav();
  });

  /* ==========================================================================
     6. Scroll-triggered animations + current nav link
     ========================================================================== */
  function setupObservers() {
    var targets = $$(".reveal, .reason, .signature, .letter");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.concat($$(".promise")).forEach(function (n) { n.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
      targets.forEach(function (n) { io.observe(n); });

      // promises appear one by one once the list comes into view
      var promiseIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            $$(".promise", entry.target).forEach(function (p) { p.classList.add("is-visible"); });
            promiseIO.disconnect();
          }
        });
      }, { threshold: 0.12 });
      promiseIO.observe($("#promises-list"));
    }

    if ("IntersectionObserver" in window) {
      var links = $$("a", nav);
      var navIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) {
            var current = a.getAttribute("href") === "#" + entry.target.id;
            a.classList.toggle("is-current", current);
            if (current) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      $$("main > section").forEach(function (s) { navIO.observe(s); });
    }
  }

  /* ==========================================================================
     7. Lightbox
     ========================================================================== */
  var lightbox = $("#lightbox");
  var lbImg = $("#lightbox-img");
  var lbCaption = $("#lightbox-caption");
  var lbIndex = 0;
  var lastFocus = null;
  var photos = list(C.photos);

  function showPhoto(i) {
    if (!photos.length) return;
    lbIndex = (i + photos.length) % photos.length;
    var p = photos[lbIndex];
    lbImg.src = p.src;
    lbImg.alt = personalize(p.alt || "");
    lbCaption.textContent = personalize(p.caption || "");
    var fig = $(".lightbox__figure", lightbox);
    fig.style.animation = "none";
    void fig.offsetWidth;
    fig.style.animation = "";
  }
  function openLightbox(i) {
    lastFocus = document.activeElement;
    showPhoto(i);
    lightbox.hidden = false;
    document.body.classList.add("is-locked");
    $("#lightbox-close").focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("is-locked");
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  $("#gallery").addEventListener("click", function (e) {
    var btn = e.target.closest(".photo");
    if (btn) openLightbox(Number(btn.dataset.index));
  });
  $("#lightbox-close").addEventListener("click", closeLightbox);
  $("#lightbox-prev").addEventListener("click", function () { showPhoto(lbIndex - 1); });
  $("#lightbox-next").addEventListener("click", function () { showPhoto(lbIndex + 1); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { e.preventDefault(); closeLightbox(); }
    else if (e.key === "ArrowLeft") showPhoto(lbIndex - 1);
    else if (e.key === "ArrowRight") showPhoto(lbIndex + 1);
    else if (e.key === "Tab") {
      // keep keyboard focus inside the lightbox
      var focusables = $$("button", lightbox);
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // swipe on phones
  var touchX = null;
  lightbox.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showPhoto(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ==========================================================================
     8. The question
     ========================================================================== */
  var response = $("#question-response");
  var btnForgive = $("#btn-forgive");
  var btnTime = $("#btn-time");
  var Q = C.question || {};

  function setSelected(btn) {
    [btnForgive, btnTime].forEach(function (b) {
      b.classList.toggle("is-selected", b === btn);
      b.setAttribute("aria-pressed", b === btn ? "true" : "false");
    });
  }

  btnForgive.addEventListener("click", function () {
    setSelected(btnForgive);
    response.innerHTML = "";
    var emoji = el("span", "response-emoji", "💖");
    emoji.setAttribute("aria-hidden", "true");
    response.appendChild(emoji);
    response.appendChild(el("h3", "", Q.forgiveTitle));
    response.appendChild(el("p", "", Q.forgiveMessage));
    celebrate();
  });

  btnTime.addEventListener("click", function () {
    setSelected(btnTime);
    stopCelebration(); // no confetti over a "please give me time" moment
    response.innerHTML = "";
    var emoji = el("span", "response-emoji", "🤍");
    emoji.setAttribute("aria-hidden", "true");
    response.appendChild(emoji);
    response.appendChild(el("p", "", Q.timeMessage));
  });

  // sparkles in the dreamy background
  (function addSparkles() {
    var holder = $(".question__sparkles");
    var count = isSmallScreen ? 14 : 26;
    for (var i = 0; i < count; i++) {
      var s = el("span", "sparkle");
      s.textContent = i % 3 ? "✦" : "✧";
      s.style.left = random(2, 98) + "%";
      s.style.top = random(2, 98) + "%";
      s.style.fontSize = random(8, 18) + "px";
      s.style.animationDelay = random(0, 3) + "s";
      s.style.animationDuration = random(2.2, 4) + "s";
      holder.appendChild(s);
    }
  })();

  /* ----- Heart explosion + confetti + flowers ----- */
  var canvas = $("#celebration");
  var ctx2d = canvas.getContext("2d");
  var particles = [];
  var rafId = null;

  function resizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawHeart(ctx, size) {
    var s = size / 32;
    ctx.beginPath();
    ctx.moveTo(0, 8 * s);
    ctx.bezierCurveTo(0, -4 * s, -16 * s, -4 * s, -16 * s, 6 * s);
    ctx.bezierCurveTo(-16 * s, 14 * s, -6 * s, 20 * s, 0, 26 * s);
    ctx.bezierCurveTo(6 * s, 20 * s, 16 * s, 14 * s, 16 * s, 6 * s);
    ctx.bezierCurveTo(16 * s, -4 * s, 0, -4 * s, 0, 8 * s);
    ctx.closePath();
    ctx.fill();
  }

  function celebrate() {
    if (reduceMotion) return;
    resizeCanvas();
    var w = window.innerWidth;
    var h = window.innerHeight;
    var rect = btnForgive.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    if (cy < 0 || cy > h) { cx = w / 2; cy = h / 2; }

    var colors = ["#E75480", "#F48FB1", "#FCE4EC", "#FFFFFF", "#D1B3F0", "#FFC1D6", "#FF8FAB"];
    var flowers = ["🌸", "🌷", "🌺", "💐", "💖", "💕"];
    var amount = isSmallScreen ? 90 : 160;

    // heart explosion from the button
    for (var i = 0; i < amount; i++) {
      var a = random(0, Math.PI * 2);
      var speed = random(4, 13);
      var kind = i % 5 === 0 ? "flower" : i % 2 ? "heart" : "confetti";
      particles.push({
        kind: kind,
        x: cx, y: cy,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed - random(3, 7),
        size: kind === "flower" ? random(18, 30) : kind === "heart" ? random(12, 26) : random(6, 11),
        color: colors[Math.floor(Math.random() * colors.length)],
        glyph: flowers[Math.floor(Math.random() * flowers.length)],
        rot: random(0, Math.PI * 2),
        vr: random(-0.15, 0.15),
        life: 0,
        maxLife: random(110, 190),
      });
    }
    // gentle confetti rain from the top
    for (var j = 0; j < amount / 2; j++) {
      particles.push({
        kind: j % 4 === 0 ? "flower" : "confetti",
        x: random(0, w), y: random(-h * 0.6, -10),
        vx: random(-1, 1), vy: random(1.5, 3.5),
        size: j % 4 === 0 ? random(16, 26) : random(6, 10),
        color: colors[Math.floor(Math.random() * colors.length)],
        glyph: flowers[Math.floor(Math.random() * flowers.length)],
        rot: random(0, Math.PI * 2), vr: random(-0.1, 0.1),
        life: 0, maxLife: random(220, 320),
      });
    }
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function tick() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    ctx2d.clearRect(0, 0, w, h);
    particles = particles.filter(function (p) { return p.life < p.maxLife && p.y < h + 60; });

    particles.forEach(function (p) {
      p.life++;
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 0.16;
      p.x += p.vx + Math.sin(p.life / 12) * 0.4;
      p.y += p.vy;
      p.rot += p.vr;
      var fade = Math.min(1, (p.maxLife - p.life) / 40);

      ctx2d.save();
      ctx2d.globalAlpha = Math.max(fade, 0);
      ctx2d.translate(p.x, p.y);
      ctx2d.rotate(p.rot);
      ctx2d.fillStyle = p.color;
      if (p.kind === "heart") {
        drawHeart(ctx2d, p.size);
      } else if (p.kind === "flower") {
        ctx2d.font = p.size + "px serif";
        ctx2d.textAlign = "center";
        ctx2d.textBaseline = "middle";
        ctx2d.fillText(p.glyph, 0, 0);
      } else {
        ctx2d.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      ctx2d.restore();
    });

    if (particles.length) {
      rafId = requestAnimationFrame(tick);
    } else {
      ctx2d.clearRect(0, 0, w, h);
      rafId = null;
    }
  }
  window.addEventListener("resize", function () { if (rafId) resizeCanvas(); });

  function stopCelebration() {
    particles = [];
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
  }

  /* ==========================================================================
     9. Cute cursor (desktop only)
     ========================================================================== */
  function setupCursor() {
    if (!finePointer || reduceMotion) return;
    var ring = $("#cursor-heart");
    var x = -100, y = -100, rx = -100, ry = -100;
    var lastTrail = 0, lastTx = 0, lastTy = 0;

    document.addEventListener("mousemove", function (e) {
      x = e.clientX; y = e.clientY;
      ring.classList.add("is-active");
      var now = performance.now();
      var moved = Math.abs(x - lastTx) + Math.abs(y - lastTy);
      if (now - lastTrail > 90 && moved > 40 && document.body.classList.contains("is-revealed")) {
        lastTrail = now; lastTx = x; lastTy = y;
        var t = el("span", "cursor-trail");
        t.textContent = "♥";
        t.setAttribute("aria-hidden", "true");
        t.style.left = x + "px";
        t.style.top = y + "px";
        t.addEventListener("animationend", function () { t.remove(); });
        document.body.appendChild(t);
      }
    }, { passive: true });
    document.addEventListener("mouseleave", function () { ring.classList.remove("is-active"); });
    document.addEventListener("mouseover", function (e) {
      ring.classList.toggle("is-hovering", !!e.target.closest("a, button, label, .photo"));
    });

    (function follow() {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      requestAnimationFrame(follow);
    })();
  }

  /* ==========================================================================
     Start
     ========================================================================== */
  renderContent();
  setupObservers();
  setupCursor();
  window.LoveMusic.autoplay(); // plays right away, or on her first tap if the browser blocks sound

  var started = Date.now();
  var loaded = false;
  function finishLoading() {
    if (loaded) return;
    loaded = true;
    var wait = Math.max(0, 1200 - (Date.now() - started));
    setTimeout(hideLoader, reduceMotion ? 0 : wait);
  }
  if (document.readyState === "complete") finishLoading();
  else window.addEventListener("load", finishLoading);
  setTimeout(finishLoading, 4000); // never keep her waiting on a slow connection
})();
