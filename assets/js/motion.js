/* =========================================================
   motion.js — efectos modernos estilo 21st.dev en HTML/CSS/JS
   - Spotlight en tarjetas (brillo que sigue al cursor)
   - Tilt 3D en tarjetas de la portada y canvas del hero
   - Contadores animados (count-up) en el hero
   - Marquee infinito (cinta de temas)
   No depende de ninguna librería.
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  /* ---------- Spotlight en tarjetas ---------- */
  const spotlightEls = document.querySelectorAll('.card-vec');
  if (!reduced && canHover && spotlightEls.length) {
    spotlightEls.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 100).toFixed(2) + '%');
        card.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 100).toFixed(2) + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
      });
    });
  }

  /* ---------- Tilt 3D (data-tilt="grados") ---------- */
  const tiltEls = document.querySelectorAll('[data-tilt]');
  if (!reduced && canHover && tiltEls.length) {
    tiltEls.forEach(el => {
      const max = parseFloat(el.getAttribute('data-tilt') || '5');
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (0.5 - py) * max * 2;
        const ry = (px - 0.5) * max * 2;
        el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-3px)`;
        el.style.willChange = 'transform';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.willChange = '';
      });
    });
  }

  /* ---------- Contadores animados (data-count) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const dur = 1100;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => io.observe(el));
  }

  /* ---------- Marquee infinito ---------- */
  document.querySelectorAll('.marquee-track').forEach(track => {
    if (!track.dataset.cloned) {
      track.innerHTML += track.innerHTML;
      track.setAttribute('data-cloned', '1');
    }
  });
});
