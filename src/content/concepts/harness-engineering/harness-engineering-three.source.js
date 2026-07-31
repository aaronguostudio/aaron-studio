// Harness Engineering — shared Three.js mission scene.
//
// Reproducible build (run from the repository root):
//
//   mission_build_dir="$(mktemp -d)"
//   npm install --prefix "$mission_build_dir" --no-save three@0.184.0 esbuild@0.25.12
//   node -e 'const fs=require("node:fs"),p=require("node:path"),d=process.argv[1];for(const n of ["three.core.js","three.module.js"]){const f=p.join(d,n);let s=fs.readFileSync(f,"utf8");s=s.replaceAll("'"'"'http://www.w3.org/1999/xhtml'"'"'","['"'"'http:'"'"','"'"'//www.w3.org/1999/xhtml'"'"'].join('"'"''"'"')").replaceAll("https://jcgt.org/published/0007/04/01/","JCGT paper 7/4/1");fs.writeFileSync(f,s)}' "$mission_build_dir/node_modules/three/build"
//   "$mission_build_dir/node_modules/.bin/esbuild" \
//     src/content/concepts/harness-engineering/harness-engineering-three.source.js \
//     --bundle --format=iife --platform=browser --target=es2020 --minify \
//     --legal-comments=inline \
//     --alias:three="$mission_build_dir/node_modules/three/build/three.module.js" \
//     --banner:js='/*! Three.js r184 — MIT License; Harness Mission 3D controller */' \
//     --outfile=src/content/concepts/harness-engineering/harness-engineering-three.runtime.js
//   mission_runtime="src/content/concepts/harness-engineering/harness-engineering-three.runtime.js"
//   node -e 'const fs=require("node:fs"),f=process.argv[1],s=fs.readFileSync(f,"utf8").replace(/[ \t]+$/gm,"").replace(/^[ \t]+/gm,i=>i.replace(/ +(?=\t)/g,""));fs.writeFileSync(f,s)' "$mission_runtime"
//
// Only the generated runtime is loaded by the standalone page and Vue host.

import {
  ACESFilmicToneMapping,
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from "three";

const VERSION = "0.184.0";

const STAGES = Object.freeze(
  [
    { key: "coordinates", duration: 7200 },
    { key: "permission", duration: 7200 },
    { key: "handshake", duration: 7600 },
    { key: "recovery", duration: 8400 },
    { key: "verification", duration: 8600 },
  ].map((stage) => Object.freeze(stage)),
);

const STAGE_SETTLE_AT = Object.freeze({
  coordinates: 6000,
  permission: 6000,
  handshake: 6100,
  recovery: 6800,
  verification: 6900,
});

const CAMERA_POSES = Object.freeze({
  coordinates: Object.freeze({
    position: Object.freeze([0, 8.8, 18.8]),
    target: Object.freeze([0, 2.25, 0]),
  }),
  permission: Object.freeze({
    position: Object.freeze([0, 7.7, 16.7]),
    target: Object.freeze([0, 2.35, 0]),
  }),
  handshake: Object.freeze({
    position: Object.freeze([0, 12, 25.5]),
    target: Object.freeze([0, 3.2, 0]),
  }),
  recovery: Object.freeze({
    position: Object.freeze([0, 7.9, 17.2]),
    target: Object.freeze([0, 2.35, 0]),
  }),
  verification: Object.freeze({
    position: Object.freeze([0, 9.4, 19.6]),
    target: Object.freeze([0, 2.65, 0]),
  }),
});

const COLORS = Object.freeze({
  backdrop: 0x070b13,
  space: 0x111827,
  earth: 0x101c31,
  atmosphere: 0x4c9cff,
  craft: 0xdce2e8,
  craftHighlight: 0xf5f7fa,
  craftDark: 0x525b6a,
  thermal: 0x171b23,
  left: 0xf98a58,
  right: 0x6f8cff,
  success: 0xbce76b,
  danger: 0xff5d73,
  warning: 0xffb45f,
  structure: 0x2b3447,
  structureBright: 0x657189,
  ink: 0xdce5f3,
  water: 0x14253a,
});

const LEFT = "left";
const RIGHT = "right";
const TAU = Math.PI * 2;
const VEC_A = new Vector3();
const VEC_B = new Vector3();
const VEC_C = new Vector3();
const VEC_UP = new Vector3(0, 1, 0);

const PATHS = Object.freeze({
  instruction: Object.freeze([
    Object.freeze([-2.65, 0.72, 0.45]),
    Object.freeze([-1.5, 1.3, 0.2]),
    Object.freeze([-0.1, 1.15, 0]),
  ]),
  handshakeRequest: Object.freeze([
    Object.freeze([-2.55, 3.55, 0.35]),
    Object.freeze([-1.15, 4.9, 0.1]),
    Object.freeze([0, 5.15, 0]),
  ]),
  readyReturn: Object.freeze([
    Object.freeze([0, 5.2, 0]),
    Object.freeze([-1.15, 4.65, 0.1]),
    Object.freeze([-2.55, 3.55, 0.35]),
  ]),
  noGoReturn: Object.freeze([
    Object.freeze([-1.38, 3.85, 0.05]),
    Object.freeze([-2.25, 3.25, 0.2]),
    Object.freeze([-2.65, 2.4, 0.45]),
  ]),
  evidencePacket: Object.freeze([
    Object.freeze([-1.75, 4.3, 0.2]),
    Object.freeze([0.1, 5.25, -0.25]),
    Object.freeze([2.05, 4.35, -0.3]),
  ]),
});

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function range(time, start, end, easing = (value) => value) {
  if (end <= start) return time >= end ? 1 : 0;
  return easing(clamp01((time - start) / (end - start)));
}

function lerp(from, to, amount) {
  return from + (to - from) * amount;
}

function lerpVector(target, from, to, amount) {
  target.set(
    lerp(from[0], to[0], amount),
    lerp(from[1], to[1], amount),
    lerp(from[2], to[2], amount),
  );
  return target;
}

function quadraticVector(target, from, control, to, amount) {
  const inverse = 1 - amount;
  target.set(
    inverse * inverse * from[0] +
      2 * inverse * amount * control[0] +
      amount * amount * to[0],
    inverse * inverse * from[1] +
      2 * inverse * amount * control[1] +
      amount * amount * to[1],
    inverse * inverse * from[2] +
      2 * inverse * amount * control[2] +
      amount * amount * to[2],
  );
  return target;
}

function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (time) => ((ax * time + bx) * time + cx) * time;
  const sampleY = (time) => ((ay * time + by) * time + cy) * time;
  const sampleDerivativeX = (time) => (3 * ax * time + 2 * bx) * time + cx;

  return (position) => {
    const x = clamp01(position);
    let guess = x;

    for (let index = 0; index < 8; index += 1) {
      const error = sampleX(guess) - x;
      const derivative = sampleDerivativeX(guess);
      if (Math.abs(error) < 1e-7) return sampleY(guess);
      if (Math.abs(derivative) < 1e-7) break;
      guess -= error / derivative;
    }

    let low = 0;
    let high = 1;
    guess = x;
    for (let index = 0; index < 18; index += 1) {
      const sampled = sampleX(guess);
      if (Math.abs(sampled - x) < 1e-7) break;
      if (sampled < x) low = guess;
      else high = guess;
      guess = (low + high) / 2;
    }

    return sampleY(guess);
  };
}

const easeOut = cubicBezier(0.23, 1, 0.32, 1);
const easeInOut = cubicBezier(0.77, 0, 0.175, 1);

