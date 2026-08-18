// ── Login style switcher ──────────────────────────────
// Variants: split (default) · spotlight · cinematic · midnight
// Persists in localStorage "lh-login-style"; video src is only
// attached while the Cinematic variant is active.
(function () {
  var VIDEO_SRC = "https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4";
  // Marsh-only cinematic background video (user-supplied). Other brands keep VIDEO_SRC.
  var MARSH_VIDEO_SRC = "images/marsh-cinematic.mp4";
  function cinematicSrc() {
    var b = (window.LHBrand && window.LHBrand.current && window.LHBrand.current()) || "marsh";
    return b === "marsh" ? MARSH_VIDEO_SRC : VIDEO_SRC;
  }
  var VIDEO_POSTER = "https://images.pexels.com/videos/3571264/free-video-3571264.jpg?w=1600";
  // Marsh cinematic still (shown before/if the video loads) — on-brand building.
  var MARSH_VIDEO_POSTER = "images/marsh-login.jpg";
  function cinematicPoster() {
    var b = (window.LHBrand && window.LHBrand.current && window.LHBrand.current()) || "marsh";
    return b === "marsh" ? MARSH_VIDEO_POSTER : VIDEO_POSTER;
  }
  // Aura: golden particles (Pexels 7670836) — try HD first, then the confirmed
  // UHD file, then fall back to the cyan plexus network (3129671).
  var AURA_SRCS = [
    "https://videos.pexels.com/video-files/7670836/7670836-hd_1920_1080_30fps.mp4",
    "https://videos.pexels.com/video-files/7670836/7670836-uhd_2560_1440_30fps.mp4",
    "https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_30fps.mp4"
  ];
  var AURA_POSTER = "https://images.pexels.com/videos/7670836/pexels-photo-7670836.jpeg?auto=compress&cs=tinysrgb&w=1400";
  var auraIdx = 0, currentStyle = "split", auraTimer = null;
  function armAuraStall() {
    clearTimeout(auraTimer);
    auraTimer = setTimeout(function () {
      if (currentStyle === "aura" && video.readyState < 2 && auraIdx < AURA_SRCS.length - 1) {
        auraIdx++;
        video.setAttribute("src", AURA_SRCS[auraIdx]);
        var p = video.play(); if (p && p.catch) p.catch(function () {});
        armAuraStall();
      }
    }, 8000);
  }
  var root = document.documentElement;
  var sw = document.getElementById("lg-style-switch");
  var chipLabel = document.getElementById("lg-style-label");
  var video = document.getElementById("lg-video");
  var items = Array.prototype.slice.call(sw.querySelectorAll(".lg-style-item"));

  // ── Neural constellation (Celestial) ─────────────────
  // Drifting star-nodes linked into a network; bright pulses
  // travel along links — "the AI at work" ambient layer.
  var neural = (function () {
    var canvas = document.getElementById("lg-neural");
    var ctx = canvas.getContext("2d");
    var raf = null, nodes = [], pulses = [], W = 0, H = 0;
    var LINK = 150, MOUSE_LINK = 180;
    var mouse = { x: -9999, y: -9999 };

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      nodes = [];
      var n = Math.min(90, Math.round((W * H) / 13000));
      for (var i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * .38, vy: (Math.random() - .5) * .38,
          r: 1 + Math.random() * 1.4, tw: Math.random() * Math.PI * 2
        });
      }
      pulses = [];
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      var i, j, a, b, d2;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        // gentle pull toward the cursor so the network follows the mouse
        var mdx = mouse.x - a.x, mdy = mouse.y - a.y;
        var md2 = mdx * mdx + mdy * mdy;
        if (md2 < 220 * 220) { a.vx += mdx * .00012; a.vy += mdy * .00012; }
        var sp = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
        if (sp > .8) { a.vx = a.vx / sp * .8; a.vy = a.vy / sp * .8; }
        a.x += a.vx; a.y += a.vy; a.tw += .045;
        if (a.x < -10) a.x = W + 10; if (a.x > W + 10) a.x = -10;
        if (a.y < -10) a.y = H + 10; if (a.y > H + 10) a.y = -10;
      }
      // links
      for (i = 0; i < nodes.length; i++) {
        for (j = i + 1; j < nodes.length; j++) {
          a = nodes[i]; b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            var al = (1 - Math.sqrt(d2) / LINK) * .34;
            ctx.strokeStyle = "rgba(206,236,255," + al.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      // links to the cursor — the network reaches toward the mouse
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        var cdx = a.x - mouse.x, cdy = a.y - mouse.y;
        var cd2 = cdx * cdx + cdy * cdy;
        if (cd2 < MOUSE_LINK * MOUSE_LINK) {
          var cal = (1 - Math.sqrt(cd2) / MOUSE_LINK) * .5;
          ctx.strokeStyle = "rgba(255,255,255," + cal.toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      // nodes
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        var glow = .55 + Math.sin(a.tw) * .35;
        ctx.fillStyle = "rgba(206,236,255," + glow.toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      // spawn pulses
      if (pulses.length < 7 && Math.random() < .045) {
        var tries = 0;
        while (tries++ < 12) {
          i = (Math.random() * nodes.length) | 0; j = (Math.random() * nodes.length) | 0;
          if (i === j) continue;
          a = nodes[i]; b = nodes[j];
          var ddx = a.x - b.x, ddy = a.y - b.y;
          if (ddx * ddx + ddy * ddy < LINK * LINK * .85) { pulses.push({ a: nodes[i], b: nodes[j], t: 0 }); break; }
        }
      }
      // cursor sparks — activity radiates from where the mouse is
      if (mouse.x > -999 && pulses.length < 9 && Math.random() < .07) {
        var best = null, bd = MOUSE_LINK * MOUSE_LINK;
        for (i = 0; i < nodes.length; i++) {
          var sdx = nodes[i].x - mouse.x, sdy = nodes[i].y - mouse.y;
          var sd2 = sdx * sdx + sdy * sdy;
          if (sd2 < bd && Math.random() < .5) { best = nodes[i]; bd = sd2; }
        }
        if (best) pulses.push({ a: { x: mouse.x, y: mouse.y }, b: best, t: 0 });
      }
      // draw pulses
      for (i = pulses.length - 1; i >= 0; i--) {
        var p = pulses[i]; p.t += .026;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }
        var px = p.a.x + (p.b.x - p.a.x) * p.t;
        var py = p.a.y + (p.b.y - p.a.y) * p.t;
        var fade = Math.sin(p.t * Math.PI);
        ctx.fillStyle = "rgba(255,255,255," + (.9 * fade).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,191,0," + (.35 * fade).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (raf !== null) return;
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      resize(); seed();
      window.addEventListener("resize", onResize);
      window.addEventListener("mousemove", onMouse);
      window.addEventListener("mouseout", onMouseOut);
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseout", onMouseOut);
      ctx.clearRect(0, 0, W, H);
    }
    function onResize() { resize(); seed(); }
    function onMouse(e) { mouse.x = e.clientX; mouse.y = e.clientY; }
    function onMouseOut(e) { if (!e.relatedTarget) { mouse.x = -9999; mouse.y = -9999; } }
    return { start: start, stop: stop };
  })();

  // ── Live dashboard preview inside the Showcase ghost window ──
  var deskFrame = (function () {
    var wrap = null, frame = null, wired = false;
    function fit() {
      if (!wrap || !frame) return;
      var w = wrap.clientWidth;
      if (w > 0) frame.style.transform = "scale(" + (w / 1280) + ")";
    }
    function activate() {
      wrap = wrap || document.querySelector(".lg-dk-shot-wrap");
      if (!wrap) return;
      frame = frame || wrap.querySelector(".lg-dk-frame");
      if (frame && !frame.getAttribute("src")) {
        frame.addEventListener("load", function () {
          try {
            var d = frame.contentDocument;
            var st = d.createElement("style");
            st.textContent = ".lh-back,.lh-tweak-fab,.lh-brand-switch{display:none!important}";
            d.head.appendChild(st);
          } catch (e) {}
          fit();
        });
        frame.setAttribute("src", frame.dataset.src);
      }
      if (!wired) { wired = true; window.addEventListener("resize", fit); }
      // fit after layout settles (panel becomes visible on variant switch)
      requestAnimationFrame(fit);
      setTimeout(fit, 250);
    }
    return { activate: activate };
  })();

  // ── Aura cursor parallax: the video drifts with the mouse ──
  var auraParallax = (function () {
    var feature = null, wired = false;
    function onMove(e) {
      if (currentStyle !== "aura" || !feature) return;
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      var r = feature.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - .5;
      var ny = (e.clientY - r.top) / r.height - .5;
      /* drift opposite the cursor — feels like depth */
      video.style.transform = "scale(1.12) translate(" + (nx * -4.5).toFixed(3) + "%, " + (ny * -4.5).toFixed(3) + "%)";
    }
    function onLeave() {
      if (currentStyle === "aura") video.style.transform = "scale(1.12)";
    }
    function start() {
      feature = feature || document.querySelector(".lg-feature");
      if (!wired && feature) {
        wired = true;
        feature.addEventListener("mousemove", onMove);
        feature.addEventListener("mouseleave", onLeave);
      }
    }
    function stop() { video.style.transform = ""; }
    return { start: start, stop: stop };
  })();

  function apply(style) {
    if (style === "split") root.removeAttribute("data-login-style");
    else root.setAttribute("data-login-style", style);
    try { localStorage.setItem("lh-login-style", style); } catch (e) {}
    items.forEach(function (b) {
      b.setAttribute("aria-checked", b.dataset.style === style ? "true" : "false");
      if (b.dataset.style === style) chipLabel.textContent = b.firstChild.textContent.trim();
    });
    currentStyle = style;
    if (style === "cinematic" || style === "aura") {
      var src = style === "aura" ? AURA_SRCS[auraIdx] : cinematicSrc();
      var poster = style === "aura" ? AURA_POSTER : cinematicPoster();
      if (video.getAttribute("src") !== src) {
        video.pause();
        video.setAttribute("poster", poster);
        video.setAttribute("src", src);
      }
      var p = video.play(); if (p && p.catch) p.catch(function () {});
      if (style === "aura") armAuraStall();
    } else if (!video.paused) {
      video.pause();
    }
    if (style === "celestial") neural.start(); else neural.stop();
    if (style === "showcase") deskFrame.activate();
    if (style === "aura") auraParallax.start(); else auraParallax.stop();
  }

  video.addEventListener("playing", function () { clearTimeout(auraTimer); });
  video.addEventListener("error", function () {
    if (currentStyle === "aura" && auraIdx < AURA_SRCS.length - 1) {
      auraIdx++;
      video.setAttribute("src", AURA_SRCS[auraIdx]);
      var p = video.play(); if (p && p.catch) p.catch(function () {});
    }
  });

  var saved = "split";
  try { saved = localStorage.getItem("lh-login-style") || "split"; } catch (e) {}
  if (!items.some(function (b) { return b.dataset.style === saved; })) saved = "split";
  apply(saved);

  sw.querySelector(".lg-style-chip").addEventListener("click", function (e) {
    e.stopPropagation(); sw.classList.toggle("open");
  });
  items.forEach(function (b) {
    b.addEventListener("click", function () { apply(b.dataset.style); sw.classList.remove("open"); });
  });
  document.addEventListener("click", function (e) {
    if (!sw.contains(e.target)) sw.classList.remove("open");
  });

  // Re-apply when the client brand changes so the cinematic background swaps
  // between the Marsh video and the default for other brands.
  window.addEventListener("lh-brand-change", function () {
    if (currentStyle === "cinematic") apply("cinematic");
  });
})();
