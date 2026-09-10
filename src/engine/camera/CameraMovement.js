import * as THREE from "three";

const direction = new THREE.Vector3();

const forward = new THREE.Vector3();
const right = new THREE.Vector3();

export function updateCameraMovement(
  camera,
  keyboard,
  speed,
  delta,
  allowVertical = false,
) {
  direction.set(0, 0, 0);

  // ------------------------------------------------------------
  // CAMERA FORWARD
  // ------------------------------------------------------------

  camera.getWorldDirection(forward);

  // Editor horizontal movement should stay horizontal.
  forward.y = 0;

  if (forward.lengthSq() > 0) {
    forward.normalize();
  }

  // ------------------------------------------------------------
  // CAMERA RIGHT
  // ------------------------------------------------------------

  right.crossVectors(forward, camera.up).normalize();

  // ------------------------------------------------------------
  // HORIZONTAL MOVEMENT
  // ------------------------------------------------------------

  if (keyboard.KeyW) {
    direction.add(forward);
  }

  if (keyboard.KeyS) {
    direction.sub(forward);
  }

  if (keyboard.KeyA) {
    direction.sub(right);
  }

  if (keyboard.KeyD) {
    direction.add(right);
  }

  // ------------------------------------------------------------
  // VERTICAL EDITOR MOVEMENT
  // ------------------------------------------------------------

  if (allowVertical) {
    if (keyboard.Space) {
      direction.y += 1;
    }

    if (keyboard.ControlLeft || keyboard.ControlRight) {
      direction.y -= 1;
    }
  }

  // ------------------------------------------------------------
  // APPLY MOVEMENT
  // ------------------------------------------------------------

  if (direction.lengthSq() > 0) {
    direction.normalize();

    camera.position.addScaledVector(direction, speed * delta * 60);
  }
}
