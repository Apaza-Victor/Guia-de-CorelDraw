/* =========================================================
   babylon-hero.js
   Mini escena Babylon.js embebida en el hero de la portada.
   Muestra, en 3D real, lo que en CorelDraw es el efecto
   "Extrusión": tomar un trazado vectorial 2D (aquí, la
   silueta de un logotipo tipo "C") y darle profundidad.
   Sirve como vista previa tangible de la Lección 7.
   ========================================================= */
(function () {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof BABYLON === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, alpha: true });
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  const camera = new BABYLON.ArcRotateCamera(
    'cam', BABYLON.Tools.ToRadians(-100), BABYLON.Tools.ToRadians(68), 9,
    new BABYLON.Vector3(0, 0, 0), scene
  );
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 6;
  camera.upperRadiusLimit = 14;
  camera.wheelPrecision = 40;
  camera.panningSensibility = 0;

  const key = new BABYLON.DirectionalLight('key', new BABYLON.Vector3(-1, -2, -1), scene);
  key.intensity = 1.1;
  const fill = new BABYLON.HemisphericLight('fill', new BABYLON.Vector3(0, 1, 0), scene);
  fill.intensity = 0.55;
  fill.diffuse = new BABYLON.Color3(0.6, 0.9, 1);

  // --- Perfil vectorial 2D: una "C" simplificada, como un trazado hecho con
  //     la Herramienta Pluma en CorelDraw, lista para extruir. ---
  function cShapeProfile(outerR, innerR, gapDeg) {
    const pts = [];
    const start = gapDeg / 2;
    const end = 360 - gapDeg / 2;
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const a = BABYLON.Tools.ToRadians(start + (end - start) * (i / steps));
      pts.push(new BABYLON.Vector2(Math.cos(a) * outerR, Math.sin(a) * outerR));
    }
    for (let i = steps; i >= 0; i--) {
      const a = BABYLON.Tools.ToRadians(start + (end - start) * (i / steps));
      pts.push(new BABYLON.Vector2(Math.cos(a) * innerR, Math.sin(a) * innerR));
    }
    return pts;
  }

  const shape2D = cShapeProfile(2.1, 1.25, 46);
  const shape3D = shape2D.map(p => new BABYLON.Vector3(p.x, p.y, 0));

  const extruded = BABYLON.MeshBuilder.ExtrudePolygon('extruded-c', {
    shape: shape3D,
    depth: 1.1,
    sideOrientation: BABYLON.Mesh.DOUBLESIDE,
  }, scene, earcut);

  extruded.rotation.x = Math.PI / 2;
  extruded.position.y = 0.1;

  const mat = new BABYLON.PBRMaterial('cMat', scene);
  mat.albedoColor = new BABYLON.Color3(0.13, 0.78, 0.84); // cian
  mat.metallic = 0.35;
  mat.roughness = 0.28;
  mat.emissiveColor = new BABYLON.Color3(0.02, 0.14, 0.16);
  extruded.material = mat;

  // Anillo magenta y punto amarillo: "nodo" y "manejador" flotando alrededor,
  // eco directo de los controladores de nodo en la Herramienta Forma.
  const handle = BABYLON.MeshBuilder.CreateSphere('handle', { diameter: 0.22 }, scene);
  handle.position = new BABYLON.Vector3(2.6, 1.4, 0.6);
  const handleMat = new BABYLON.StandardMaterial('handleMat', scene);
  handleMat.emissiveColor = new BABYLON.Color3(1, 0.77, 0.24);
  handleMat.diffuseColor = new BABYLON.Color3(1, 0.77, 0.24);
  handle.material = handleMat;

  const node = BABYLON.MeshBuilder.CreateSphere('node', { diameter: 0.16 }, scene);
  node.position = new BABYLON.Vector3(-2.3, -1.1, 0.9);
  const nodeMat = new BABYLON.StandardMaterial('nodeMat', scene);
  nodeMat.emissiveColor = new BABYLON.Color3(0.94, 0.24, 0.58);
  nodeMat.diffuseColor = new BABYLON.Color3(0.94, 0.24, 0.58);
  node.material = nodeMat;

  const lines = BABYLON.MeshBuilder.CreateLines('handleLine', {
    points: [handle.position, new BABYLON.Vector3(0.9, 0.7, 0.55)]
  }, scene);
  lines.color = new BABYLON.Color3(1, 0.77, 0.24);

  engine.runRenderLoop(() => {
    if (!prefersReducedMotion) {
      extruded.rotation.z += 0.0035;
      handle.rotation.y += 0.01;
    }
    scene.render();
  });

  window.addEventListener('resize', () => engine.resize());

  // Pausar el render loop si el canvas sale de pantalla (ahorro en móviles)
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        engine.runRenderLoop(() => { scene.render(); });
      } else {
        engine.stopRenderLoop();
      }
    });
  }, { threshold: 0.05 });
  io.observe(canvas);
})();
