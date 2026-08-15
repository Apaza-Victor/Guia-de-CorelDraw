# 🎨 Guía de CorelDraw de Cero a Experto

> Sitio web estático (HTML/CSS/JS puro) para aprender **CorelDRAW** paso a paso: de principiante absoluto hasta nivel certificación CCA.

**🌐 Sitio en vivo:** [apaza-victor.github.io/Guia-de-CorelDraw](https://apaza-victor.github.io/Guia-de-CorelDraw/)

## ✨ Características

- **30 páginas completas**: portada + 19 módulos/lecciones + páginas de apoyo (qué es CorelDraw, cómo usar la guía, método, recursos, glosario, comandos, herramientas, preguntas frecuentes, checklist de prepress).
- **Tema claro / oscuro** con memoria (se guarda en el navegador).
- **Buscador integrado** con acceso directo por teclado (`/`).
- **Diseño responsive** de 360px hasta pantallas 4K.
- **Estética moderna estilo 21st.dev** creada a mano en CSS/JS puro:
  - Fondo *aurora* animado (cián / magenta).
  - Hero 3D con extrusión de logo hecha con **Babylon.js**.
  - Partículas de fondo con **Three.js**.
  - Botones con efecto *shimmer*, tarjetas con *spotlight* que sigue el cursor y *tilt* 3D.
  - Contadores animados y cinta (marquee) de temas.
- Animaciones suaves con **anime.js**.
- Respeta `prefers-reduced-motion`.

## 🗂️ Estructura del proyecto

```
Guia de CorelDraw/
├── index.html                     → Portada (hero 3D + explora la guía)
├── pages/
│   ├── modulos.html               → Los 19 módulos del programa
│   ├── como-usar.html             → Cómo usar la guía
│   ├── que-es.html                → ¿Qué es CorelDraw?
│   ├── metodo.html                → Método de estudio
│   ├── recursos.html              → Recursos recomendados
│   ├── glosario.html              → Glosario de términos
│   ├── comandos.html              → Comandos y atajos
│   ├── herramientas.html          → Herramientas de CorelDRAW
│   ├── preguntas-frecuentes.html  → FAQ para principiantes
│   ├── checklist-preflight.html   → Checklist interactiva de prepress
│   └── lecciones/
│       ├── 01-introduccion-y-entorno.html
│       ├── 02-seleccion-formas-transformacion.html
│       ├── 03-dibujo-vectorial-curvas-bezier.html
│       ├── 04-color-relleno-transparencia.html
│       ├── 05-texto-tipografia.html
│       ├── 06-capas-orden-alineacion.html
│       ├── 07-efectos-especiales.html
│       ├── 08-exportacion-impresion.html
│       ├── 09-atajos-productividad.html
│       ├── 10-proyectos-practicos.html
│       ├── 11-plan-estudio-certificacion.html
│       ├── 12-mapas-de-bits-y-powertrace.html
│       ├── 13-guias-cuadriculas-precision.html
│       ├── 14-documentos-multipagina-plantillas.html
│       ├── 15-texto-avanzado-estilos-flujo-tablas.html
│       ├── 16-gestor-de-objetos-simbolos-avanzados.html
│       ├── 17-intercambio-de-formatos.html
│       ├── 18-corel-photo-paint-edicion-fotos.html
│       └── 19-medios-artisticos-dibujo.html
└── assets/
    ├── css/  (style.css, responsive.css)
    └── js/   (site.js, motion.js, three-bg.js, babylon-hero.js, anime.min.js)
```

## 🚀 Cómo ejecutarla

Al ser un sitio 100% estático, basta con cualquier servidor local:

```powershell
# Opción A: Python
python -m http.server 8000
# abre http://localhost:8000

# Opción B: VS Code → extensión "Live Server"
```

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 + CSS3 | Estructura y estilos (variables CSS, grid/flex) |
| Bootstrap 5 | Layout responsive e iconos |
| Bootstrap Icons | Iconografía |
| Three.js | Fondo de partículas |
| Babylon.js | Hero 3D (extrusión del logo) |
| anime.js | Animaciones de entrada |

## 📌 Estado del proyecto

**Versión:** 2.2 · **Estatus:** Activo · Actualizaciones según el avance del material.

---

## © Derechos de autor

**© 2026 Víctor Hugo Apaza (Apaza-Victor). Todos los derechos reservados.**

El contenido, la estructura, el diseño y el código de esta guía son propiedad de su autor. Queda **prohibida** la reproducción total o parcial, la distribución, la modificación o la publicación de este material sin autorización previa y por escrito del titular.

### Aviso de marca

CorelDRAW® es una marca registrada de **Corel Corporation**. Esta guía es un material **independiente** de aprendizaje y **no está afiliada, patrocinada ni respaldada** por Corel Corporation. El uso del nombre CorelDRAW se hace únicamente con fines descriptivos y educativos.
