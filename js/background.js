/* ══════════════════════════════════════════
   Animated background — login aurora + app orbs
   Three modes: 'login' | 'transitioning' | 'app'
══════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  /* ── State ───────────────────────────────── */
  let mode = 'login'; // 'login' | 'app'

  let time  = 0;
  let last  = 0;
  let rafId = null;
  let mx = 0.5, my = 0.5;

  /* ── Login orbs (vibrant, colourful) ─────── */
  const loginOrbs = [
    { hue: 245, sat: 90, lit: 65, alpha: 0.38, size: 0.72, x: 0.12, y: 0.18, vx:  0.00014, vy:  0.00009, phase: 0.0 },
    { hue: 275, sat: 85, lit: 62, alpha: 0.32, size: 0.62, x: 0.82, y: 0.72, vx: -0.00011, vy: -0.00013, phase: 1.3 },
    { hue: 205, sat: 90, lit: 68, alpha: 0.28, size: 0.50, x: 0.48, y: 0.88, vx:  0.00009, vy: -0.00007, phase: 2.5 },
    { hue: 300, sat: 80, lit: 60, alpha: 0.26, size: 0.42, x: 0.88, y: 0.16, vx: -0.00013, vy:  0.00011, phase: 0.9 },
    { hue: 175, sat: 85, lit: 65, alpha: 0.22, size: 0.38, x: 0.26, y: 0.56, vx:  0.00010, vy:  0.00015, phase: 1.9 },
    { hue: 330, sat: 85, lit: 62, alpha: 0.20, size: 0.30, x: 0.62, y: 0.32, vx: -0.00008, vy:  0.00012, phase: 3.1 },
    { hue:  45, sat: 80, lit: 60, alpha: 0.15, size: 0.24, x: 0.38, y: 0.08, vx:  0.00012, vy:  0.00007, phase: 0.6 },
  ];

  /* ── Floating particles (login only) ─────── */
  const particles = Array.from({ length: 95 }, () => ({
    x:           Math.random(),
    y:           Math.random(),
    size:        0.7 + Math.random() * 2.2,
    baseOpacity: 0.12 + Math.random() * 0.52,
    vy:          -(0.000038 + Math.random() * 0.000072),
    vx:          (Math.random() - 0.5) * 0.000024,
    hue:         190 + Math.random() * 140,
    twPhase:     Math.random() * Math.PI * 2,
    twSpeed:     0.0008 + Math.random() * 0.0018,
  }));

  /* ── Resize ──────────────────────────────── */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    // Redraw static frame immediately if animation is stopped
    if (rafId === null) {
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
  window.addEventListener('resize', resize);
  resize();

  /* ── Mouse parallax ──────────────────────── */
  window.addEventListener('mousemove', e => {
    mx = e.clientX / window.innerWidth;
    my = e.clientY / window.innerHeight;
  });

  /* ── Public API (called from app.js) ─────── */
  window.bgSetAppMode = () => {
    mode = 'app';
    // Stop the animation loop and paint one static dark frame
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  window.bgSetLoginMode = () => {
    mode = 'login';
    // Restart the animation loop
    if (rafId === null) {
      rafId = requestAnimationFrame(ts => { last = ts; rafId = requestAnimationFrame(frame); });
    }
  };

  /* ══════════════════════════════════════════
     Shared utilities
  ══════════════════════════════════════════ */
  function moveOrb(orb, dt) {
    orb.x += orb.vx * dt;
    orb.y += orb.vy * dt;
    if (orb.x < 0 || orb.x > 1) orb.vx *= -1;
    if (orb.y < 0 || orb.y > 1) orb.vy *= -1;
    orb.x = Math.max(0, Math.min(1, orb.x));
    orb.y = Math.max(0, Math.min(1, orb.y));
  }

  function vignette(W, H, inner, outer, stop) {
    const g = ctx.createRadialGradient(W/2, H/2, inner, W/2, H/2, outer);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, stop);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  /* ══════════════════════════════════════════
     LOGIN DRAW — vibrant aurora
  ══════════════════════════════════════════ */
  function drawLogin(W, H, dt) {
    // Deep dark base with blue-purple tint
    ctx.fillStyle = '#04040d';
    ctx.fillRect(0, 0, W, H);

    // Slowly shifting ambient sweep
    const t = time * 0.00024;
    const sweep = ctx.createLinearGradient(0, 0, W, H);
    sweep.addColorStop(0,   `hsla(${240 + Math.sin(t)        * 13}, 55%, 7%, 1)`);
    sweep.addColorStop(0.5, `hsla(${265 + Math.cos(t * 0.68) * 19}, 50%, 5%, 1)`);
    sweep.addColorStop(1,   `hsla(${220 + Math.sin(t * 0.52) * 10}, 48%, 6%, 1)`);
    ctx.fillStyle = sweep;
    ctx.fillRect(0, 0, W, H);

    // Vibrant orbs with breathing
    loginOrbs.forEach((orb, i) => {
      moveOrb(orb, dt);

      const breathe = 1 + 0.07 * Math.sin(time * 0.0009 + orb.phase);
      const depth   = 0.018 + (i % 3) * 0.009;
      const px = (mx - 0.5) * depth * (i % 2 === 0 ? 1 : -1);
      const py = (my - 0.5) * depth * (i % 2 === 0 ? 1 : -1);

      const cx = (orb.x + px) * W;
      const cy = (orb.y + py) * H;
      const r  = orb.size * breathe * Math.min(W, H);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0,    `hsla(${orb.hue}, ${orb.sat}%,      ${orb.lit}%,     ${orb.alpha})`);
      grad.addColorStop(0.38, `hsla(${orb.hue}, ${orb.sat - 10}%, ${orb.lit - 8}%, ${orb.alpha * 0.44})`);
      grad.addColorStop(1,    `hsla(${orb.hue}, 55%, 35%, 0)`);

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    // Floating particles / stars
    particles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
      if (p.x < 0 || p.x > 1) p.vx *= -1;

      const twinkle = 0.5 + 0.5 * Math.sin(time * p.twSpeed + p.twPhase);
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 78%, ${p.baseOpacity * twinkle})`;
      ctx.fill();
    });

    // Deep vignette to keep edges dramatic
    vignette(W, H, H * 0.17, H * 0.82, 'rgba(4,4,13,0.80)');
  }

  /* ══════════════════════════════════════════
     MAIN LOOP
  ══════════════════════════════════════════ */
  function frame(ts) {
    const dt = Math.min(ts - last, 32);
    last = ts;
    time += dt;

    const W = canvas.width, H = canvas.height;

    drawLogin(W, H, dt);

    rafId = requestAnimationFrame(frame);
  }

  rafId = requestAnimationFrame(ts => { last = ts; rafId = requestAnimationFrame(frame); });
})();