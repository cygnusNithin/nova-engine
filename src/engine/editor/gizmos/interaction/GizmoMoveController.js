import * as THREE from "three";

import EditorTransform from "../../transform/EditorTransform";

class GizmoMoveController {
  constructor() {
    this.startPosition = new THREE.Vector3();

    this.lastDelta = new THREE.Vector3();

    this.initialized = false;
  }

  reset() {
    this.startPosition.set(0, 0, 0);

    this.lastDelta.set(0, 0, 0);

    this.initialized = false;
  }

  move(entity, axis, delta) {
    if (!entity) {
      return false;
    }

    if (!entity.transform) {
      return false;
    }

    if (!delta) {
      return false;
    }

    if (!this.initialized) {
      this.startPosition.copy(entity.transform.position);

      this.initialized = true;
    }

    const movement = this.getAxisMovement(axis, delta);

    if (!movement) {
      return false;
    }

    const nextPosition = this.startPosition.clone().add(movement);

    EditorTransform.setEntityPosition(
      entity,
      nextPosition.x,
      nextPosition.y,
      nextPosition.z,
    );

    this.lastDelta.copy(movement);

    return true;
  }

  getAxisMovement(axis, delta) {
    switch (axis) {
      case "x":
        return new THREE.Vector3(delta.x, 0, 0);

      case "y":
        return new THREE.Vector3(0, delta.y, 0);

      case "z":
        return new THREE.Vector3(0, 0, delta.z);

      case "xy":
        return new THREE.Vector3(delta.x, delta.y, 0);

      case "xz":
        return new THREE.Vector3(delta.x, 0, delta.z);

      case "yz":
        return new THREE.Vector3(0, delta.y, delta.z);

      default:
        return null;
    }
  }

  getDelta() {
    return this.lastDelta.clone();
  }
}

export default new GizmoMoveController();
