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
      return false;
    }

    if (!entity.transform) {
      console.warn("[GizmoMoveController] Entity has no transform", entity);

      return false;
    }

    if (!delta) {
      console.warn("[GizmoMoveController] Missing delta");
      return false;
    }

    // ----------------------------------------------------------
    // Capture the entity position ONCE at drag start.
    // ----------------------------------------------------------

    if (!this.initialized) {
      this.startPosition.copy(entity.transform.position);

      this.initialized = true;

      console.log(
        "[GizmoMoveController] Drag start position:",
        this.startPosition.clone(),
      );
    }

    // ----------------------------------------------------------
    // Convert the pointer delta into movement constrained
    // to the selected axis / plane.
    // ----------------------------------------------------------

    const movement = this.getAxisMovement(axis, delta);

    if (!movement) {
      console.warn("[GizmoMoveController] Invalid axis:", axis);

      return false;
    }

    // ----------------------------------------------------------
    // IMPORTANT:
    //
    // Delta is measured FROM DRAG START.
    //
    // Therefore the next position must also be calculated
    // FROM DRAG START.
    //
    // DO NOT add movement to the current entity position.
    // ----------------------------------------------------------

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

  // ============================================================
  // AXIS / PLANE MOVEMENT
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
