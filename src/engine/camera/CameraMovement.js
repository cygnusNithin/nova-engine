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

  // ============================================================
  // CAMERA FORWARD
  // ============================================================

  camera.getWorldDirection(forward);

  /*
   * Editor movement should remain horizontal.
   *
   * Looking up/down must not make W/S move vertically.
   */

  forward.y = 0;

  if (forward.lengthSq() > 0) {
    forward.normalize();
  }

  // ============================================================
  // CAMERA RIGHT
  // ============================================================

  right.crossVectors(forward, camera.up);

  if (right.lengthSq() > 0) {
    right.normalize();
  }

  // ============================================================
  // HORIZONTAL MOVEMENT
  // ============================================================

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

  // ============================================================
  // NORMALIZE HORIZONTAL MOVEMENT
  // ============================================================

  /*
   * Normalize only the horizontal movement here.
   *
   * This prevents W + D from becoming faster than W alone.
   */

  if (direction.lengthSq() > 0) {
    direction.normalize();
  }

  // ============================================================
  // APPLY HORIZONTAL MOVEMENT
  // ============================================================

  const movementAmount = speed * delta * 60;

  camera.position.addScaledVector(direction, movementAmount);

  // ============================================================
  // VERTICAL EDITOR MOVEMENT
  // ============================================================

  if (allowVertical) {
    let verticalDirection = 0;

    if (keyboard.Space) {
      verticalDirection += 1;
    }

    if (keyboard.ControlLeft || keyboard.ControlRight) {
      verticalDirection -= 1;
    }

    if (verticalDirection !== 0) {
      camera.position.y += verticalDirection * movementAmount;
    }
  }
}
