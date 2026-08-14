/* =========================================================
   site.js
   Comportamiento compartido por TODAS las páginas:
   - Tema claro/oscuro (persistente en localStorage)
   - Menú móvil tipo cajón y dropdown "Módulos"
   - Buscador de la guía (índice estático local)
   - Barra de progreso de lectura
   - Animaciones de entrada y scroll-reveal con anime.js
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Tema claro/oscuro ---------- */
  const themeToggle = document.getElementById('themeToggle');
  let storedTheme = null;
  try { storedTheme = localStorage.getItem('cd-theme'); } catch (e) {}
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = storedTheme || (prefersLight ? 'light' : 'dark');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('cd-theme', theme); } catch (e) {}
    const icon = themeToggle && themeToggle.querySelector('i');
    if (icon) icon.className = theme === 'light' ? 'bi bi-sun' : 'bi bi-moon-stars';
  }
  applyTheme(initialTheme);
  if (themeToggle) themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
  });

  /* ---------- Menú móvil (cajón lateral) ---------- */
  const mainNav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const navBackdrop = document.getElementById('navBackdrop');
  const navClose = document.getElementById('navClose');

  function syncScrollLock() {
    const anyOpen = (mainNav && mainNav.classList.contains('is-open')) ||
                    (searchOverlay && searchOverlay.classList.contains('is-open'));
    document.body.style.overflow = anyOpen ? 'hidden' : '';
  }
  function openNav() {
    if (mainNav) mainNav.classList.add('is-open');
    if (navBackdrop) navBackdrop.classList.add('is-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    syncScrollLock();
  }
  function closeNav() {
    if (mainNav) mainNav.classList.remove('is-open');
    if (navBackdrop) navBackdrop.classList.remove('is-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    syncScrollLock();
  }
  if (navToggle) navToggle.addEventListener('click', () => {
    mainNav && mainNav.classList.contains('is-open') ? closeNav() : openNav();
  });
  if (navClose) navClose.addEventListener('click', closeNav);
  if (navBackdrop) navBackdrop.addEventListener('click', closeNav);

  /* ---------- Dropdown "Módulos" ---------- */
  const dropdown = document.getElementById('modulesDropdown');
  if (dropdown) {
    const ddToggle = dropdown.querySelector('.h-link');
    ddToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = dropdown.classList.toggle('is-open');
      ddToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) dropdown.classList.remove('is-open');
    });
    dropdown.addEventListener('click', (e) => {
      if (e.target.closest('.dd-item')) dropdown.classList.remove('is-open');
    });
  }

  /* ---------- Buscador ---------- */
  const searchOverlay = document.getElementById('searchOverlay');
  const searchToggle = document.getElementById('searchToggle');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  const scriptEl = document.currentScript || document.querySelector('script[src*="site.js"]');
  const siteRoot = scriptEl && scriptEl.src
    ? scriptEl.src.replace(/[^/]*$/, '')          // quita site.js
      .replace(/assets\/js\/$/, '')               // sube a la raíz del sitio
    : '';

  const SEARCH_INDEX = [
    { t:'Portada — CorelDraw de Cero a Experto', d:'Inicio de la guía, ruta de 11 lecciones y plan de 8 semanas.', k:'inicio portada guia plan estudio', u:'index.html' },
    { t:'01 · Introducción y entorno de trabajo', d:'Instalación, interfaz y primer documento configurado.', k:'instalacion entorno interfaz documento cmyk rgb', u:'pages/lecciones/01-introduccion-y-entorno.html' },
    { t:'02 · Selección, formas y transformación', d:'Herramienta Selección, Forma y transformar objetos.', k:'seleccion forma transformacion mover escalar rotar', u:'pages/lecciones/02-seleccion-formas-transformacion.html' },
    { t:'03 · Dibujo vectorial y curvas Bézier', d:'Pluma, Bézier, trazado inteligente y operaciones booleanas.', k:'bezier curvas nodos manejadores pluma booleanas', u:'pages/lecciones/03-dibujo-vectorial-curvas-bezier.html' },
    { t:'04 · Color, relleno y transparencia', d:'Paletas, degradados, mapas de bits y transparencias.', k:'color relleno paleta degradado transparencia', u:'pages/lecciones/04-color-relleno-transparencia.html' },
    { t:'05 · Texto y tipografía', d:'Texto artístico, de párrafo y ajuste a trazado.', k:'texto tipografia fuentes artistico parrafo', u:'pages/lecciones/05-texto-tipografia.html' },
    { t:'06 · Capas, orden y alineación', d:'Gestor de objetos, grupos, combinar y alinear.', k:'capas orden alineacion grupos gestor objetos', u:'pages/lecciones/06-capas-orden-alineacion.html' },
    { t:'07 · Efectos especiales', d:'Mezcla, contorno, extrusión, sombra, PowerClip y lente.', k:'efectos mezcla contorno extrusion sombra powerclip lente', u:'pages/lecciones/07-efectos-especiales.html' },
    { t:'08 · Exportación e impresión', d:'Formatos, resolución, CMYK, sangrado y prepress.', k:'exportar imprimir pdf cmyk sangrado fuentes', u:'pages/lecciones/08-exportacion-impresion.html' },
    { t:'09 · Atajos y productividad', d:'Atajos de teclado, macros y hábitos de usuario avanzado.', k:'atajos teclado shortcuts macros productividad', u:'pages/lecciones/09-atajos-productividad.html' },
    { t:'10 · Proyectos prácticos guiados', d:'Logotipo, tarjeta, cartel e ilustración de principio a fin.', k:'proyectos logotipo tarjeta cartel ilustracion portafolio', u:'pages/lecciones/10-proyectos-practicos.html' },
    { t:'11 · Plan de estudio y certificación', d:'Ruta de 8 semanas, recursos y examen CCA.', k:'plan estudio certificacion cca 8 semanas', u:'pages/lecciones/11-plan-estudio-certificacion.html' },
    { t:'Recursos', d:'Plantillas, paletas y enlaces para seguir aprendiendo.', k:'recursos materiales plantillas paletas enlaces', u:'pages/recursos.html' },
    { t:'Glosario', d:'Términos clave del diseño vectorial y CorelDraw.', k:'glosario definiciones terminos vectorial nodo', u:'pages/glosario.html' },
    { t:'Comandos', d:'Atajos de teclado y comandos esenciales de CorelDraw.', k:'comandos atajos teclado shortcuts', u:'pages/comandos.html' },
    { t:'Herramientas', d:'Catálogo de herramientas de la caja de herramientas.', k:'herramientas caja seleccion bezier pluma', u:'pages/herramientas.html' },
    { t:'Módulos', d:'Los 11 módulos de la ruta con su nivel y duración.', k:'modulos ruta lecciones niveles duracion', u:'pages/modulos.html' },
    { t:'Cómo usar esta guía', d:'Tres pasos simples para aprovechar las 11 lecciones.', k:'como usar primeros pasos metodo portafolio', u:'pages/como-usar.html' },
    { t:'¿Qué es CorelDraw?', d:'Editor vectorial: definición, usos profesionales y suite.', k:'que es coreldraw vectorial definicion usos suite', u:'pages/que-es.html' },
    { t:'Método de la guía', d:'Aprender viendo, practicando y repitiendo.', k:'metodo metodologia niveles basico intermedio avanzado', u:'pages/metodo.html' },
  ];

  const SRCH_ICON = [
    ['lecciones/', 'bi-journal-text'],
    ['modulos', 'bi-grid-3x3-gap'],
    ['recursos', 'bi-collection'],
    ['glosario', 'bi-book'],
    ['comandos', 'bi-keyboard'],
    ['herramientas', 'bi-tools'],
    ['como-usar', 'bi-lightbulb'],
    ['que-es', 'bi-question-circle'],
    ['metodo', 'bi-diagram-3']
  ];
  function srchIcon(u) {
    for (const pair of SRCH_ICON) if (u.indexOf(pair[0]) !== -1) return pair[1];
    return 'bi-house';
  }

  function renderSearch(query) {
    if (!searchResults) return;
    const term = (query || '').trim().toLowerCase();
    const matches = term
      ? SEARCH_INDEX.filter(i => (i.t + ' ' + i.d + ' ' + i.k).toLowerCase().includes(term)).slice(0, 12)
      : SEARCH_INDEX.slice(0, 8);
    if (!matches.length) {
      searchResults.innerHTML = '<div class="no-results"><i class="bi bi-search"></i><span>Sin resultados para “' + query.trim() + '”. Prueba con otro término.</span></div>';
      return;
    }
    searchResults.innerHTML = matches.map(m =>
      '<a href="' + siteRoot + m.u + '">' +
        '<span class="s-icon"><i class="bi ' + srchIcon(m.u) + '"></i></span>' +
        '<span class="s-body"><strong>' + m.t + '</strong><small>' + m.d + '</small></span>' +
        '<i class="bi bi-arrow-up-right s-go"></i>' +
      '</a>'
    ).join('');
  }

  function openSearch() {
    if (searchOverlay) { searchOverlay.classList.add('is-open'); searchOverlay.setAttribute('aria-hidden', 'false'); }
    renderSearch('');
    if (searchInput) searchInput.focus();
    syncScrollLock();
  }
  function closeSearch() {
    if (searchOverlay) { searchOverlay.classList.remove('is-open'); searchOverlay.setAttribute('aria-hidden', 'true'); }
    syncScrollLock();
  }
  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchInput) searchInput.addEventListener('input', () => renderSearch(searchInput.value));
  if (searchInput) searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchResults) {
      const first = searchResults.querySelector('a');
      if (first) window.location.href = first.getAttribute('href');
    }
  });

  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable;
    if (e.key === '/' && !typing) {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') {
      closeSearch();
      closeNav();
      if (dropdown) dropdown.classList.remove('is-open');
    }
  });

  /* ---------- Barra de progreso de lectura ---------- */
  const progressBar = document.getElementById('readProgress');
  if (progressBar) {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      progressBar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Animaciones de entrada (anime.js) ---------- */
  if (typeof anime !== 'undefined' && !reduced) {
    anime.timeline({ easing: 'easeOutExpo' })
      .add({ targets: '.js-anim-eyebrow', opacity: [0, 1], translateY: [12, 0], duration: 550 })
      .add({ targets: '.js-anim-title', opacity: [0, 1], translateY: [26, 0], duration: 750 }, '-=350')
      .add({ targets: '.js-anim-lead', opacity: [0, 1], translateY: [18, 0], duration: 650 }, '-=500')
      .add({ targets: '.js-anim-cta', opacity: [0, 1], translateY: [14, 0], delay: anime.stagger(90), duration: 550 }, '-=450')
      .add({ targets: '.js-anim-stat', opacity: [0, 1], translateY: [10, 0], delay: anime.stagger(80), duration: 500 }, '-=400')
      .add({ targets: '.js-anim-frame', opacity: [0, 1], scale: [0.94, 1], duration: 800 }, '-=700');
  } else {
    document.querySelectorAll('.js-anim-eyebrow, .js-anim-title, .js-anim-lead, .js-anim-cta, .js-anim-stat, .js-anim-frame')
      .forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (typeof anime !== 'undefined' && !reduced) {
          anime({ targets: entry.target, opacity: [0, 1], translateY: [18, 0], duration: 650, easing: 'easeOutCubic' });
        } else {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'none';
        }
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  /* ---------- Micro-interacción en tarjetas ---------- */
  if (typeof anime !== 'undefined' && !reduced) {
    document.querySelectorAll('.card-vec').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        anime({ targets: card.querySelector('.card-icon'), rotate: [0, -8, 0], scale: [1, 1.08, 1], duration: 480, easing: 'easeOutQuad' });
      });
    });
  }
});
