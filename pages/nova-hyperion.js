(() => {
  const pointerGlow = document.getElementById('pointerGlow');
  const canvas = document.getElementById('fx-canvas');
  const ctx = canvas.getContext('2d');

  const resize = () => {
    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 72 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r: Math.random() * 1.9 + 0.6
  }));

  const drawParticles = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = window.innerWidth + 20;
      if (p.x > window.innerWidth + 20) p.x = -20;
      if (p.y < -20) p.y = window.innerHeight + 20;
      if (p.y > window.innerHeight + 20) p.y = -20;

      ctx.beginPath();
      ctx.fillStyle = 'rgba(6, 94, 255, 0.36)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 132) {
          const a = 1 - dist / 132;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 142, 255, ${a * 0.18})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  };

  drawParticles();

  window.addEventListener('pointermove', (e) => {
    if (!pointerGlow) return;
    pointerGlow.style.left = `${e.clientX}px`;
    pointerGlow.style.top = `${e.clientY}px`;
  });

  const revealItems = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.12 });
  revealItems.forEach((el) => io.observe(el));

  const counters = document.querySelectorAll('.metric-num[data-target]');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.getAttribute('data-target') || '0');
      const start = performance.now();
      const duration = 1300;

      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(target * eased).toLocaleString();
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => counterObserver.observe(c));

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * 6;
      const ry = (px - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });
})();