function createMissionScene(options = {}) {
  const {
    canvas,
    host = canvas?.parentElement ?? canvas,
    initialStage = "coordinates",
    reducedMotion = false,
    locale = "zh",
    onReady = () => {},
    onStateChange = () => {},
    onUnsupported = () => {},
    onDiagnostics = null,
  } = options;

  if (!canvas || typeof canvas.getContext !== "function") {
    throw new TypeError("HarnessMission3D.create requires a canvas element.");
  }

  const initialIndex = Math.max(
    0,
    STAGES.findIndex((stage) => stage.key === initialStage),
  );
  const totalDuration = STAGES.reduce(
    (total, stage) => total + stage.duration,
    0,
  );
  const stageOffsets = STAGES.map((_, index) =>
    STAGES.slice(0, index).reduce((total, stage) => total + stage.duration, 0),
  );

  let renderer = null;
  let scene = null;
  let camera = null;
  let sceneModel = null;
  let resizeObserver = null;
  let intersectionObserver = null;
  let currentIndex = initialIndex;
  let elapsed = STAGES[currentIndex].duration;
  let playback = "idle";
  let stageSettled = true;
  let completed = false;
  let autoplay = false;
  let isIntersecting = true;
  let isDocumentVisible =
    typeof document === "undefined" ? true : !document.hidden;
  let motionReduced = Boolean(reducedMotion);
  let destroyed = false;
  let unsupported = false;
  let ready = false;
  let activeTimeEpoch = null;
  let animationLoopRunning = false;
  let lastProgressEmit = -Infinity;
  let lastReason = "initial";
  let layout = "side-by-side";

  const disposables = {
    geometries: new Set(),
    materials: new Set(),
  };

  const currentStage = () => STAGES[currentIndex];

  function stateSnapshot(reason = lastReason) {
    const progress = clamp01(
      (stageOffsets[currentIndex] +
        Math.min(elapsed, currentStage().duration)) /
        totalDuration,
    );
    return {
      stage: currentStage().key,
      index: currentIndex,
      playback,
      progress,
      stageSettled,
      completed,
      reason,
    };
  }

  function emitState(reason, force = false) {
    if (destroyed) return;
    const now =
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
        ? performance.now()
        : Date.now();
    if (!force && now - lastProgressEmit < 100) return;
    lastProgressEmit = now;
    lastReason = reason;
    onStateChange(stateSnapshot(reason));
  }

  function defer(callback) {
    if (typeof queueMicrotask === "function") queueMicrotask(callback);
    else Promise.resolve().then(callback);
  }

  function reportUnsupported(error) {
    if (unsupported || destroyed) return;
    unsupported = true;
    stopAnimationLoop();
    defer(() => {
      if (!destroyed) onUnsupported(error);
    });
  }

  function geometry(value) {
    disposables.geometries.add(value);
    return value;
  }

  function material(value) {
    disposables.materials.add(value);
    return value;
  }

  function standardMaterial(color, extra = {}) {
    return material(
      new MeshStandardMaterial({
        color,
        roughness: 0.58,
        metalness: 0.32,
        ...extra,
      }),
    );
  }

  function basicMaterial(color, opacity = 1, extra = {}) {
    return material(
      new MeshBasicMaterial({
        color,
        transparent: opacity < 1 || Boolean(extra.transparent),
        opacity,
        depthWrite: opacity >= 1,
        ...extra,
      }),
    );
  }

  function lineMaterial(color, opacity = 1) {
    return material(
      new LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        depthWrite: false,
      }),
    );
  }

  const shared = {
    box: geometry(new BoxGeometry(1, 1, 1)),
    sphere: geometry(new SphereGeometry(0.5, 18, 12)),
    cone: geometry(new ConeGeometry(0.5, 1, 18)),
    cylinder: geometry(new CylinderGeometry(0.5, 0.5, 1, 20)),
    torus: geometry(new TorusGeometry(0.5, 0.055, 8, 36)),
    orbitTorus: geometry(new TorusGeometry(0.5, 0.018, 8, 64)),
    ring: geometry(new RingGeometry(0.34, 0.5, 32)),
    circle: geometry(new CircleGeometry(0.5, 24)),
    plane: geometry(new PlaneGeometry(1, 1)),
    craft: standardMaterial(COLORS.craft, {
      roughness: 0.28,
      metalness: 0.72,
    }),
    craftHighlight: standardMaterial(COLORS.craftHighlight, {
      roughness: 0.2,
      metalness: 0.8,
    }),
    craftDark: standardMaterial(COLORS.craftDark, {
      roughness: 0.44,
      metalness: 0.52,
    }),
    thermal: standardMaterial(COLORS.thermal, {
      roughness: 0.68,
      metalness: 0.18,
    }),
    structure: standardMaterial(COLORS.structure),
    structureBright: standardMaterial(COLORS.structureBright),
    earth: standardMaterial(COLORS.earth, {
      roughness: 0.9,
      metalness: 0,
    }),
    water: standardMaterial(COLORS.water, {
      roughness: 0.75,
      metalness: 0.08,
    }),
  };

  function mesh(parent, meshGeometry, meshMaterial, position, scale, rotation) {
    const value = new Mesh(meshGeometry, meshMaterial);
    if (position) value.position.set(...position);
    if (scale) value.scale.set(...scale);
    if (rotation) value.rotation.set(...rotation);
    parent.add(value);
    return value;
  }

  function makeDynamicMaterial(color, opacity = 1) {
    return basicMaterial(color, opacity, {
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
    });
  }

  function createRoute(parent, points, color, opacity = 0.9) {
    const routeGeometry = geometry(new BufferGeometry().setFromPoints(points));
    routeGeometry.setDrawRange(0, 0);
    const routeMaterial = lineMaterial(color, opacity);
    const line = new Line(routeGeometry, routeMaterial);
    line.visible = false;
    parent.add(line);
    return {
      line,
      geometry: routeGeometry,
      material: routeMaterial,
      pointCount: points.length,
    };
  }

  function setRoute(route, amount, opacity = 1) {
    const progress = clamp01(amount);
    route.geometry.setDrawRange(
      0,
      Math.max(0, Math.ceil(progress * route.pointCount)),
    );
    route.material.opacity = clamp01(opacity);
    route.line.visible = progress > 0.001 && opacity > 0.001;
  }

  function makeQuadraticPoints(from, control, to, count = 48) {
    const points = [];
    for (let index = 0; index <= count; index += 1) {
      points.push(
        quadraticVector(new Vector3(), from, control, to, index / count),
      );
    }
    return points;
  }

  function makeCompositePoints(segments, countPerSegment = 28) {
    const points = [];
    segments.forEach((segment, segmentIndex) => {
      for (let index = 0; index <= countPerSegment; index += 1) {
        if (segmentIndex > 0 && index === 0) continue;
        points.push(
          quadraticVector(
            new Vector3(),
            segment[0],
            segment[1],
            segment[2],
            index / countPerSegment,
          ),
        );
      }
    });
    return points;
  }

  function createDottedRoute(parent, points, color) {
    const routeMaterial = makeDynamicMaterial(color, 0.9);
    const dots = points.map((point) =>
      mesh(parent, shared.sphere, routeMaterial, point, [0.09, 0.09, 0.09]),
    );
    dots.forEach((dot) => {
      dot.visible = false;
    });
    return { dots, material: routeMaterial };
  }

  function setDottedRoute(route, amount, opacity = 1) {
    const visibleCount = Math.ceil(clamp01(amount) * route.dots.length);
    route.material.opacity = clamp01(opacity);
    route.dots.forEach((dot, index) => {
      dot.visible = index < visibleCount && opacity > 0.001;
    });
  }

  function createActor(parent, kind, color, size = 1) {
    const root = new Group();
    const actorMaterial = makeDynamicMaterial(color, 1);
    if (kind === "request") {
      mesh(root, shared.box, actorMaterial, [0, 0, 0], [0.34, 0.22, 0.34]);
      mesh(
        root,
        shared.cone,
        actorMaterial,
        [0.36, 0, 0],
        [0.2, 0.35, 0.2],
        [0, 0, -Math.PI / 2],
      );
    } else if (kind === "ack") {
      mesh(
        root,
        shared.torus,
        actorMaterial,
        [0, 0, 0],
        [0.46, 0.46, 0.46],
        [Math.PI / 2, 0, 0],
      );
      mesh(root, shared.sphere, actorMaterial, [0, 0, 0], [0.18, 0.18, 0.18]);
    } else if (kind === "no-go") {
      mesh(
        root,
        shared.box,
        actorMaterial,
        [0, 0, 0],
        [0.65, 0.1, 0.16],
        [0, 0, Math.PI / 4],
      );
      mesh(
        root,
        shared.box,
        actorMaterial,
        [0, 0, 0],
        [0.65, 0.1, 0.16],
        [0, 0, -Math.PI / 4],
      );
    } else if (kind === "go") {
      mesh(
        root,
        shared.cone,
        actorMaterial,
        [0, 0, 0],
        [0.38, 0.55, 0.38],
        [0, 0, -Math.PI / 2],
      );
    } else if (kind === "packet") {
      mesh(root, shared.box, actorMaterial, [0, 0, 0], [0.58, 0.36, 0.16]);
      for (let index = -1; index <= 1; index += 1) {
        mesh(
          root,
          shared.box,
          actorMaterial,
          [index * 0.17, 0, -0.12],
          [0.08, 0.18, 0.05],
        );
      }
    } else {
      mesh(
        root,
        shared.box,
        actorMaterial,
        [0, 0, 0],
        [0.38, 0.38, 0.38],
        [0.2, 0.35, 0.15],
      );
      mesh(
        root,
        shared.torus,
        actorMaterial,
        [0, 0, 0],
        [0.5, 0.5, 0.5],
        [Math.PI / 2, 0, 0],
      );
    }
    root.scale.setScalar(size);
    root.visible = false;
    parent.add(root);
    return { root, material: actorMaterial, baseScale: size };
  }

  function hideActor(actor) {
    actor.root.visible = false;
    actor.material.opacity = 0;
    actor.root.scale.setScalar(actor.baseScale * 0.94);
  }

  function showActor(actor, opacity = 1, scale = 1) {
    actor.root.visible = opacity > 0.001;
    actor.material.opacity = clamp01(opacity);
    actor.root.scale.setScalar(actor.baseScale * lerp(0.94, 1, clamp01(scale)));
  }

  function moveActor(actor, path, amount, opacity = 1) {
    quadraticVector(
      actor.root.position,
      path[0],
      path[1],
      path[2],
      clamp01(amount),
    );
    showActor(actor, opacity, amount);
  }

  function createStatusNode(parent, position, color = COLORS.structureBright) {
    const root = new Group();
    root.position.set(...position);
    const coreMaterial = makeDynamicMaterial(color, 1);
    const haloMaterial = makeDynamicMaterial(color, 0.42);
    const core = mesh(
      root,
      shared.sphere,
      coreMaterial,
      [0, 0, 0],
      [0.34, 0.34, 0.34],
    );
    const halo = mesh(
      root,
      shared.torus,
      haloMaterial,
      [0, 0, 0],
      [0.68, 0.68, 0.68],
      [Math.PI / 2, 0, 0],
    );
    parent.add(root);
    return { root, core, halo, coreMaterial, haloMaterial };
  }

  function setStatusNode(node, color, strength = 1, pulse = 1) {
    node.root.visible = strength > 0.001;
    node.coreMaterial.color.setHex(color);
    node.haloMaterial.color.setHex(color);
    node.coreMaterial.opacity = clamp01(strength);
    node.haloMaterial.opacity = clamp01(strength * 0.42);
    node.halo.scale.setScalar(lerp(0.9, 1.18, clamp01(pulse)));
  }

  function makeReusableHeavyVehicle(parent, ghost = false) {
    const root = new Group();
    const surfaceMaterial = ghost
      ? makeDynamicMaterial(COLORS.right, 0.18)
      : shared.craft;
    const highlightMaterial = ghost
      ? makeDynamicMaterial(COLORS.right, 0.12)
      : shared.craftHighlight;
    const darkMaterial = ghost
      ? makeDynamicMaterial(COLORS.right, 0.1)
      : shared.craftDark;
    const thermalMaterial = ghost
      ? makeDynamicMaterial(COLORS.right, 0.08)
      : shared.thermal;
    const engineMaterial = makeDynamicMaterial(COLORS.warning, 0);
    const plumeMaterial = makeDynamicMaterial(COLORS.right, 0);

    const booster = new Group();
    root.add(booster);
    mesh(
      booster,
      shared.cylinder,
      surfaceMaterial,
      [0, 1.28, 0],
      [0.78, 2.56, 0.78],
    );
    mesh(
      booster,
      shared.cylinder,
      darkMaterial,
      [0, 0.14, 0],
      [0.83, 0.28, 0.83],
    );
    mesh(
      booster,
      shared.box,
      highlightMaterial,
      [0, 1.7, 0.72],
      [0.55, 0.95, 0.06],
    );
    const boosterFins = [];
    for (const entry of [
      [-0.76, 2.08, 0, 0, 0, 0.12],
      [0.76, 2.08, 0, 0, 0, -0.12],
      [0, 2.08, -0.76, 0.12, 0, 0],
      [0, 2.08, 0.76, -0.12, 0, 0],
    ]) {
      boosterFins.push(
        mesh(
          booster,
          shared.box,
          darkMaterial,
          [entry[0], entry[1], entry[2]],
          [entry[0] === 0 ? 0.52 : 0.18, 0.5, entry[2] === 0 ? 0.52 : 0.18],
          [entry[3], entry[4], entry[5]],
        ),
      );
    }

    const engineLights = [];
    const plumes = [];
    for (let index = 0; index < 5; index += 1) {
      const angle = (index / 5) * TAU;
      const radius = index === 0 ? 0 : 0.36;
      const x = index === 0 ? 0 : Math.cos(angle) * radius;
      const z = index === 0 ? 0 : Math.sin(angle) * radius;
      engineLights.push(
        mesh(
          booster,
          shared.circle,
          engineMaterial,
          [x, -0.01, z],
          [0.18, 0.18, 0.18],
          [-Math.PI / 2, 0, 0],
        ),
      );
      const plume = mesh(
        booster,
        shared.cone,
        plumeMaterial,
        [x, -0.48, z],
        [0.18, 0.82, 0.18],
        [0, 0, Math.PI],
      );
      plume.visible = false;
      plumes.push(plume);
    }

    const upper = new Group();
    upper.position.y = 2.62;
    root.add(upper);
    mesh(
      upper,
      shared.cylinder,
      surfaceMaterial,
      [0, 0.66, 0],
      [0.73, 1.32, 0.73],
    );
    mesh(upper, shared.cone, surfaceMaterial, [0, 1.68, 0], [0.73, 0.78, 0.73]);
    mesh(
      upper,
      shared.box,
      thermalMaterial,
      [0, 0.96, 0.7],
      [0.42, 1.18, 0.07],
    );

    const flaps = [];
    for (const entry of [
      [-0.72, 0.43, 0, 0, 0, 0.1],
      [0.72, 0.43, 0, 0, 0, -0.1],
      [-0.58, 1.35, 0, 0, 0, 0.05],
      [0.58, 1.35, 0, 0, 0, -0.05],
    ]) {
      flaps.push(
        mesh(
          upper,
          shared.box,
          darkMaterial,
          [entry[0], entry[1], entry[2]],
          [0.38, 0.48, 0.09],
          [entry[3], entry[4], entry[5]],
        ),
      );
    }

    const payloadDoorPivot = new Group();
    payloadDoorPivot.position.set(0, 1.12, 0.72);
    upper.add(payloadDoorPivot);
    const payloadDoor = mesh(
      payloadDoorPivot,
      shared.box,
      surfaceMaterial,
      [0, 0.28, 0.04],
      [0.5, 0.62, 0.06],
    );

    const upperEngineMaterial = makeDynamicMaterial(COLORS.warning, 0);
    const upperPlumeMaterial = makeDynamicMaterial(COLORS.right, 0);
    const upperEngine = mesh(
      upper,
      shared.circle,
      upperEngineMaterial,
      [0, -0.02, 0],
      [0.28, 0.28, 0.28],
      [-Math.PI / 2, 0, 0],
    );
    const upperPlume = mesh(
      upper,
      shared.cone,
      upperPlumeMaterial,
      [0, -0.55, 0],
      [0.26, 0.95, 0.26],
      [0, 0, Math.PI],
    );
    upperPlume.visible = false;

    const interstage = new Group();
    interstage.position.y = 2.62;
    root.add(interstage);
    mesh(
      interstage,
      shared.torus,
      darkMaterial,
      [0, 0, 0],
      [1.48, 1.48, 1.48],
      [Math.PI / 2, 0, 0],
    );

    root.scale.setScalar(0.82);
    parent.add(root);
    return {
      root,
      booster,
      upper,
      interstage,
      payloadDoorPivot,
      payloadDoor,
      engineLights,
      plumes,
      upperEngine,
      upperPlume,
      engineMaterial,
      plumeMaterial,
      upperEngineMaterial,
      upperPlumeMaterial,
      ghostMaterials: ghost
        ? [surfaceMaterial, highlightMaterial, darkMaterial, thermalMaterial]
        : [],
    };
  }

  function resetVehicle(vehicle) {
    vehicle.root.visible = true;
    vehicle.root.position.set(0, 0, 0);
    vehicle.root.rotation.set(0, 0, 0);
    vehicle.root.scale.setScalar(0.82);
    vehicle.booster.visible = true;
    vehicle.booster.position.set(0, 0, 0);
    vehicle.booster.rotation.set(0, 0, 0);
    vehicle.upper.visible = true;
    vehicle.upper.position.set(0, 2.62, 0);
    vehicle.upper.rotation.set(0, 0, 0);
    vehicle.interstage.visible = true;
    vehicle.interstage.position.set(0, 2.62, 0);
    vehicle.interstage.rotation.set(0, 0, 0);
    vehicle.payloadDoorPivot.rotation.set(0, 0, 0);
    setBoosterEngine(vehicle, 0);
    setUpperEngine(vehicle, 0);
  }

  function setBoosterEngine(vehicle, amount, color = COLORS.right) {
    const strength = clamp01(amount);
    vehicle.engineMaterial.color.setHex(
      strength > 0.01 ? COLORS.warning : color,
    );
    vehicle.engineMaterial.opacity = strength;
    vehicle.plumeMaterial.color.setHex(color);
    vehicle.plumeMaterial.opacity = strength * 0.68;
    vehicle.plumes.forEach((plume) => {
      plume.visible = strength > 0.01;
      plume.scale.y = lerp(0.72, 1.12, strength);
    });
  }

  function setUpperEngine(vehicle, amount, color = COLORS.right) {
    const strength = clamp01(amount);
    vehicle.upperEngineMaterial.color.setHex(
      strength > 0.01 ? COLORS.warning : color,
    );
    vehicle.upperEngineMaterial.opacity = strength;
    vehicle.upperPlumeMaterial.color.setHex(color);
    vehicle.upperPlumeMaterial.opacity = strength * 0.65;
    vehicle.upperPlume.visible = strength > 0.01;
    vehicle.upperPlume.scale.y = lerp(0.75, 1.1, strength);
  }

  function makeTower(parent) {
    const root = new Group();
    root.position.x = -1.42;
    mesh(root, shared.box, shared.structure, [0, 2.25, 0], [0.28, 4.5, 0.4]);
    for (let index = 0; index < 5; index += 1) {
      mesh(
        root,
        shared.box,
        shared.structureBright,
        [0.34, 0.48 + index * 0.84, 0],
        [0.72, 0.09, 0.32],
      );
    }
    mesh(root, shared.box, shared.structure, [0.7, 0.08, 0], [1.7, 0.16, 1.1]);

    const lowerArm = new Group();
    lowerArm.position.set(0.18, 2.45, 0);
    mesh(
      lowerArm,
      shared.box,
      shared.structureBright,
      [0.78, 0, 0],
      [1.55, 0.14, 0.25],
    );
    root.add(lowerArm);
    const upperArm = new Group();
    upperArm.position.set(0.18, 3.02, 0);
    mesh(
      upperArm,
      shared.box,
      shared.structureBright,
      [0.78, 0, 0],
      [1.55, 0.14, 0.25],
    );
    root.add(upperArm);

    const propellant = createStatusNode(root, [-0.65, 0.38, 0.38]);
    const ignition = createStatusNode(root, [0, 0.38, 0.38]);
    const payload = createStatusNode(root, [0.65, 0.38, 0.38]);
    const health = createStatusNode(root, [0.1, 4.58, 0]);
    const controllerHealth = createStatusNode(root, [-0.72, 1.35, 0.42]);
    parent.add(root);
    return {
      root,
      lowerArm,
      upperArm,
      propellant,
      ignition,
      payload,
      health,
      controllerHealth,
    };
  }

  function setClamps(tower, openness) {
    const amount = clamp01(openness);
    tower.lowerArm.rotation.z = lerp(0, -0.48, amount);
    tower.upperArm.rotation.z = lerp(0, 0.48, amount);
  }

  function makeObserverSatellite(parent, accentColor) {
    const root = new Group();
    mesh(
      root,
      shared.box,
      shared.structureBright,
      [0, 0, 0],
      [0.42, 0.32, 0.36],
    );
    mesh(root, shared.box, shared.craftDark, [-0.56, 0, 0], [0.64, 0.06, 0.36]);
    mesh(root, shared.box, shared.craftDark, [0.56, 0, 0], [0.64, 0.06, 0.36]);
    const eyeMaterial = makeDynamicMaterial(accentColor, 1);
    mesh(root, shared.circle, eyeMaterial, [0, -0.02, 0.22], [0.2, 0.2, 0.2]);
    const beamMaterial = makeDynamicMaterial(accentColor, 0);
    const beam = mesh(
      root,
      shared.cone,
      beamMaterial,
      [0, -0.7, 0.1],
      [0.42, 1.2, 0.42],
      [0, 0, Math.PI],
    );
    beam.visible = false;
    root.visible = false;
    parent.add(root);
    return { root, beam, beamMaterial, eyeMaterial };
  }

  function makeRadar(parent, accentColor) {
    const root = new Group();
    root.position.set(-2.25, 0.2, 0.25);
    mesh(
      root,
      shared.cylinder,
      shared.structure,
      [0, 0.25, 0],
      [0.35, 0.5, 0.35],
    );
    const dish = mesh(
      root,
      shared.circle,
      shared.structureBright,
      [0, 0.72, 0],
      [0.72, 0.72, 0.72],
      [-Math.PI / 3, 0, 0],
    );
    const sweepMaterial = makeDynamicMaterial(accentColor, 0);
    const sweep = mesh(
      root,
      shared.cone,
      sweepMaterial,
      [0.7, 1.1, 0],
      [0.65, 1.8, 0.65],
      [0, 0, -Math.PI / 2],
    );
    sweep.visible = false;
    root.visible = false;
    parent.add(root);
    return { root, dish, sweep, sweepMaterial };
  }

  function makeEvidenceBoard(parent) {
    const root = new Group();
    root.position.set(-2.2, 4.55, 0.1);
    const panelMaterial = makeDynamicMaterial(COLORS.structure, 0.86);
    mesh(root, shared.box, panelMaterial, [0, 0, 0], [1.65, 1.92, 0.16]);
    const rows = [
      createStatusNode(root, [-0.45, 0.65, 0.12]),
      createStatusNode(root, [-0.45, 0.22, 0.12]),
      createStatusNode(root, [-0.45, -0.22, 0.12]),
      createStatusNode(root, [-0.45, -0.65, 0.12]),
    ];
    for (let index = 0; index < 4; index += 1) {
      mesh(
        root,
        shared.box,
        shared.structureBright,
        [0.28, 0.65 - index * 0.43, 0.1],
        [0.7, 0.07, 0.08],
      );
    }
    root.visible = false;
    parent.add(root);
    return { root, rows, panelMaterial };
  }

  function makeRouteMarkers(parent) {
    const root = new Group();
    const positions = [
      [1.45, 5.35, -0.35],
      [-1.8, 4.75, 0.15],
      [0, 3.75, 0.35],
      [2.05, 0.15, 0.2],
    ];
    const markers = positions.map((position) => {
      const markerRoot = new Group();
      markerRoot.position.set(...position);
      const markerMaterial = makeDynamicMaterial(COLORS.right, 0);
      mesh(
        markerRoot,
        shared.torus,
        markerMaterial,
        [0, 0, 0],
        [0.72, 0.72, 0.72],
        [Math.PI / 2, 0, 0],
      );
      mesh(
        markerRoot,
        shared.box,
        markerMaterial,
        [0, 0, 0],
        [0.22, 0.06, 0.06],
      );
      markerRoot.visible = false;
      root.add(markerRoot);
      return { root: markerRoot, material: markerMaterial };
    });
    parent.add(root);
    return { root, markers };
  }

  function makeSimulationGhost(parent) {
    const root = new Group();
    root.position.set(2.05, 4.25, -0.3);
    root.scale.setScalar(0.34);
    const frameMaterial = makeDynamicMaterial(COLORS.right, 0.32);
    mesh(
      root,
      shared.torus,
      frameMaterial,
      [0, 2.15, 0],
      [4.6, 4.6, 4.6],
      [Math.PI / 2, 0, 0],
    );
    const tower = makeTower(root);
    const vehicle = makeReusableHeavyVehicle(root, true);
    const anomaly = createStatusNode(root, [-1.32, 4.55, 0.05], COLORS.danger);
    root.visible = false;
    parent.add(root);
    return { root, frameMaterial, tower, vehicle, anomaly };
  }

  function makeMissionBay(side) {
    const root = new Group();
    const accentColor = side === LEFT ? COLORS.left : COLORS.right;

    const world = new Group();
    root.add(world);
    const earth = mesh(
      world,
      shared.sphere,
      shared.earth,
      [0, -3.25, -1.65],
      [7.3, 7.3, 2.2],
    );
    const atmosphereMaterial = makeDynamicMaterial(COLORS.atmosphere, 0.24);
    const atmosphere = mesh(
      world,
      shared.orbitTorus,
      atmosphereMaterial,
      [0, -3.25, -1.58],
      [7.45, 7.45, 7.45],
    );
    const orbitMaterial = makeDynamicMaterial(COLORS.structureBright, 0.18);
    const targetOrbitMaterial = makeDynamicMaterial(COLORS.right, 0.34);
    const wrongOrbitMaterial = makeDynamicMaterial(COLORS.warning, 0.26);
    const orbit = mesh(
      world,
      shared.orbitTorus,
      orbitMaterial,
      [0, -3.25, -1.5],
      [8.15, 8.15, 8.15],
    );
    const targetOrbit = mesh(
      world,
      shared.orbitTorus,
      targetOrbitMaterial,
      [0.15, -3.15, -1.46],
      [9.05, 8.55, 9.05],
      [0, 0, 0.07],
    );
    const wrongOrbit = mesh(
      world,
      shared.orbitTorus,
      wrongOrbitMaterial,
      [-0.15, -3.2, -1.44],
      [8.55, 9.2, 8.55],
      [0, 0, -0.08],
    );

    const ground = new Group();
    mesh(
      ground,
      shared.plane,
      shared.water,
      [0, -0.08, 0],
      [6.4, 5.2, 1],
      [-Math.PI / 2, 0, 0],
    );
    const padMaterial = makeDynamicMaterial(accentColor, 0.14);
    mesh(
      ground,
      shared.ring,
      padMaterial,
      [0, 0.01, 0],
      [1.7, 1.7, 1.7],
      [-Math.PI / 2, 0, 0],
    );
    const offshoreMaterial = makeDynamicMaterial(COLORS.right, 0.2);
    const offshore = mesh(
      ground,
      shared.torus,
      offshoreMaterial,
      [2.05, 0.02, 0.1],
      [1.2, 1.2, 1.2],
      [Math.PI / 2, 0, 0],
    );
    world.add(ground);

    const tower = makeTower(world);
    const vehicle = makeReusableHeavyVehicle(world);

    const leftPlanPoints = makeQuadraticPoints(
      [0, 4.45, 0],
      [-0.3, 5.2, -0.2],
      [-1.65, 5.45, -0.4],
      22,
    );
    const rightPlanPoints = makeCompositePoints([
      [
        [0, 0.05, 0],
        [0.1, 3.3, -0.15],
        [1.45, 5.35, -0.35],
      ],
      [
        [1.45, 5.35, -0.35],
        [2.75, 3.4, -0.2],
        [2.05, 0.15, 0.2],
      ],
    ]);
    const ambiguousRoute = createDottedRoute(
      world,
      leftPlanPoints,
      COLORS.warning,
    );
    const exactRoute = createRoute(world, rightPlanPoints, COLORS.right, 0.92);
    const routeMarkers = makeRouteMarkers(world);

    const staleCatchRoute = createRoute(
      world,
      makeQuadraticPoints([0, 4.3, 0], [-0.45, 2.4, 0], [0.45, 0.05, 0.35]),
      COLORS.warning,
      0.75,
    );
    const divertRoute = createRoute(
      world,
      makeQuadraticPoints([0, 4.3, 0], [2.35, 3.0, -0.15], [2.05, 0.05, 0.1]),
      COLORS.right,
      0.92,
    );
    const telemetryRoute = createRoute(
      world,
      makeCompositePoints([
        [
          [0, 0.05, 0],
          [0, 3.3, 0],
          [1.45, 5.35, -0.35],
        ],
        [
          [1.45, 5.35, -0.35],
          [2.4, 2.8, -0.15],
          [2.05, 0.05, 0.1],
        ],
      ]),
      COLORS.right,
      0.52,
    );

    const actors = {
      broadMission: createActor(world, "packet", COLORS.warning, 0.8),
      launchInstruction: createActor(world, "request", accentColor, 0.75),
      wildcard: createActor(world, "go", COLORS.warning, 1.1),
      scopedTokens: [
        createActor(world, "token", COLORS.right, 0.86),
        createActor(world, "token", COLORS.right, 0.86),
        createActor(world, "token", COLORS.right, 0.86),
      ],
      readyActors: [
        createActor(world, "ack", COLORS.success, 0.68),
        createActor(world, "ack", COLORS.success, 0.68),
        createActor(world, "ack", COLORS.success, 0.68),
      ],
      goActor: createActor(world, "go", COLORS.right, 0.76),
      separationRequest: createActor(world, "request", accentColor, 0.96),
      repeatedRequest: createActor(world, "request", COLORS.warning, 1),
      engineReady: createActor(world, "ack", COLORS.success, 1.14),
      separatedAck: createActor(world, "packet", COLORS.right, 0.96),
      noGo: createActor(world, "no-go", COLORS.danger, 0.7),
      retainedState: createActor(world, "packet", COLORS.right, 0.72),
      selfCheck: createActor(world, "ack", COLORS.success, 1.05),
      evidencePacket: createActor(world, "packet", COLORS.right, 0.72),
      overallVerified: createActor(world, "ack", COLORS.right, 1.18),
    };

    const observers = [
      makeObserverSatellite(world, COLORS.right),
      makeObserverSatellite(world, COLORS.right),
    ];
    const radar = makeRadar(world, COLORS.right);
    const evidence = makeEvidenceBoard(world);
    const simulation = makeSimulationGhost(world);

    const missionPulseMaterial = makeDynamicMaterial(COLORS.warning, 0);
    const missionPulse = mesh(
      world,
      shared.torus,
      missionPulseMaterial,
      [0, 3.3, 0],
      [1, 1, 1],
      [Math.PI / 2, 0, 0],
    );
    missionPulse.visible = false;

    const wildcardWaveMaterial = makeDynamicMaterial(COLORS.warning, 0);
    const wildcardWave = mesh(
      world,
      shared.torus,
      wildcardWaveMaterial,
      [-1.42, 0.5, 0.25],
      [1, 1, 1],
      [Math.PI / 2, 0, 0],
    );
    wildcardWave.visible = false;

    const landingBurnMaterial = makeDynamicMaterial(COLORS.right, 0);
    const landingBurn = mesh(
      world,
      shared.cone,
      landingBurnMaterial,
      [0, 0, 0],
      [0.34, 1.05, 0.34],
      [0, 0, Math.PI],
    );
    landingBurn.visible = false;

    return {
      root,
      side,
      accentColor,
      world,
      earth,
      atmosphere,
      atmosphereMaterial,
      orbit,
      orbitMaterial,
      targetOrbit,
      targetOrbitMaterial,
      wrongOrbit,
      wrongOrbitMaterial,
      ground,
      offshore,
      offshoreMaterial,
      tower,
      vehicle,
      ambiguousRoute,
      exactRoute,
      routeMarkers,
      staleCatchRoute,
      divertRoute,
      telemetryRoute,
      actors,
      observers,
      radar,
      evidence,
      simulation,
      missionPulse,
      missionPulseMaterial,
      wildcardWave,
      wildcardWaveMaterial,
      landingBurn,
      landingBurnMaterial,
    };
  }

  function makeMissionPair() {
    const root = new Group();
    const left = makeMissionBay(LEFT);
    const right = makeMissionBay(RIGHT);
    root.add(left.root, right.root);
    return { root, left, right };
  }

  function resetBayActors(bay) {
    Object.values(bay.actors).forEach((entry) => {
      if (Array.isArray(entry)) entry.forEach(hideActor);
      else hideActor(entry);
    });
    bay.routeMarkers.markers.forEach((marker) => {
      marker.root.visible = false;
      marker.material.opacity = 0;
      marker.root.scale.setScalar(0.94);
    });
    setDottedRoute(bay.ambiguousRoute, 0);
    setRoute(bay.exactRoute, 0);
    setRoute(bay.staleCatchRoute, 0);
    setRoute(bay.divertRoute, 0);
    setRoute(bay.telemetryRoute, 0);
    bay.missionPulse.visible = false;
    bay.missionPulseMaterial.opacity = 0;
    bay.wildcardWave.visible = false;
    bay.wildcardWaveMaterial.opacity = 0;
    bay.landingBurn.visible = false;
    bay.landingBurnMaterial.opacity = 0;
    bay.observers.forEach((observer) => {
      observer.root.visible = false;
      observer.beam.visible = false;
      observer.beamMaterial.opacity = 0;
    });
    bay.radar.root.visible = false;
    bay.radar.sweep.visible = false;
    bay.radar.sweepMaterial.opacity = 0;
    bay.evidence.root.visible = false;
    bay.evidence.rows.forEach((row) =>
      setStatusNode(row, COLORS.structureBright, 0.15, 0),
    );
    bay.simulation.root.visible = false;
    bay.simulation.frameMaterial.opacity = 0;
    bay.landingBurn.position.set(0, 0, 0);
  }

  function prepareBay(bay, stageKey) {
    resetBayActors(bay);
    resetVehicle(bay.vehicle);
    bay.world.visible = true;
    bay.ground.visible =
      stageKey === "permission" ||
      stageKey === "recovery" ||
      stageKey === "verification";
    bay.tower.root.visible =
      stageKey === "permission" ||
      stageKey === "recovery" ||
      stageKey === "verification";
    bay.orbit.visible =
      stageKey === "coordinates" ||
      stageKey === "handshake" ||
      stageKey === "verification";
    bay.targetOrbit.visible =
      stageKey === "coordinates" ||
      stageKey === "handshake" ||
      stageKey === "verification";
    bay.wrongOrbit.visible =
      stageKey === "coordinates" ||
      stageKey === "handshake" ||
      stageKey === "verification";
    bay.atmosphereMaterial.opacity = stageKey === "permission" ? 0.13 : 0.24;
    bay.orbitMaterial.opacity = 0.15;
    bay.targetOrbitMaterial.opacity =
      bay.side === RIGHT && stageKey !== "permission" ? 0.32 : 0.1;
    bay.wrongOrbitMaterial.opacity =
      bay.side === LEFT && stageKey !== "permission" ? 0.28 : 0.08;
    bay.offshoreMaterial.opacity =
      stageKey === "recovery" || stageKey === "verification" ? 0.26 : 0.08;
    setClamps(bay.tower, 0);
    setStatusNode(bay.tower.propellant, COLORS.structureBright, 0.6, 0);
    setStatusNode(bay.tower.ignition, COLORS.structureBright, 0.6, 0);
    setStatusNode(bay.tower.payload, COLORS.structureBright, 0.6, 0);
    setStatusNode(bay.tower.health, COLORS.success, 0.72, 0);
    setStatusNode(bay.tower.controllerHealth, COLORS.success, 0.55, 0);
  }

  function setPadPose(vehicle) {
    vehicle.root.position.set(0, 0, 0);
    vehicle.root.rotation.set(0, 0, 0);
    vehicle.booster.position.set(0, 0, 0);
    vehicle.booster.rotation.set(0, 0, 0);
    vehicle.upper.position.set(0, 2.62, 0);
    vehicle.upper.rotation.set(0, 0, 0);
    vehicle.interstage.position.set(0, 2.62, 0);
    vehicle.interstage.rotation.set(0, 0, 0);
    vehicle.interstage.visible = true;
  }

  function setLaunchBoundaryPose(vehicle) {
    setPadPose(vehicle);
    vehicle.root.position.y = 3.6;
    setBoosterEngine(vehicle, 1);
  }

  function setSeparationBoundaryPose(vehicle, side) {
    vehicle.root.position.set(0, 5, 0);
    vehicle.booster.position.set(-0.2, -0.7, 0);
    vehicle.booster.rotation.set(0, 0, TAU);
    vehicle.upper.position.set(
      side === LEFT ? -1.65 : 1.45,
      side === LEFT ? 1.35 : 1.45,
      -0.35,
    );
    vehicle.upper.rotation.set(0, 0, side === LEFT ? -0.08 : 0);
    vehicle.interstage.position.set(-0.1, -0.18, 0.05);
    vehicle.interstage.rotation.set(0.35, 0.1, 0.2);
    vehicle.interstage.visible = true;
    vehicle.payloadDoorPivot.rotation.x = 0;
    setBoosterEngine(vehicle, 0.18);
    setUpperEngine(vehicle, 1);
  }

  function setRecoveryBoundaryPose(vehicle, side) {
    vehicle.root.position.set(0, 5, 0);
    vehicle.booster.position.set(
      side === LEFT ? 0.45 : 2.05,
      -5,
      side === LEFT ? 0.36 : 0.1,
    );
    vehicle.booster.rotation.set(0, 0, side === LEFT ? 0.34 : 0);
    vehicle.upper.position.set(
      side === LEFT ? -1.85 : 1.85,
      side === LEFT ? 1.52 : 1.62,
      -0.42,
    );
    vehicle.upper.rotation.set(0, 0, side === LEFT ? -0.08 : 0);
    vehicle.interstage.position.set(-0.45, -0.65, 0.05);
    vehicle.interstage.rotation.set(0.35, 0.1, 0.2);
    vehicle.interstage.visible = false;
    setBoosterEngine(vehicle, 0);
    setUpperEngine(vehicle, 0.22);
  }

  function updateCoordinates(mission, time) {
    for (const bay of [mission.left, mission.right]) {
      prepareBay(bay, "coordinates");
      setPadPose(bay.vehicle);
      bay.tower.root.visible = true;
      bay.tower.root.scale.setScalar(1);
      bay.ground.visible = true;
      bay.ground.scale.setScalar(1);

      const reveal = range(time, 0, 800, easeOut);
      bay.vehicle.root.scale.setScalar(0.82 * lerp(0.95, 1, reveal));
      bay.vehicle.root.position.y = lerp(-0.18, 0, reveal);
      bay.atmosphereMaterial.opacity = reveal * 0.24;

      if (time >= 800) {
        const tokenIn = range(time, 800, 1250, easeOut);
        const tokenHold = time < 1800 ? 1 : range(time, 1800, 2050, easeOut);
        bay.actors.broadMission.root.position.set(0, 4.72, 0.35);
        showActor(
          bay.actors.broadMission,
          tokenIn * (time < 1800 ? 1 : 1 - tokenHold),
          tokenIn,
        );
        bay.missionPulse.visible = true;
        bay.missionPulseMaterial.opacity = tokenIn * 0.42;
        bay.missionPulse.scale.setScalar(lerp(0.8, 1.7, tokenIn));
      }

      if (bay.side === LEFT) {
        const route = range(time, 1800, 4200, easeOut);
        setDottedRoute(bay.ambiguousRoute, route, 0.92);
        bay.wrongOrbitMaterial.opacity = lerp(0.18, 0.5, route);
        bay.targetOrbitMaterial.opacity = 0.08;
      } else {
        bay.routeMarkers.markers.forEach((marker, index) => {
          const markerReveal = range(
            time,
            1950 + index * 60,
            2270 + index * 60,
            easeOut,
          );
          marker.root.visible = markerReveal > 0;
          marker.material.opacity = markerReveal;
          marker.root.scale.setScalar(lerp(0.94, 1, markerReveal));
        });
        const route = range(time, 2400, 4200, easeInOut);
        setRoute(bay.exactRoute, route, 0.95);
        bay.targetOrbitMaterial.opacity = lerp(0.2, 0.55, route);
        bay.wrongOrbitMaterial.opacity = 0.06;
      }
    }
  }

  function updatePermission(mission, time) {
    for (const bay of [mission.left, mission.right]) {
      prepareBay(bay, "permission");
      setPadPose(bay.vehicle);

      const contextReveal = range(time, 0, 800, easeInOut);
      bay.ground.visible = true;
      bay.ground.scale.setScalar(1);
      bay.tower.root.visible = true;
      bay.tower.root.scale.setScalar(1);
      bay.atmosphereMaterial.opacity = lerp(0.24, 0.13, contextReveal);
      const priorRouteFade = 1 - range(time, 0, 800, easeOut);
      bay.orbit.visible = priorRouteFade > 0;
      bay.targetOrbit.visible = priorRouteFade > 0;
      bay.wrongOrbit.visible = priorRouteFade > 0;
      bay.orbitMaterial.opacity = 0.15 * priorRouteFade;
      bay.missionPulse.visible = priorRouteFade > 0;
      bay.missionPulse.position.set(0, 3.3, 0);
      bay.missionPulse.scale.setScalar(1.7);
      bay.missionPulseMaterial.color.setHex(COLORS.warning);
      bay.missionPulseMaterial.opacity = 0.42 * priorRouteFade;
      if (bay.side === LEFT) {
        setDottedRoute(bay.ambiguousRoute, 1, 0.92 * priorRouteFade);
        bay.wrongOrbitMaterial.opacity = 0.5 * priorRouteFade;
        bay.targetOrbitMaterial.opacity = 0.08 * priorRouteFade;
      } else {
        setRoute(bay.exactRoute, 1, 0.95 * priorRouteFade);
        bay.routeMarkers.markers.forEach((marker) => {
          marker.root.visible = priorRouteFade > 0;
          marker.material.opacity = priorRouteFade;
          marker.root.scale.setScalar(1);
        });
        bay.targetOrbitMaterial.opacity = 0.55 * priorRouteFade;
        bay.wrongOrbitMaterial.opacity = 0.06 * priorRouteFade;
      }

      if (time >= 800) {
        const instruction = range(time, 800, 1600, easeOut);
        moveActor(
          bay.actors.launchInstruction,
          PATHS.instruction,
          instruction,
          time < 1700 ? 1 : 1 - range(time, 1600, 1800, easeOut),
        );
      }

      if (bay.side === LEFT) {
        const wildcard = range(time, 1600, 2250, easeOut);
        bay.actors.wildcard.root.position.set(-1.42, 1.05, 0.3);
        showActor(
          bay.actors.wildcard,
          time < 3400 ? wildcard : 1 - range(time, 3400, 3600, easeOut),
          wildcard,
        );
        const wildcardWaveOpacity =
          wildcard * (1 - range(time, 2500, 3500, easeOut)) * 0.72;
        bay.wildcardWave.visible = wildcardWaveOpacity > 0.001;
        bay.wildcardWaveMaterial.opacity = wildcardWaveOpacity;
        bay.wildcardWave.scale.setScalar(lerp(0.8, 5.2, wildcard));
        setStatusNode(bay.tower.propellant, COLORS.warning, 1, wildcard);
        setStatusNode(bay.tower.ignition, COLORS.warning, 1, wildcard);
        setStatusNode(bay.tower.payload, COLORS.danger, 1, wildcard);
        setClamps(bay.tower, wildcard);
        bay.vehicle.payloadDoorPivot.rotation.x = lerp(0, -1.15, wildcard);
        const rock =
          Math.sin(time / 95) * 0.045 * (1 - range(time, 3300, 3800));
        bay.vehicle.root.rotation.z = time >= 2000 ? rock : 0;
      } else {
        const windows = [
          [1600, 2100, bay.tower.propellant],
          [2150, 2700, bay.tower.ignition],
          [2750, 3300, null],
        ];
        windows.forEach((window, index) => {
          const outbound = range(time, window[0], window[1] - 170, easeOut);
          const expire = range(time, window[1] - 80, window[1] + 80, easeOut);
          const targetX = index === 0 ? -2.07 : index === 1 ? -1.42 : -0.62;
          quadraticVector(
            bay.actors.scopedTokens[index].root.position,
            [-2.65, 1.15, 0.45],
            [targetX - 0.35, 1.65, 0.2],
            [targetX, 0.45, 0.38],
            outbound,
          );
          showActor(
            bay.actors.scopedTokens[index],
            outbound * (1 - expire),
            outbound,
          );

          const ready = range(time, window[1] - 170, window[1] + 120, easeOut);
          quadraticVector(
            bay.actors.readyActors[index].root.position,
            [targetX, 0.55, 0.4],
            [targetX - 0.6, 1.1, 0.3],
            [-2.62, 1.35, 0.45],
            ready,
          );
          showActor(
            bay.actors.readyActors[index],
            time < window[1] + 180
              ? ready
              : 1 - range(time, window[1] + 180, window[1] + 300),
            ready,
          );
          if (window[2] && time >= window[1] - 170) {
            setStatusNode(window[2], COLORS.success, 1, ready);
          }
        });
        const finalGo = range(time, 3180, 3480, easeOut);
        quadraticVector(
          bay.actors.goActor.root.position,
          [-2.62, 1.35, 0.45],
          [-1.7, 1.75, 0.25],
          [-0.6, 2.75, 0.05],
          finalGo,
        );
        showActor(
          bay.actors.goActor,
          finalGo * (1 - range(time, 3480, 3620, easeOut)),
          finalGo,
        );
        setClamps(bay.tower, range(time, 3300, 3600, easeOut));
        setStatusNode(bay.tower.payload, COLORS.structureBright, 0.7, 0);
        bay.vehicle.payloadDoorPivot.rotation.x = 0;
      }

      if (time >= 3600) {
        const ignition = range(time, 3600, 4050, easeOut);
        const ascent = range(time, 3900, 5600, easeInOut);
        setBoosterEngine(bay.vehicle, ignition, bay.accentColor);
        bay.vehicle.root.position.y = lerp(0, 3.6, ascent);
        bay.vehicle.root.rotation.z *= 1 - ascent;
        if (bay.side === LEFT) {
          bay.vehicle.payloadDoorPivot.rotation.x = -1.15;
        }
      }
    }
  }

  function updateHandshake(mission, time) {
    for (const bay of [mission.left, mission.right]) {
      prepareBay(bay, "handshake");
      setLaunchBoundaryPose(bay.vehicle);
      const priorContextFade = 1 - range(time, 0, 800, easeInOut);
      bay.ground.visible = priorContextFade > 0;
      bay.ground.scale.setScalar(priorContextFade);
      bay.tower.root.visible = priorContextFade > 0;
      bay.tower.root.scale.setScalar(priorContextFade);
      bay.atmosphereMaterial.opacity = lerp(0.13, 0.24, 1 - priorContextFade);
      setClamps(bay.tower, 1);
      if (bay.side === LEFT) {
        setStatusNode(bay.tower.propellant, COLORS.warning, 1, 1);
        setStatusNode(bay.tower.ignition, COLORS.warning, 1, 1);
        setStatusNode(bay.tower.payload, COLORS.danger, 1, 1);
      } else {
        setStatusNode(bay.tower.propellant, COLORS.success, 1, 1);
        setStatusNode(bay.tower.ignition, COLORS.success, 1, 1);
        setStatusNode(bay.tower.payload, COLORS.structureBright, 0.7, 0);
      }

      const trajectoryVisibility =
        range(time, 0, 900, easeOut) * (1 - range(time, 5200, 6100, easeInOut));
      bay.orbit.visible = trajectoryVisibility > 0;
      bay.targetOrbit.visible = trajectoryVisibility > 0;
      bay.wrongOrbit.visible = trajectoryVisibility > 0;
      bay.orbitMaterial.opacity = 0.15 * trajectoryVisibility;
      if (bay.side === LEFT) {
        setDottedRoute(bay.ambiguousRoute, 1, 0.44 * trajectoryVisibility);
        bay.wrongOrbitMaterial.opacity = 0.4 * trajectoryVisibility;
        bay.targetOrbitMaterial.opacity = 0.08 * trajectoryVisibility;
      } else {
        setRoute(bay.exactRoute, 1, 0.48 * trajectoryVisibility);
        bay.routeMarkers.markers.forEach((marker) => {
          marker.root.visible = trajectoryVisibility > 0;
          marker.material.opacity = 0.55 * trajectoryVisibility;
          marker.root.scale.setScalar(1);
        });
        bay.targetOrbitMaterial.opacity = 0.44 * trajectoryVisibility;
        bay.wrongOrbitMaterial.opacity = 0.06 * trajectoryVisibility;
      }

      const ascent = range(time, 0, 900, easeInOut);
      bay.vehicle.root.position.y = lerp(3.6, 5, ascent);
      bay.vehicle.payloadDoorPivot.rotation.x =
        bay.side === LEFT ? lerp(-1.15, -0.25, ascent) : 0;
      setBoosterEngine(bay.vehicle, 1, bay.accentColor);

      if (time >= 900) {
        const request = range(time, 900, 1900, easeInOut);
        moveActor(
          bay.actors.separationRequest,
          PATHS.handshakeRequest,
          request,
          time < 2050 ? 1 : 1 - range(time, 2050, 2200, easeOut),
        );
      }

      if (bay.side === LEFT) {
        if (time >= 2200) {
          const assumed = range(time, 2200, 2700, easeOut);
          const assumedOpacity =
            assumed * (1 - range(time, 3200, 3600, easeOut)) * 0.65;
          bay.missionPulse.visible = assumedOpacity > 0.001;
          bay.missionPulse.position.set(-2.55, 3.55, 0.35);
          bay.missionPulseMaterial.color.setHex(COLORS.warning);
          bay.missionPulseMaterial.opacity = assumedOpacity;
          bay.missionPulse.scale.setScalar(lerp(0.65, 1.35, assumed));
        }
        if (time >= 2750) {
          const repeat = range(time, 2750, 3500, easeInOut);
          moveActor(
            bay.actors.repeatedRequest,
            PATHS.handshakeRequest,
            repeat,
            time < 3650 ? 0.9 : 1 - range(time, 3650, 3800, easeOut),
          );
        }

        const upperReady = range(time, 2300, 2900, easeOut);
        setUpperEngine(bay.vehicle, upperReady, bay.accentColor);
        const separate = range(time, 2850, 4550, easeInOut);
        bay.vehicle.booster.position.set(
          lerp(0, -0.2, separate),
          lerp(0, -0.7, separate),
          0,
        );
        bay.vehicle.upper.position.set(
          lerp(0, -0.65, separate),
          lerp(2.62, 3.45, separate),
          lerp(0, -0.18, separate),
        );
        bay.vehicle.upper.rotation.z = lerp(0, -0.16, separate);
        bay.vehicle.interstage.position.set(
          lerp(0, -0.1, separate),
          lerp(2.62, 4.82, separate),
          lerp(0, 0.05, separate),
        );
        bay.vehicle.interstage.rotation.z = separate * 0.2;
        setBoosterEngine(
          bay.vehicle,
          lerp(1, 0.18, range(time, 3050, 4200, easeInOut)),
          bay.accentColor,
        );
        if (time >= 4550) {
          const correction = range(time, 4550, 5700, easeInOut);
          bay.vehicle.upper.position.set(
            lerp(-0.65, -1.65, correction),
            lerp(3.45, 1.35, correction),
            lerp(-0.18, -0.35, correction),
          );
          bay.vehicle.upper.rotation.z = lerp(-0.16, -0.08, correction);
          bay.vehicle.payloadDoorPivot.rotation.x = lerp(-0.25, 0, correction);
        }
        const flip = range(time, 4700, 6100, easeInOut);
        bay.vehicle.booster.rotation.z = TAU * flip;
      } else {
        const readyPhysical = range(time, 1900, 2350, easeOut);
        setUpperEngine(bay.vehicle, readyPhysical, bay.accentColor);
        if (time >= 2300) {
          const readyAck = range(time, 2300, 3000, easeInOut);
          moveActor(
            bay.actors.engineReady,
            PATHS.readyReturn,
            readyAck,
            time < 3200 ? 1 : 1 - range(time, 3200, 3380, easeOut),
          );
        }

        const separate = range(time, 3150, 4550, easeInOut);
        bay.vehicle.booster.position.set(
          lerp(0, -0.2, separate),
          lerp(0, -0.7, separate),
          0,
        );
        bay.vehicle.upper.position.set(
          lerp(0, 0.6, separate),
          lerp(2.62, 3.55, separate),
          lerp(0, -0.2, separate),
        );
        bay.vehicle.interstage.position.set(
          lerp(0, -0.1, separate),
          lerp(2.62, 4.82, separate),
          lerp(0, 0.05, separate),
        );
        bay.vehicle.interstage.rotation.set(
          separate * 0.35,
          separate * 0.1,
          separate * 0.2,
        );
        setBoosterEngine(
          bay.vehicle,
          lerp(1, 0.18, range(time, 3150, 4550, easeInOut)),
          bay.accentColor,
        );
        if (time >= 4550) {
          const orbitEntry = range(time, 4550, 5700, easeInOut);
          bay.vehicle.upper.position.set(
            lerp(0.6, 1.45, orbitEntry),
            lerp(3.55, 1.45, orbitEntry),
            lerp(-0.2, -0.35, orbitEntry),
          );
          const separatedAck = range(time, 4550, 5350, easeInOut);
          moveActor(
            bay.actors.separatedAck,
            PATHS.readyReturn,
            separatedAck,
            time < 5550 ? 1 : 1 - range(time, 5550, 5700, easeOut),
          );
        }
        const flip = range(time, 5350, 6100, easeInOut);
        bay.vehicle.booster.rotation.z = TAU * flip;
      }

      if (time >= 4550) {
        const interstageSettle = range(time, 4550, 6100, easeInOut);
        bay.vehicle.interstage.position.set(
          -0.1,
          lerp(4.82, -0.18, interstageSettle),
          0.05,
        );
        bay.vehicle.interstage.rotation.set(
          lerp(bay.side === LEFT ? 0 : 0.35, 0.35, interstageSettle),
          lerp(bay.side === LEFT ? 0 : 0.1, 0.1, interstageSettle),
          0.2,
        );
      }

      if (time >= 6100) setSeparationBoundaryPose(bay.vehicle, bay.side);
    }
  }

  function updateRecovery(mission, time) {
    for (const bay of [mission.left, mission.right]) {
      prepareBay(bay, "recovery");
      setSeparationBoundaryPose(bay.vehicle, bay.side);
      const contextReveal = range(time, 0, 800, easeInOut);
      bay.ground.visible = contextReveal > 0;
      bay.ground.scale.setScalar(contextReveal);
      bay.tower.root.visible = contextReveal > 0;
      bay.tower.root.scale.setScalar(contextReveal);

      const approach = range(time, 0, 1200, easeInOut);
      bay.vehicle.booster.position.set(
        lerp(-0.2, 0, approach),
        lerp(-0.7, -1.05, approach),
        0,
      );
      bay.vehicle.booster.rotation.z = lerp(TAU, 0, approach);
      bay.vehicle.upper.position.set(
        lerp(
          bay.side === LEFT ? -1.65 : 1.45,
          bay.side === LEFT ? -1.85 : 1.85,
          range(time, 0, 6800, easeInOut),
        ),
        lerp(
          bay.side === LEFT ? 1.35 : 1.45,
          bay.side === LEFT ? 1.52 : 1.62,
          range(time, 0, 6800, easeInOut),
        ),
        lerp(-0.35, -0.42, range(time, 0, 6800, easeInOut)),
      );
      bay.vehicle.interstage.position.set(
        lerp(-0.1, -0.45, range(time, 0, 800, easeInOut)),
        lerp(-0.18, -0.65, range(time, 0, 800, easeInOut)),
        0.05,
      );
      bay.vehicle.interstage.visible = time < 800;
      setBoosterEngine(
        bay.vehicle,
        lerp(0.18, 0.08, approach),
        bay.accentColor,
      );
      setUpperEngine(
        bay.vehicle,
        lerp(1, 0.22, range(time, 0, 1800, easeInOut)),
        bay.accentColor,
      );

      if (time >= 1200) {
        const anomaly = range(time, 1200, 2500, easeOut);
        const healthSettle = range(time, 6400, 6800, easeInOut);
        const pulse =
          (0.5 + Math.sin((time - 1200) / 150) * 0.5) * (1 - healthSettle);
        setStatusNode(
          bay.tower.health,
          COLORS.danger,
          lerp(anomaly, 0.92, healthSettle),
          pulse,
        );
        if (bay.side === LEFT) {
          setStatusNode(bay.tower.controllerHealth, COLORS.success, 0.9, 0);
        } else {
          setStatusNode(
            bay.tower.controllerHealth,
            time < 2500 ? COLORS.success : COLORS.danger,
            0.9,
            anomaly * (1 - healthSettle),
          );
        }
      }

      if (bay.side === LEFT) {
        const staleRoute = range(time, 2500, 4300, easeInOut);
        setRoute(bay.staleCatchRoute, staleRoute, 0.84);
        if (time >= 2500) {
          const descent = range(time, 2500, 6000, easeInOut);
          quadraticVector(
            bay.vehicle.booster.position,
            [0, -1.05, 0],
            [-0.35, -3.2, 0],
            [0.45, -5, 0.36],
            descent,
          );
          bay.vehicle.booster.rotation.z = lerp(
            0,
            0.34,
            range(time, 4700, 6200, easeInOut),
          );
          setBoosterEngine(
            bay.vehicle,
            lerp(0.08, 0.5, range(time, 4300, 5700, easeOut)) *
              (1 - range(time, 5900, 6400, easeOut)),
            bay.accentColor,
          );
        }
        setClamps(bay.tower, 0);
        if (time >= 5200 && time < 6400) {
          bay.landingBurn.visible = true;
          bay.landingBurn.position.set(
            bay.vehicle.booster.position.x,
            bay.vehicle.root.position.y + bay.vehicle.booster.position.y - 0.55,
            bay.vehicle.booster.position.z,
          );
          bay.landingBurn.rotation.z = bay.vehicle.booster.rotation.z;
          bay.landingBurnMaterial.color.setHex(COLORS.warning);
          bay.landingBurnMaterial.opacity =
            range(time, 5200, 5600, easeOut) *
            (1 - range(time, 6000, 6400, easeOut)) *
            0.5;
        }
      } else {
        if (time >= 2500) {
          const noGo = range(time, 2500, 3300, easeInOut);
          moveActor(
            bay.actors.noGo,
            PATHS.noGoReturn,
            noGo,
            time < 3550 ? 1 : 1 - range(time, 3550, 3750, easeOut),
          );
          bay.actors.retainedState.root.position.set(-2.65, 1.9, 0.45);
          showActor(
            bay.actors.retainedState,
            range(time, 2750, 3150, easeOut),
            1,
          );
        }
        const divert = range(time, 3000, 4300, easeInOut);
        setRoute(bay.divertRoute, divert, 0.95);
        const descent = range(time, 3300, 6100, easeInOut);
        const landingBurn =
          range(time, 4750, 5300, easeOut) *
          (1 - range(time, 5900, 6400, easeOut));
        if (time >= 3300) {
          quadraticVector(
            bay.vehicle.booster.position,
            [0, -1.05, 0],
            [2.4, -2.75, -0.12],
            [2.05, -5, 0.1],
            descent,
          );
          bay.vehicle.booster.rotation.z = Math.sin(descent * Math.PI) * -0.11;
          setBoosterEngine(
            bay.vehicle,
            Math.max(0.08, landingBurn) *
              (1 - range(time, 6400, 6800, easeInOut)),
            bay.accentColor,
          );
        }
        if (time >= 4700 && time < 6400) {
          bay.landingBurn.visible = true;
          bay.landingBurn.position.set(
            bay.vehicle.booster.position.x,
            bay.vehicle.root.position.y + bay.vehicle.booster.position.y - 0.62,
            bay.vehicle.booster.position.z,
          );
          bay.landingBurnMaterial.color.setHex(COLORS.right);
          bay.landingBurnMaterial.opacity = landingBurn * 0.72;
        }
        const telemetry = range(time, 3000, 6100, easeInOut);
        setRoute(bay.telemetryRoute, telemetry, 0.58);
      }

      if (time >= 6800) setRecoveryBoundaryPose(bay.vehicle, bay.side);
    }
  }

  function updateVerification(mission, time) {
    for (const bay of [mission.left, mission.right]) {
      prepareBay(bay, "verification");
      setRecoveryBoundaryPose(bay.vehicle, bay.side);
      bay.ground.visible = true;
      bay.ground.scale.setScalar(1);
      bay.tower.root.visible = true;
      bay.tower.root.scale.setScalar(1);
      setStatusNode(bay.tower.health, COLORS.danger, 0.92, 0);
      setStatusNode(
        bay.tower.controllerHealth,
        bay.side === LEFT ? COLORS.success : COLORS.danger,
        0.9,
        0,
      );
      const evidenceBackdrop = range(time, 0, 900, easeInOut);
      bay.orbit.visible = evidenceBackdrop > 0;
      bay.targetOrbit.visible = evidenceBackdrop > 0;
      bay.wrongOrbit.visible = evidenceBackdrop > 0;
      bay.orbitMaterial.opacity = 0.15 * evidenceBackdrop;
      if (bay.side === RIGHT) {
        setRoute(bay.exactRoute, 1, 0.3 * evidenceBackdrop);
        setRoute(bay.divertRoute, 1, lerp(0.95, 0.55, evidenceBackdrop));
        setRoute(bay.telemetryRoute, 1, lerp(0.58, 0.42, evidenceBackdrop));
        bay.actors.retainedState.root.position.set(-2.65, 1.9, 0.45);
        showActor(bay.actors.retainedState, lerp(1, 0.9, evidenceBackdrop), 1);
      } else {
        setDottedRoute(bay.ambiguousRoute, 1, 0.26 * evidenceBackdrop);
        setRoute(bay.staleCatchRoute, 1, lerp(0.84, 0.32, evidenceBackdrop));
      }

      const selfCheck = range(time, 0, 1000, easeOut);
      bay.actors.selfCheck.root.position.set(0.35, 3.0, 0.48);
      showActor(
        bay.actors.selfCheck,
        bay.side === LEFT
          ? selfCheck
          : selfCheck * (1 - range(time, 1050, 1350, easeOut) * 0.65),
        selfCheck,
      );

      bay.evidence.root.visible = time >= 900;
      bay.evidence.panelMaterial.opacity =
        range(time, 900, 1200, easeOut) * 0.86;

      if (bay.side === LEFT) {
        bay.evidence.rows.forEach((row) =>
          setStatusNode(row, COLORS.structureBright, 0.18, 0),
        );
        bay.wrongOrbitMaterial.opacity = 0.5 * evidenceBackdrop;
        bay.targetOrbitMaterial.opacity = 0.08 * evidenceBackdrop;
      } else {
        bay.targetOrbitMaterial.opacity = 0.5 * evidenceBackdrop;
        bay.wrongOrbitMaterial.opacity = 0.06 * evidenceBackdrop;

        const cameraPass = range(time, 1000, 2050, easeInOut);
        bay.observers.forEach((observer, index) => {
          const offset = index * 0.3;
          observer.root.visible = cameraPass > 0;
          observer.root.position.set(
            lerp(-2.7 + offset, 2.5 + offset, cameraPass),
            5.5 + Math.sin(cameraPass * Math.PI) * (0.4 + index * 0.15),
            -0.15 - index * 0.35,
          );
          observer.root.rotation.y = lerp(-0.45, 0.55, cameraPass);
          observer.beam.visible = cameraPass > 0.08 && cameraPass < 0.94;
          observer.beamMaterial.opacity = Math.sin(cameraPass * Math.PI) * 0.28;
        });

        const radar = range(time, 2050, 2900, easeInOut);
        bay.radar.root.visible = time >= 1950;
        bay.radar.root.rotation.y = lerp(-0.55, 0.65, radar);
        bay.radar.sweep.visible = radar > 0 && radar < 1;
        bay.radar.sweepMaterial.opacity = Math.sin(radar * Math.PI) * 0.25;

        const evidenceTimes = [2950, 3350, 3750, 4150];
        const evidenceColors = [
          COLORS.success,
          COLORS.success,
          COLORS.danger,
          COLORS.success,
        ];
        bay.evidence.rows.forEach((row, index) => {
          const resolve = range(
            time,
            evidenceTimes[index],
            evidenceTimes[index] + 340,
            easeOut,
          );
          setStatusNode(
            row,
            resolve > 0 ? evidenceColors[index] : COLORS.structureBright,
            lerp(0.18, 1, resolve),
            resolve,
          );
        });

        if (time >= 4300) {
          const verified = range(time, 4550, 5050, easeOut);
          bay.actors.overallVerified.root.position.set(-1.15, 3.45, 0.42);
          showActor(
            bay.actors.overallVerified,
            verified * (1 - range(time, 5050, 5250, easeOut) * 0.45),
            verified,
          );
        }

        if (time >= 5100) {
          const packet = range(time, 5100, 5800, easeInOut);
          moveActor(
            bay.actors.evidencePacket,
            PATHS.evidencePacket,
            packet,
            time < 6000 ? 1 : 1 - range(time, 6000, 6200, easeOut),
          );
          const simulationReveal = range(time, 5550, 6100, easeOut);
          bay.simulation.root.visible = simulationReveal > 0;
          bay.simulation.root.scale.setScalar(
            0.34 * lerp(0.94, 1, simulationReveal),
          );
          bay.simulation.frameMaterial.opacity = simulationReveal * 0.34;
          setStatusNode(
            bay.simulation.anomaly,
            COLORS.danger,
            simulationReveal,
            Math.sin(range(time, 5900, 6600) * Math.PI),
          );
          const ghostApproach = range(time, 6000, 6650, easeInOut);
          resetVehicle(bay.simulation.vehicle);
          bay.simulation.vehicle.root.position.set(
            0.55,
            lerp(4.3, 3.2, ghostApproach),
            0,
          );
          bay.simulation.vehicle.root.scale.setScalar(0.82);
          bay.simulation.vehicle.ghostMaterials.forEach((ghostMaterial) => {
            ghostMaterial.opacity = simulationReveal * 0.18;
          });
          setClamps(bay.simulation.tower, 0);
          setStatusNode(
            bay.simulation.tower.health,
            COLORS.danger,
            simulationReveal,
            ghostApproach,
          );
        }
      }
    }
  }

  const stageUpdaters = {
    coordinates: updateCoordinates,
    permission: updatePermission,
    handshake: updateHandshake,
    recovery: updateRecovery,
    verification: updateVerification,
  };

  function buildScene() {
    const value = new Scene();
    value.background = new Color(COLORS.backdrop);
    const ambient = new AmbientLight(0xffffff, 1.85);
    const directional = new DirectionalLight(0xffffff, 3.8);
    directional.position.set(-4, 10, 8);
    value.add(ambient, directional);

    const starPoints = [];
    let seed = 7919;
    function random() {
      seed = (seed * 48271) % 2147483647;
      return seed / 2147483647;
    }
    for (let index = 0; index < 160; index += 1) {
      starPoints.push(
        new Vector3(
          (random() - 0.5) * 30,
          random() * 18 - 1,
          -5 - random() * 8,
        ),
      );
    }
    const starGeometry = geometry(
      new BufferGeometry().setFromPoints(starPoints),
    );
    const starMaterial = material(
      new PointsMaterial({
        color: COLORS.ink,
        size: 0.035,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    );
    const stars = new Points(starGeometry, starMaterial);
    value.add(stars);

    const mission = makeMissionPair();
    value.add(mission.root);
    return { scene: value, mission, stars };
  }

  function applyLayout() {
    if (!sceneModel || !camera) return;
    const width = canvas.clientWidth || host?.clientWidth || canvas.width || 1;
    layout = width <= 680 ? "stacked" : "side-by-side";
    if (layout === "side-by-side") {
      sceneModel.mission.left.root.position.set(-4.25, 0, 0);
      sceneModel.mission.right.root.position.set(4.25, 0, 0);
      sceneModel.mission.left.root.scale.setScalar(1);
      sceneModel.mission.right.root.scale.setScalar(1);
    } else {
      sceneModel.mission.left.root.scale.setScalar(0.86);
      sceneModel.mission.right.root.scale.setScalar(0.86);
    }
  }

  function positionStackedBays() {
    if (!sceneModel || !camera || layout !== "stacked") return;
    VEC_C.set(0, 1, 0).applyQuaternion(camera.quaternion).normalize();
    const separation = 4.25;
    sceneModel.mission.left.root.position
      .copy(VEC_C)
      .multiplyScalar(separation);
    sceneModel.mission.right.root.position
      .copy(VEC_C)
      .multiplyScalar(-separation);
  }

  function applyCamera(time) {
    if (!camera) return;
    const stage = currentStage();
    const pose = CAMERA_POSES[stage.key];
    const priorKey =
      currentIndex > 0 ? STAGES[currentIndex - 1].key : stage.key;
    const priorPose = CAMERA_POSES[priorKey];
    const amount = motionReduced ? 1 : range(time, 0, 800, easeOut);
    const mobilePullback = layout === "stacked" ? 1.34 : 1;

    camera.position.set(
      lerp(priorPose.position[0], pose.position[0], amount),
      lerp(priorPose.position[1], pose.position[1], amount) * mobilePullback,
      lerp(priorPose.position[2], pose.position[2], amount) * mobilePullback,
    );
    VEC_A.set(
      lerp(priorPose.target[0], pose.target[0], amount),
      lerp(priorPose.target[1], pose.target[1], amount),
      lerp(priorPose.target[2], pose.target[2], amount),
    );
    camera.lookAt(VEC_A);
    if (layout === "stacked") positionStackedBays();
  }

  function applyStage(stageKey, stageElapsed) {
    if (!sceneModel || !renderer || !camera) return;
    const settleAt =
      STAGE_SETTLE_AT[stageKey] ??
      STAGES.find((stage) => stage.key === stageKey)?.duration ??
      0;
    const bounded = Math.min(settleAt, Math.max(0, stageElapsed));
    stageUpdaters[stageKey](sceneModel.mission, bounded);
    applyCamera(bounded);
  }

  function renderCurrent() {
    if (!renderer || !scene || !camera || destroyed || unsupported) return;
    applyStage(currentStage().key, elapsed);
    renderer.render(scene, camera);
    if (typeof onDiagnostics === "function") {
      const vehiclePose = (vehicle) => [
        ...vehicle.root.position.toArray(),
        ...vehicle.root.rotation.toArray().slice(0, 3),
        ...vehicle.booster.position.toArray(),
        ...vehicle.booster.rotation.toArray().slice(0, 3),
        ...vehicle.upper.position.toArray(),
        ...vehicle.upper.rotation.toArray().slice(0, 3),
        ...vehicle.interstage.position.toArray(),
        ...vehicle.interstage.rotation.toArray().slice(0, 3),
        vehicle.payloadDoorPivot.rotation.x,
        Number(vehicle.interstage.visible),
      ];
      const missionState = (bay) => ({
        atmosphereOpacity: bay.atmosphereMaterial.opacity,
        groundVisible: bay.ground.visible,
        groundScale: bay.ground.scale.x,
        towerVisible: bay.tower.root.visible,
        towerScale: bay.tower.root.scale.x,
        orbitOpacity: bay.orbit.visible ? bay.orbitMaterial.opacity : 0,
        boosterEngineOpacity: bay.vehicle.engineMaterial.opacity,
        boosterPlumesVisible: bay.vehicle.plumes.some((plume) => plume.visible),
        upperEngineOpacity: bay.vehicle.upperEngineMaterial.opacity,
        upperPlumeVisible: bay.vehicle.upperPlume.visible,
        ambiguousRouteOpacity: bay.ambiguousRoute.dots.some(
          (dot) => dot.visible,
        )
          ? bay.ambiguousRoute.material.opacity
          : 0,
        ambiguousRouteVisible: bay.ambiguousRoute.dots.some(
          (dot) => dot.visible,
        ),
        exactRouteOpacity: bay.exactRoute.line.visible
          ? bay.exactRoute.material.opacity
          : 0,
        exactRouteVisible: bay.exactRoute.line.visible,
        staleCatchRouteOpacity: bay.staleCatchRoute.line.visible
          ? bay.staleCatchRoute.material.opacity
          : 0,
        staleCatchRouteVisible: bay.staleCatchRoute.line.visible,
        divertRouteOpacity: bay.divertRoute.line.visible
          ? bay.divertRoute.material.opacity
          : 0,
        divertRouteVisible: bay.divertRoute.line.visible,
        telemetryRouteOpacity: bay.telemetryRoute.line.visible
          ? bay.telemetryRoute.material.opacity
          : 0,
        telemetryRouteVisible: bay.telemetryRoute.line.visible,
        routeMarkerOpacity: bay.routeMarkers.markers[0].root.visible
          ? bay.routeMarkers.markers[0].material.opacity
          : 0,
        routeMarkerVisible: bay.routeMarkers.markers[0].root.visible,
        missionPulseOpacity: bay.missionPulse.visible
          ? bay.missionPulseMaterial.opacity
          : 0,
        missionPulseVisible: bay.missionPulse.visible,
        wildcardWaveOpacity: bay.wildcardWave.visible
          ? bay.wildcardWaveMaterial.opacity
          : 0,
        wildcardWaveVisible: bay.wildcardWave.visible,
        retainedStateOpacity: bay.actors.retainedState.root.visible
          ? bay.actors.retainedState.material.opacity
          : 0,
        retainedStateVisible: bay.actors.retainedState.root.visible,
        healthColor: bay.tower.health.coreMaterial.color.getHex(),
        healthOpacity: bay.tower.health.coreMaterial.opacity,
        healthHaloScale: bay.tower.health.halo.scale.x,
        controllerHealthColor:
          bay.tower.controllerHealth.coreMaterial.color.getHex(),
        controllerHealthOpacity:
          bay.tower.controllerHealth.coreMaterial.opacity,
        controllerHealthHaloScale: bay.tower.controllerHealth.halo.scale.x,
        orbitVisible: bay.orbit.visible,
        targetOrbitVisible: bay.targetOrbit.visible,
        wrongOrbitVisible: bay.wrongOrbit.visible,
        targetOrbitOpacity: bay.targetOrbit.visible
          ? bay.targetOrbitMaterial.opacity
          : 0,
        wrongOrbitOpacity: bay.wrongOrbit.visible
          ? bay.wrongOrbitMaterial.opacity
          : 0,
      });
      onDiagnostics({
        stage: currentStage().key,
        stageTime: Math.min(
          elapsed,
          STAGE_SETTLE_AT[currentStage().key] ?? elapsed,
        ),
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
        sceneChildren: scene.children.length,
        leftPose: vehiclePose(sceneModel.mission.left.vehicle),
        rightPose: vehiclePose(sceneModel.mission.right.vehicle),
        leftMissionState: missionState(sceneModel.mission.left),
        rightMissionState: missionState(sceneModel.mission.right),
      });
    }
  }

  function resize() {
    if (!renderer || !camera || destroyed) return;
    const width = Math.max(
      1,
      Math.round(canvas.clientWidth || host?.clientWidth || canvas.width || 1),
    );
    const height = Math.max(
      1,
      Math.round(
        canvas.clientHeight || host?.clientHeight || canvas.height || 1,
      ),
    );
    renderer.setPixelRatio(
      Math.min(
        typeof devicePixelRatio === "number" ? devicePixelRatio : 1,
        1.5,
      ),
    );
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    applyLayout();
    renderCurrent();
  }

  function canTick() {
    return (
      renderer &&
      !destroyed &&
      !unsupported &&
      !motionReduced &&
      playback === "playing" &&
      isIntersecting &&
      isDocumentVisible
    );
  }

  function stopAnimationLoop() {
    if (renderer) renderer.setAnimationLoop(null);
    animationLoopRunning = false;
    activeTimeEpoch = null;
  }

  function startAnimationLoop() {
    if (!canTick()) {
      stopAnimationLoop();
      return;
    }
    if (animationLoopRunning) return;
    activeTimeEpoch = null;
    animationLoopRunning = true;
    renderer.setAnimationLoop(frame);
  }

  function finishManualStage() {
    elapsed = STAGE_SETTLE_AT[currentStage().key];
    stageSettled = true;
    autoplay = false;
    completed = false;
    playback = "idle";
    renderCurrent();
    emitState("settled", true);
    stopAnimationLoop();
  }

  function advanceAutoplay(timestamp) {
    let overflow = Math.max(0, elapsed - currentStage().duration);

    while (currentIndex < STAGES.length - 1) {
      currentIndex += 1;
      elapsed = overflow;
      if (elapsed < currentStage().duration) break;
      overflow = elapsed - currentStage().duration;
    }

    if (
      currentIndex === STAGES.length - 1 &&
      elapsed >= currentStage().duration
    ) {
      elapsed = currentStage().duration;
      stageSettled = true;
      autoplay = false;
      completed = true;
      playback = "complete";
      renderCurrent();
      emitState("complete", true);
      stopAnimationLoop();
      return;
    }

    stageSettled = elapsed >= STAGE_SETTLE_AT[currentStage().key];
    completed = false;
    activeTimeEpoch = timestamp - elapsed;
    renderCurrent();
    emitState("autoplay", true);
  }

  function frame(timestamp) {
    if (!canTick()) {
      stopAnimationLoop();
      return;
    }
    if (activeTimeEpoch == null) {
      activeTimeEpoch = timestamp - elapsed;
    }
    elapsed = Math.max(0, timestamp - activeTimeEpoch);
    const settleAt = STAGE_SETTLE_AT[currentStage().key];
    stageSettled = elapsed >= settleAt;

    if (!autoplay && elapsed >= settleAt) {
      finishManualStage();
      return;
    }

    if (autoplay && elapsed >= currentStage().duration) {
      advanceAutoplay(timestamp);
      return;
    }

    renderCurrent();
    emitState("timeline");
  }

  function select(stageKey, selectOptions = {}) {
    if (destroyed) return controller;
    const index = STAGES.findIndex((stage) => stage.key === stageKey);
    if (index < 0) return controller;
    stopAnimationLoop();
    const {
      animate = true,
      autoplay: shouldAutoplay = false,
      reason = "select",
    } = selectOptions;
    currentIndex = index;
    completed = false;
    autoplay = Boolean(shouldAutoplay);

    if (motionReduced || unsupported || !renderer || !animate) {
      elapsed = STAGE_SETTLE_AT[currentStage().key];
      playback = "idle";
      stageSettled = true;
      autoplay = false;
      renderCurrent();
      emitState(reason, true);
      stopAnimationLoop();
      return controller;
    }

    elapsed = 0;
    playback = "playing";
    stageSettled = false;
    renderCurrent();
    emitState(reason, true);
    startAnimationLoop();
    return controller;
  }

  function play(playOptions = {}) {
    const from =
      typeof playOptions.from === "string" ? playOptions.from : "coordinates";
    return select(from, {
      animate: true,
      autoplay: true,
      reason: "play",
    });
  }

  function pause() {
    if (destroyed || playback !== "playing") return controller;
    playback = "paused";
    stopAnimationLoop();
    renderCurrent();
    emitState("pause", true);
    return controller;
  }

  function resume() {
    if (destroyed || playback !== "paused") return controller;
    if (motionReduced) {
      elapsed = currentStage().duration;
      playback = "idle";
      autoplay = false;
      stageSettled = true;
      renderCurrent();
      emitState("reduced-motion", true);
      return controller;
    }
    playback = "playing";
    emitState("resume", true);
    startAnimationLoop();
    return controller;
  }

  function reset(resetOptions = {}) {
    const animate = Boolean(resetOptions.animate);
    return select(initialStage, {
      animate,
      autoplay: false,
      reason: "reset",
    });
  }

  function setReducedMotion(value) {
    const next = Boolean(value);
    if (next === motionReduced || destroyed) return controller;
    motionReduced = next;

    if (motionReduced) {
      autoplay = false;
      completed = false;
      playback = "idle";
      elapsed = currentStage().duration;
      stageSettled = true;
      stopAnimationLoop();
      renderCurrent();
      emitState("reduced-motion", true);
      return controller;
    }

    if (!renderer && !unsupported) initializeRenderer();
    elapsed = currentStage().duration;
    playback = "idle";
    stageSettled = true;
    renderCurrent();
    emitState("motion-enabled", true);
    return controller;
  }

  function handleVisibilityChange() {
    isDocumentVisible = !document.hidden;
    if (canTick()) startAnimationLoop();
    else stopAnimationLoop();
  }

  function handleContextLost(event) {
    event.preventDefault();
    reportUnsupported(new Error("The WebGL context was lost."));
  }

  function initializeObservers() {
    if (typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(host || canvas);
    } else if (typeof addEventListener === "function") {
      addEventListener("resize", resize, { passive: true });
    }

    if (typeof IntersectionObserver === "function") {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1];
          isIntersecting = Boolean(entry?.isIntersecting);
          if (canTick()) startAnimationLoop();
          else stopAnimationLoop();
        },
        { threshold: 0.03 },
      );
      intersectionObserver.observe(host || canvas);
    }

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }
    canvas.addEventListener("webglcontextlost", handleContextLost, false);
  }

  function initializeRenderer() {
    if (renderer || destroyed || unsupported || motionReduced) return;
    try {
      const context = canvas.getContext("webgl2", {
        alpha: false,
        antialias: true,
        depth: true,
        stencil: false,
        powerPreference: "high-performance",
      });
      if (!context) {
        reportUnsupported(new Error("WebGL2 is not available."));
        return;
      }
      renderer = new WebGLRenderer({
        canvas,
        context,
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.outputColorSpace = SRGBColorSpace;
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      sceneModel = buildScene();
      scene = sceneModel.scene;
      camera = new PerspectiveCamera(37, 1, 0.1, 90);
      initializeObservers();
      resize();
      renderCurrent();
      ready = true;
      defer(() => {
        if (!destroyed && ready) {
          onReady();
          emitState("ready", true);
        }
      });
    } catch (error) {
      reportUnsupported(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    stopAnimationLoop();
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    if (!resizeObserver && typeof removeEventListener === "function") {
      removeEventListener("resize", resize);
    }
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
    canvas.removeEventListener("webglcontextlost", handleContextLost, false);

    disposables.geometries.forEach((value) => value.dispose());
    disposables.materials.forEach((value) => value.dispose());
    if (renderer) {
      renderer.renderLists.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    }
    renderer = null;
    scene = null;
    camera = null;
    sceneModel = null;
  }

  const controller = Object.freeze({
    play,
    pause,
    resume,
    select,
    reset,
    setReducedMotion,
    resize,
    getState: () => stateSnapshot(lastReason),
    destroy,
  });

  defer(() => {
    if (!destroyed) emitState("initial", true);
  });
  if (!motionReduced) initializeRenderer();

  return controller;
}

const API = Object.freeze({
  VERSION,
  STAGES,
  create: createMissionScene,
});

globalThis.HarnessMission3D = API;
