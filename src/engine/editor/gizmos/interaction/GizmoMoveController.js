import * as THREE from "three";

import EditorTransform from "../../transform/EditorTransform";

class GizmoMoveController {
  constructor() {
    this.startPosition = new THREE.Vector3();

    this.lastDelta = new THREE.Vector3();

    // Reusable movement vector.
    this.movement = new THREE.Vector3();

    // Reusable axis vector.
    this.axisDirection = new THREE.Vector3();

    // Reusable next-position vector.
    this.nextPosition = new THREE.Vector3();

    this.initialized = false;
  }

  reset() {
    this.startPosition.set(0, 0, 0);

    this.lastDelta.set(0, 0, 0);

    this.movement.set(0, 0, 0);

    this.axisDirection.set(0, 0, 0);

    this.nextPosition.set(0, 0, 0);

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

    this.nextPosition.copy(this.startPosition).add(movement);

    EditorTransform.setEntityPosition(
      entity,
      this.nextPosition.x,
      this.nextPosition.y,
      this.nextPosition.z,
    );

    this.lastDelta.copy(movement);

    return true;
  }

  getAxisMovement(axis, delta) {
    switch (axis) {
      /*
       * ============================================================
       * AXIS MOVEMENT
       * ============================================================
       *
       * Project the world-space drag delta onto the selected
       * world axis.
       *
       * This makes the constraint explicit instead of simply
       * extracting a component from the drag-plane delta.
       */

      case "x":
        this.axisDirection.set(1, 0, 0);

        this.movement
          .copy(this.axisDirection)
          .multiplyScalar(delta.dot(this.axisDirection));

        return this.movement;

      case "y":
        this.axisDirection.set(0, 1, 0);

        this.movement
          .copy(this.axisDirection)
          .multiplyScalar(delta.dot(this.axisDirection));

        return this.movement;

      case "z":
        this.axisDirection.set(0, 0, 1);

        this.movement
          .copy(this.axisDirection)
          .multiplyScalar(delta.dot(this.axisDirection));

        return this.movement;

      /*
       * ============================================================
       * PLANE MOVEMENT
       * ============================================================
       *
       * Plane gizmos already represent the corresponding world
       * coordinate planes.
       */

      case "xy":
        this.movement.set(delta.x, delta.y, 0);

        return this.movement;

      case "xz":
        this.movement.set(delta.x, 0, delta.z);

        return this.movement;

      case "yz":
        this.movement.set(0, delta.y, delta.z);

        return this.movement;

      default:
        return null;
    }
  }

  getDelta() {
    return this.lastDelta.clone();
  }
}

export default new GizmoMoveController();
