(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.getElementById('cvMesh');
  const ctx = canvas.getContext('2d');

  const fit = () => {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  fit();
  window.addEventListener('resize', fit);

  if (!reducedMotion) {
    const points = Array.from({ length: Math.min(90, Math.max(54, Math.floor(window.innerWidth / 18))) }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.9 + 0.4
    }));

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = window.innerWidth + 20;
        if (p.x > window.innerWidth + 20) p.x = -20;
        if (p.y < -20) p.y = window.innerHeight + 20;
        if (p.y > window.innerHeight + 20) p.y = -20;

        ctx.beginPath();
        ctx.fillStyle = 'rgba(99, 216, 255, 0.5)';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < points.length; j++) {
          const n = points[j];
          const dist = Math.hypot(p.x - n.x, p.y - n.y);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(79, 255, 207, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();
  }

  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.16 });
    reveals.forEach((node) => io.observe(node));
  }

  const numbers = document.querySelectorAll('.metric-value[data-target]');
  if (numbers.length) {
    const obs = new IntersectionObserver((entries, parent) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.dataset.target || 0);
        const start = performance.now();
        const duration = 1200;

        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.floor(target * ease).toLocaleString();
          if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        parent.unobserve(el);
      });
    }, { threshold: 0.45 });

    numbers.forEach((el) => obs.observe(el));
  }

  if (!reducedMotion) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * 6;
        const ry = (x - 0.5) * 8;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      });
    });

    document.querySelectorAll('.magnetic').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
      });
      button.addEventListener('pointerleave', () => {
        button.style.transform = 'translate(0, 0)';
      });
    });
  }
})();
