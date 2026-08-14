/* =========================================================
   three-bg.js
   Fondo ambiental 3D con Three.js: una nube de "nodos" y
   "manejadores" conectados por líneas, como una red de curvas
   Bézier flotando en el espacio — referencia directa al modo
   en que CorelDraw representa los trazados vectoriales.
   Se pausa si la pestaña no está visible o si el usuario
   prefiere movimiento reducido, y se adapta a cualquier tamaño
   de pantalla desde 360px.
   ========================================================= */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 9;

  // --- Nodos (puntos) ---
  const NODE_COUNT = window.innerWidth < 600 ? 60 : 130;
  const positions = new Float32Array(NODE_COUNT * 3);
  const velocities = [];
  const spread = 8;

  for (let i = 0; i < NODE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread * 2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 1.2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
    velocities.push({
      x: (Math.random() - 0.5) * 0.0025,
      y: (Math.random() - 0.5) * 0.0025,
      z: (Math.random() - 0.5) * 0.0025,
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const nodeMaterial = new THREE.PointsMaterial({
    color: 0x21c7d6,
    size: 0.055,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geometry, nodeMaterial);
  scene.add(points);

  // --- Líneas de conexión tipo "manejadores de curva" ---
  const lineGeometry = new THREE.BufferGeometry();
  const maxLines = NODE_COUNT * 3;
  const linePositions = new Float32Array(maxLines * 2 * 3);
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xef3f95,
    transparent: true,
    opacity: 0.12,
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  const CONNECT_DIST = 2.1;

  function updateLines() {
    let idx = 0;
    for (let i = 0; i < NODE_COUNT && idx < maxLines; i++) {
      const ax = positions[i * 3], ay = positions[i * 3 + 1], az = positions[i * 3 + 2];
      for (let j = i + 1; j < NODE_COUNT && idx < maxLines; j++) {
        const bx = positions[j * 3], by = positions[j * 3 + 1], bz = positions[j * 3 + 2];
        const dx = ax - bx, dy = ay - by, dz = az - bz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < CONNECT_DIST) {
          const base = idx * 6;
          linePositions[base] = ax; linePositions[base + 1] = ay; linePositions[base + 2] = az;
          linePositions[base + 3] = bx; linePositions[base + 4] = by; linePositions[base + 5] = bz;
          idx++;
        }
      }
    }
    lineGeometry.setDrawRange(0, idx * 2);
    lineGeometry.attributes.position.needsUpdate = true;
  }

  let mouseX = 0, mouseY = 0;
  window.addEventListener('pointermove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

  function animate() {
    requestAnimationFrame(animate);
    if (!visible) return;

    for (let i = 0; i < NODE_COUNT; i++) {
      positions[i * 3] += velocities[i].x;
      positions[i * 3 + 1] += velocities[i].y;
      positions[i * 3 + 2] += velocities[i].z;
      for (let a = 0; a < 3; a++) {
        const v = positions[i * 3 + a];
        if (v > spread || v < -spread) velocities[i][['x', 'y', 'z'][a]] *= -1;
      }
    }
    geometry.attributes.position.needsUpdate = true;
    updateLines();

    points.rotation.y += 0.0006;
    lines.rotation.y += 0.0006;

    if (!prefersReducedMotion) {
      camera.position.x += (mouseX * 1.1 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.7 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
    }

    renderer.render(scene, camera);
  }

  if (prefersReducedMotion) {
    // Aún así renderizamos un frame estático agradable, sin animación continua.
    updateLines();
    renderer.render(scene, camera);
  } else {
    animate();
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
