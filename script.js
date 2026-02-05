// ===== Year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Drawer =====
const openDrawer = document.getElementById("openDrawer");
const closeDrawer = document.getElementById("closeDrawer");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");

function setDrawer(open) {
  if (open) {
    drawer.classList.add("isOpen");
    drawer.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  } else {
    drawer.classList.remove("isOpen");
    drawer.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    document.body.style.overflow = "";
  }
}
openDrawer.addEventListener("click", () => setDrawer(true));
closeDrawer.addEventListener("click", () => setDrawer(false));
overlay.addEventListener("click", () => setDrawer(false));
drawer.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (a && a.getAttribute("href")?.startsWith("#")) setDrawer(false);
});

// ===== Smooth scroll =====
document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;
  const href = a.getAttribute("href");
  if (!href || !href.startsWith("#")) return;

  const el = document.querySelector(href);
  if (!el) return;

  e.preventDefault();
  el.scrollIntoView({ behavior: "smooth", block: "start" });
});

// ===== Chat widget =====
const chatFab = document.getElementById("chatFab");
const chatCard = document.getElementById("chatCard");
const chatClose = document.getElementById("chatClose");
chatFab.addEventListener("click", () => (chatCard.hidden = !chatCard.hidden));
chatClose.addEventListener("click", () => (chatCard.hidden = true));

// ===== Toast =====
const toast = document.getElementById("toast");
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.hidden = true), 3000);
}

// ===== Contact form demo =====
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("Message sent (demo). I can connect this form to WhatsApp/Email later.");
  e.target.reset();
});

// ===============================
// Scroll reveal animations
// ===============================
const revealTargets = document.querySelectorAll(
  ".hero__content, .hero__right, .about__imageWrap, .about__content, .card, .service, .faqBox, .contact__grid, .sectionTitle"
);
revealTargets.forEach(el => el.classList.add("reveal"));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => io.observe(el));

// ===============================
// Project card tilt + hover glow
// ===============================
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    card.style.setProperty("--mx", `${(x / r.width) * 100}%`);
    card.style.setProperty("--my", `${(y / r.height) * 100}%`);

    const rotateY = ((x / r.width) - 0.5) * 12;
    const rotateX = ((y / r.height) - 0.5) * -10;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "50%");
  });
});

// ===============================
// Nebula mouse effect (SUBTLE)
// ===============================
(() => {
  const canvas = document.getElementById("nebula");
  const ctx = canvas.getContext("2d", { alpha: true });

  let w = 0, h = 0, dpr = Math.max(1, window.devicePixelRatio || 1);

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    dpr = Math.max(1, window.devicePixelRatio || 1);

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  const mouse = { x: w * 0.5, y: h * 0.5 };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Less particles + smaller radius = less aggressive
  const COUNT = 10;
  const particles = Array.from({ length: COUNT }, (_, i) => ({
    x: mouse.x,
    y: mouse.y,
    vx: 0,
    vy: 0,
    r: 46 - i * 2.2,
    hueOffset: i * 12
  }));

  function drawBlob(x, y, r, hue, alpha) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `hsla(${hue}, 90%, 62%, ${alpha})`);
    g.addColorStop(0.55, `hsla(${hue + 28}, 90%, 58%, ${alpha * 0.45})`);
    g.addColorStop(1, `hsla(${hue + 55}, 90%, 52%, 0)`);
    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  let t = 0;

  function animate() {
    t += 0.010;

    // faster fade => shorter trail (less aggressive)
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(5,6,18,0.18)";
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "lighter";

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const target = (i === 0) ? mouse : particles[i - 1];

      const spring = 0.14 - i * 0.004;
      const friction = 0.82 + i * 0.01;

      const dx = target.x - p.x;
      const dy = target.y - p.y;

      p.vx += dx * spring;
      p.vy += dy * spring;

      p.vx *= friction;
      p.vy *= friction;

      p.x += p.vx;
      p.y += p.vy;

      // slower hue shift
      const hue = (t * 140 + p.hueOffset) % 360;

      // lower intensity
      const alpha = 0.10 * (1 - i / particles.length);

      drawBlob(p.x, p.y, p.r, hue, alpha);
    }

    requestAnimationFrame(animate);
  }

  ctx.clearRect(0, 0, w, h);
  animate();
})();

// ===============================
// Shooting star every 10–20 sec
// ===============================
(() => {
  const canvas = document.getElementById("shootingStars");
  const ctx = canvas.getContext("2d", { alpha: true });

  let w = 0, h = 0, dpr = Math.max(1, window.devicePixelRatio || 1);

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    dpr = Math.max(1, window.devicePixelRatio || 1);

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  const stars = [];
  function rand(min, max){ return Math.random() * (max - min) + min; }

  function scheduleNext(){
    const next = rand(10, 20) * 1000;
    setTimeout(spawnStar, next);
  }

  function spawnStar(){
    const startX = rand(-w * 0.2, w * 0.8);
    const startY = rand(-h * 0.2, h * 0.4);

    const angle = rand(0.72, 0.95);
    const speed = rand(900, 1300);
    const life = rand(0.8, 1.2);

    stars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      t: 0,
      life,
      len: rand(220, 340)
    });

    scheduleNext();
  }
  scheduleNext();

  let last = performance.now();
  function animate(now){
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;

    ctx.clearRect(0, 0, w, h);

    for (let i = stars.length - 1; i >= 0; i--) {
      const s = stars[i];
      s.t += dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;

      const p = Math.min(1, s.t / s.life);
      const alpha = (1 - p) * 0.9;

      const mag = Math.hypot(s.vx, s.vy);
      const tx = s.x - (s.vx / mag) * s.len;
      const ty = s.y - (s.vy / mag) * s.len;

      const g = ctx.createLinearGradient(s.x, s.y, tx, ty);
      g.addColorStop(0, `rgba(255,255,255,${alpha})`);
      g.addColorStop(0.35, `rgba(255,220,120,${alpha * 0.65})`);
      g.addColorStop(1, `rgba(255,255,255,0)`);

      ctx.strokeStyle = g;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.6, 0, Math.PI * 2);
      ctx.fill();

      if (s.t >= s.life) stars.splice(i, 1);
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
