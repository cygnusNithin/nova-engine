import * as THREE from "three";

import EditorTransform from "../../transform/EditorTransform";

class GizmoMoveController {
  constructor() {
    this.startPosition = new THREE.Vector3();

    this.lastDelta = new THREE.Vector3();

    this.initialized = false;
  }

  // ============================================================
  // RESET
  // ============================================================

  reset() {
    console.log("[GizmoMoveController] RESET");

    this.startPosition.set(0, 0, 0);

    this.lastDelta.set(0, 0, 0);

    this.initialized = false;
  }

  // ============================================================
  // MOVE
  // ============================================================

  move(entity, axis, delta) {
    if (!entity) {
      console.warn("[GizmoMoveController] Missing entity");
      return;
    }

    if (!entity.transform) {
      console.warn("[GizmoMoveController] Entity has no transform", entity);
      return;
    }

    if (!delta) {
      console.warn("[GizmoMoveController] Missing delta");
      return;
    }

    if (!this.initialized) {
      this.startPosition.copy(entity.transform.position);

      this.initialized = true;

      console.log(
        "[GizmoMoveController] Drag start position:",
        this.startPosition.clone(),
      );
    }

    const movement = this.getAxisMovement(axis, delta);

    if (!movement) {
      console.warn("[GizmoMoveController] Invalid axis:", axis);

      return;
    }

    const nextPosition = this.startPosition.clone().add(movement);

    console.log("[GizmoMoveController] MOVE", {
      entity: entity.name,
      axis,
      delta: delta.clone(),
      movement: movement.clone(),
      start: this.startPosition.clone(),
      next: nextPosition.clone(),
    });

    EditorTransform.setEntityPosition(
      entity,
      nextPosition.x,
      nextPosition.y,
      nextPosition.z,
    );

    this.lastDelta.copy(movement);
  }

  // ============================================================
  // AXIS MOVEMENT
  // ============================================================

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

  // ============================================================
  // GET DELTA
  // ============================================================

  getDelta() {
    return this.lastDelta.clone();
  }
}

export default new GizmoMoveController();
