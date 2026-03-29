(() => {
  const aura = document.getElementById('cursorAura');
  const canvas = document.getElementById('mesh');
  const ctx = canvas.getContext('2d');

  const resize = () => {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener('resize', resize);

  const dots = Array.from({ length: 85 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.8 + 0.4
  }));

  const draw = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      d.x += d.vx;
      d.y += d.vy;

      if (d.x < -20) d.x = window.innerWidth + 20;
      if (d.x > window.innerWidth + 20) d.x = -20;
      if (d.y < -20) d.y = window.innerHeight + 20;
      if (d.y > window.innerHeight + 20) d.y = -20;

      ctx.beginPath();
      ctx.fillStyle = 'rgba(130, 175, 255, 0.55)';
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < dots.length; j++) {
        const n = dots[j];
        const dx = d.x - n.x;
        const dy = d.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.22;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(95, 170, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  };

  draw();

  window.addEventListener('pointermove', (e) => {
    aura.style.left = `${e.clientX}px`;
    aura.style.top = `${e.clientY}px`;
  });

  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.14 });
  reveals.forEach((el) => io.observe(el));

  const nums = document.querySelectorAll('.kpi-value[data-target]');
  const nObs = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const start = performance.now();
      const duration = 1200;

      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(target * ease).toLocaleString();
        if (t < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach((n) => nObs.observe(n));

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = (0.5 - y) * 7;
      const ry = (x - 0.5) * 8;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  });
})();
