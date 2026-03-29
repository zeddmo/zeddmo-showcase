(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;

  let aura = document.getElementById('cursorAura');
  if (!aura) {
    aura = document.createElement('div');
    aura.id = 'cursorAura';
    aura.className = 'cursor-aura';
    body.appendChild(aura);
  }

  let canvas = document.getElementById('mesh');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'mesh';
    body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  const meshRgb = (getComputedStyle(body).getPropertyValue('--mesh-rgb') || '125, 217, 255').trim();

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
    const dots = Array.from({ length: Math.min(92, Math.max(55, Math.floor(window.innerWidth / 18))) }, () => ({
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
        ctx.fillStyle = `rgba(${meshRgb}, 0.5)`;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < dots.length; j++) {
          const n = dots[j];
          const dist = Math.hypot(d.x - n.x, d.y - n.y);
          if (dist < 128) {
            const alpha = (1 - dist / 128) * 0.2;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${meshRgb}, ${alpha})`;
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

    window.addEventListener('pointermove', (event) => {
      aura.style.left = `${event.clientX}px`;
      aura.style.top = `${event.clientY}px`;
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.14 });
    reveals.forEach((node) => observer.observe(node));
  }

  const counters = document.querySelectorAll('.kpi-value[data-target]');
  if (counters.length) {
    const observer = new IntersectionObserver((entries, parent) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const node = entry.target;
        const target = Number(node.dataset.target || 0);
        const begin = performance.now();
        const duration = 1300;

        const tick = (now) => {
          const t = Math.min((now - begin) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          node.textContent = Math.floor(target * eased).toLocaleString();
          if (t < 1) {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
        parent.unobserve(node);
      });
    }, { threshold: 0.35 });

    counters.forEach((node) => observer.observe(node));
  }

  if (!reducedMotion) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * 7;
        const ry = (x - 0.5) * 9;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }
})();
