/* =========================================================
   site.js
   Comportamiento compartido por TODAS las páginas:
   - Tema claro/oscuro (persistente en localStorage)
   - Menú móvil tipo cajón
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
    { t:'Portada — CorelDraw de Cero a Experto', d:'Inicio de la guía, ruta de 19 lecciones y plan de estudio.', k:'inicio portada guia plan estudio', u:'index.html' },
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
    { t:'12 · Mapas de bits y PowerTRACE', d:'Importar, remuestrear y vectorizar imágenes con PowerTRACE.', k:'mapas bits powertrace vectorizar bitmap importar remuestrear', u:'pages/lecciones/12-mapas-de-bits-y-powertrace.html' },
    { t:'13 · Precisión: guías, cuadrículas y medidas', d:'Reglas, unidades, guías, cuadrícula y herramientas de medición.', k:'guias cuadricula reglas unidades medidas precision ajuste', u:'pages/lecciones/13-guias-cuadriculas-precision.html' },
    { t:'14 · Documentos multipágina y plantillas', d:'Páginas, capas maestras, numeración y plantillas .cdt.', k:'multipagina capa maestra plantilla cdt numeracion paginas', u:'pages/lecciones/14-documentos-multipagina-plantillas.html' },
    { t:'15 · Texto avanzado: estilos, flujo y tablas', d:'Estilos de carácter y párrafo, columnas, flujo y tablas.', k:'texto avanzado estilos columnas tablas flujo envolvente', u:'pages/lecciones/15-texto-avanzado-estilos-flujo-tablas.html' },
    { t:'16 · Gestor de objetos y símbolos avanzados', d:'Gestor a fondo, filtros, capas maestras, símbolos y bibliotecas.', k:'gestor objetos simbolos instancias biblioteca csl estilos objeto', u:'pages/lecciones/16-gestor-de-objetos-simbolos-avanzados.html' },
    { t:'17 · Intercambio de formatos y compatibilidad', d:'CDR, AI, EPS, PDF, PDF/X y SVG: cuándo usar cada formato.', k:'formatos compatibilidad cdr ai eps pdf svg pdfx', u:'pages/lecciones/17-intercambio-de-formatos.html' },
    { t:'18 · Corel PHOTO-PAINT y edición de fotos', d:'Retoque, máscaras, selecciones y ajustes de color de fotografías.', k:'photo paint retoque mascaras seleccion curvas niveles', u:'pages/lecciones/18-corel-photo-paint-edicion-fotos.html' },
    { t:'19 · Medios artísticos y dibujo a mano alzada', d:'Mano alzada, pinceles, medios artísticos, B-Spline y tableta.', k:'medios artisticos pinceles mano alzada b-spline tableta dibujo', u:'pages/lecciones/19-medios-artisticos-dibujo.html' },
    { t:'Recursos', d:'Plantillas, paletas y enlaces para seguir aprendiendo.', k:'recursos materiales plantillas paletas enlaces', u:'pages/recursos.html' },
    { t:'Glosario', d:'Términos clave del diseño vectorial y CorelDraw.', k:'glosario definiciones terminos vectorial nodo', u:'pages/glosario.html' },
    { t:'Comandos', d:'Atajos de teclado y comandos esenciales de CorelDraw.', k:'comandos atajos teclado shortcuts', u:'pages/comandos.html' },
    { t:'Herramientas', d:'Catálogo de herramientas de la caja de herramientas.', k:'herramientas caja seleccion bezier pluma', u:'pages/herramientas.html' },
    { t:'Preguntas frecuentes', d:'Dudas típicas de quien empieza: precio, vector vs. píxel, PDF/X y más.', k:'preguntas frecuentes faq dudas precio vector pdf', u:'pages/preguntas-frecuentes.html' },
    { t:'Checklist de prepress', d:'20 comprobaciones para entregar archivos listos para imprenta.', k:'checklist prepress imprenta sangrado cmyk pdf/x preflight', u:'pages/checklist-preflight.html' },
    { t:'Módulos', d:'Los 19 módulos de la ruta con descripción, conceptos, prerrequisitos y progreso interactivo.', k:'modulos ruta lecciones bloques duracion descripcion conceptos prerrequisitos', u:'pages/modulos.html' },
    { t:'Cómo usar esta guía', d:'Tres pasos simples para aprovechar las 19 lecciones.', k:'como usar primeros pasos metodo portafolio', u:'pages/como-usar.html' },
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
    ['preguntas-frecuentes', 'bi-question-circle'],
    ['checklist-preflight', 'bi-check2-square'],
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

  /* ---------- Progreso de módulos (página Módulos) ---------- */
  const moduleCards = document.querySelectorAll('.module-card[data-mod]');
  if (moduleCards.length) {
    const PROG_KEY = 'cd-modprog';
    let done = new Set();
    try { done = new Set(JSON.parse(localStorage.getItem(PROG_KEY) || '[]')); } catch (e) {}
    const bar = document.getElementById('progBar');
    const label = document.getElementById('progLabel');
    const pct = document.getElementById('progPct');

    function renderProgress() {
      const total = moduleCards.length;
      const n = done.size;
      const p = total ? Math.round((n / total) * 100) : 0;
      moduleCards.forEach(card => {
        const on = done.has(card.dataset.mod);
        card.classList.toggle('is-done', on);
        const input = card.querySelector('.mc-check input');
        if (input) input.checked = on;
      });
      if (bar) bar.style.width = p + '%';
      if (label) label.textContent = n + ' / ' + total + ' módulos completados';
      if (pct) pct.textContent = p + '%';
      try { localStorage.setItem(PROG_KEY, JSON.stringify([...done])); } catch (e) {}
    }

    moduleCards.forEach(card => {
      const input = card.querySelector('.mc-check input');
      if (input) input.addEventListener('change', () => {
        if (input.checked) done.add(card.dataset.mod);
        else done.delete(card.dataset.mod);
        renderProgress();
      });
    });

    const resetBtn = document.getElementById('progReset');
    if (resetBtn) resetBtn.addEventListener('click', () => {
      if (window.confirm('¿Reiniciar el progreso de los 19 módulos?')) {
        done.clear();
        renderProgress();
      }
    });

    renderProgress();
  }
});
