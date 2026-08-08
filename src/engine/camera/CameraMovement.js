import * as THREE from "three";

const direction = new THREE.Vector3();

const forward = new THREE.Vector3();

const right = new THREE.Vector3();

export function updateCameraMovement(camera, keyboard, mouse, speed, delta) {
  /*
   * Unity / Unreal style:
   *
   * WASD camera movement belongs to camera/fly mode.
   *
   * We only activate it while RMB is held.
   *
   * Therefore:
   *
   * W
   * E
   * R
   *
   * can safely be editor tool shortcuts.
   */

  if (!mouse?.right) {
    return;
  }

  direction.set(0, 0, 0);

  camera.getWorldDirection(forward);

  forward.y = 0;

  forward.normalize();

  right.crossVectors(forward, camera.up).normalize();

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

  /*
   * Unity-style fly vertical movement.
   *
   * Q = down
   * E = up
   *
   * Only while RMB is held.
   */
  if (keyboard.KeyQ) {
    direction.y -= 1;
  }

  if (keyboard.KeyE) {
    direction.y += 1;
  }

  if (direction.lengthSq() > 0) {
    direction.normalize();
  }

  camera.position.addScaledVector(direction, speed * delta * 60);
}
