import * as THREE from "three";

const states = new WeakMap();

const WORLD_UP = new THREE.Vector3(0, 1, 0);

function createState(camera) {
  const direction = new THREE.Vector3();

  camera.getWorldDirection(direction);

  const horizontalLength = Math.sqrt(
    direction.x * direction.x + direction.z * direction.z,
  );

  let yaw;

  // When looking almost straight up/down, yaw cannot be
  // calculated reliably from the direction alone.
  //
  // Use the camera's right vector to preserve the snapped
  // TOP/BOTTOM orientation.
  if (horizontalLength < 0.0001) {
    const right = new THREE.Vector3(1, 0, 0);

    right.applyQuaternion(camera.quaternion);

    yaw = Math.atan2(right.z, right.x);
  } else {
    yaw = Math.atan2(direction.x, direction.z);
  }

  const pitch = Math.asin(THREE.MathUtils.clamp(direction.y, -1, 1));

  return {
    yaw,
    pitch,

    targetYaw: yaw,
    targetPitch: pitch,

    target: new THREE.Vector3(),

    needsFreeLookUpReset: false,
  };
}

function getState(camera) {
  let state = states.get(camera);

  if (state) {
    return state;
  }

  state = createState(camera);

  states.set(camera, state);

  return state;
}

// ============================================================
// SYNC
// ============================================================

export function syncCameraRotation(camera, resetFreeLookUp = false) {
  const state = getState(camera);

  const nextState = createState(camera);

  state.yaw = nextState.yaw;
  state.pitch = nextState.pitch;

  state.targetYaw = nextState.targetYaw;
  state.targetPitch = nextState.targetPitch;

  state.needsFreeLookUpReset = resetFreeLookUp;
}

// ============================================================
// UPDATE
// ============================================================

export function updateCameraRotation(camera, mouse, sensitivity) {
  const state = getState(camera);

  if (!mouse.right) {
    return;
  }

  const deltaX = mouse.deltaX || 0;
  const deltaY = mouse.deltaY || 0;

  // ----------------------------------------------------------
  // FIRST RMB MOVEMENT AFTER A CAMERA SNAP
  // ----------------------------------------------------------
  //
  // TOP/BOTTOM use a special camera.up vector so the snapped
  // view has the correct screen orientation.
  //
  // Once the user starts free-look, switch back to the normal
  // editor world-up basis.
  //
  // This prevents the first RMB movement from producing roll.
  // ----------------------------------------------------------

  if (state.needsFreeLookUpReset) {
    camera.up.copy(WORLD_UP);

    state.needsFreeLookUpReset = false;

    camera.updateMatrixWorld(true);
  }

  // ----------------------------------------------------------
  // TARGET ROTATION
  // ----------------------------------------------------------

  state.targetYaw -= deltaX * sensitivity;

  state.targetPitch -= deltaY * sensitivity;

  // ----------------------------------------------------------
  // PITCH LIMIT
  // ----------------------------------------------------------

  const limit = Math.PI / 2 - 0.01;

  state.targetPitch = THREE.MathUtils.clamp(state.targetPitch, -limit, limit);

  // ----------------------------------------------------------
  // SMOOTH ROTATION
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // LOOK DIRECTION
  // ----------------------------------------------------------

  state.target.set(
    Math.cos(state.pitch) * Math.sin(state.yaw),

    Math.sin(state.pitch),

    Math.cos(state.pitch) * Math.cos(state.yaw),
  );

  state.target.add(camera.position);

  // ----------------------------------------------------------
  // APPLY
  // ----------------------------------------------------------

  camera.lookAt(state.target);
}
