import * as THREE from "three";

const states = new WeakMap();

function getState(camera) {
  let state = states.get(camera);

  if (state) {
    return state;
  }

  const direction = new THREE.Vector3();

  camera.getWorldDirection(direction);

  state = {
    yaw: Math.atan2(direction.x, direction.z),
    pitch: Math.asin(THREE.MathUtils.clamp(direction.y, -1, 1)),

    targetYaw: Math.atan2(direction.x, direction.z),
    targetPitch: Math.asin(THREE.MathUtils.clamp(direction.y, -1, 1)),

    target: new THREE.Vector3(),

    initialized: true,
  };

  states.set(camera, state);

  return state;
}

export function updateCameraRotation(camera, mouse, sensitivity) {
  const state = getState(camera);

  // ------------------------------------------------------------
  // ROTATION ONLY WHILE RMB IS HELD
  // ------------------------------------------------------------

  if (!mouse.right) {
    return;
  }

  // ------------------------------------------------------------
  // MOUSE INPUT
  // ------------------------------------------------------------

  const deltaX = mouse.deltaX || 0;
  const deltaY = mouse.deltaY || 0;

  // ------------------------------------------------------------
  // TARGET ROTATION
  // ------------------------------------------------------------

  state.targetYaw -= deltaX * sensitivity;
  state.targetPitch -= deltaY * sensitivity;

  // ------------------------------------------------------------
  // PITCH LIMIT
  // ------------------------------------------------------------

  const limit = Math.PI / 2 - 0.01;

  state.targetPitch = THREE.MathUtils.clamp(state.targetPitch, -limit, limit);

  // ------------------------------------------------------------
  // SMOOTH ROTATION
  // ------------------------------------------------------------

  const rotationSmoothness = 0.35;

  state.yaw = THREE.MathUtils.lerp(
    state.yaw,
    state.targetYaw,
    rotationSmoothness,
  );

  state.pitch = THREE.MathUtils.lerp(
    state.pitch,
    state.targetPitch,
    rotationSmoothness,
  );

  // ------------------------------------------------------------
  // BUILD LOOK DIRECTION
  // ------------------------------------------------------------

  state.target.set(
    Math.cos(state.pitch) * Math.sin(state.yaw),
    Math.sin(state.pitch),
    Math.cos(state.pitch) * Math.cos(state.yaw),
  );

  state.target.add(camera.position);

  // ------------------------------------------------------------
  // APPLY
  // ------------------------------------------------------------

  camera.lookAt(state.target);
}
