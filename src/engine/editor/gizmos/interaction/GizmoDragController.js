import * as THREE from "three";

import GizmoState from "../GizmoState";

import GizmoMoveController from "./GizmoMoveController";

class GizmoDragController {
  constructor() {
    this.startPoint = new THREE.Vector3();

    this.currentPoint = new THREE.Vector3();

    this.delta = new THREE.Vector3();

    // ------------------------------------------------------------
    // Transform snapshot
    // ------------------------------------------------------------

    this.originalPosition = new THREE.Vector3();

    this.hasTransformSnapshot = false;
  }

  // ============================================================
  // BEGIN
  // ============================================================

  begin(
    axis,
    origin,
    plane,
    startPoint = origin,
    pointerId = null,
    pointerTarget = null,
  ) {
    if (GizmoState.dragging) {
      return false;
    }

    if (GizmoState.transforming) {
      return false;
    }

    const entity = GizmoState.entity;

    if (!entity) {
      return false;
    }

    if (!entity.transform) {
      return false;
    }

    if (!plane || !startPoint) {
      return false;
    }

    // ----------------------------------------------------------
    // Capture transform BEFORE movement
    // ----------------------------------------------------------

    this.originalPosition.copy(entity.transform.position);

    this.hasTransformSnapshot = true;

    // ----------------------------------------------------------
    // Gizmo state
    // ----------------------------------------------------------

    GizmoState.axis = axis;

    GizmoState.dragOrigin = origin?.clone() ?? new THREE.Vector3();

    GizmoState.dragPlane = plane;

    GizmoState.pointer = startPoint.clone();

    GizmoState.pointerId = pointerId;

    GizmoState.pointerTarget = pointerTarget;

    GizmoState.dragging = true;

    /*
     * IMPORTANT:
     *
     * Move is a real transform operation.
     * Therefore Move must participate in the same
     * transform lock as Rotate and Scale.
     */
    GizmoState.transforming = true;

    // ----------------------------------------------------------
    // Internal drag state
    // ----------------------------------------------------------

    this.startPoint.copy(startPoint);

    this.currentPoint.copy(startPoint);

    this.delta.set(0, 0, 0);

    GizmoMoveController.reset();

    return true;
  }

  // ============================================================
  // UPDATE
  // ============================================================

  update(pointer, pointerId = null) {
    if (!GizmoState.dragging) {
      return null;
    }

    if (
      GizmoState.pointerId !== null &&
      pointerId !== null &&
      GizmoState.pointerId !== pointerId
    ) {
      return null;
    }

    if (!pointer) {
      return null;
    }

    this.currentPoint.copy(pointer);

    this.delta.subVectors(this.currentPoint, this.startPoint);

    GizmoState.pointer = this.currentPoint.clone();

    return this.delta.clone();
  }

  // ============================================================
  // END / COMMIT
  // ============================================================

  end(pointerId = null) {
    if (!GizmoState.dragging) {
      return false;
    }

    if (
      GizmoState.pointerId !== null &&
      pointerId !== null &&
      GizmoState.pointerId !== pointerId
    ) {
      return false;
    }

    this.releasePointerCapture();

    GizmoMoveController.reset();

    this.clearTransformSnapshot();

    this.resetState();

    return true;
  }

  // ============================================================
  // CANCEL / RESTORE
  // ============================================================

  cancel(pointerId = null) {
    if (!GizmoState.dragging) {
      return false;
    }

    if (
      GizmoState.pointerId !== null &&
      pointerId !== null &&
      GizmoState.pointerId !== pointerId
    ) {
      return false;
    }

    this.releasePointerCapture();

    const entity = GizmoState.entity;

    if (entity && entity.transform && this.hasTransformSnapshot) {
      entity.transform.setPosition(
        this.originalPosition.x,
        this.originalPosition.y,
        this.originalPosition.z,
      );
    }

    GizmoMoveController.reset();

    this.clearTransformSnapshot();

    this.resetState();

    return true;
  }

  // ============================================================
  // POINTER CAPTURE
  // ============================================================

  releasePointerCapture() {
    const target = GizmoState.pointerTarget;

    const pointerId = GizmoState.pointerId;

    if (!target || pointerId === null) {
      return;
    }

    try {
      if (
        typeof target.hasPointerCapture === "function" &&
        target.hasPointerCapture(pointerId)
      ) {
        target.releasePointerCapture(pointerId);
      }
    } catch {
      // Pointer may already be released.
    }
  }

  // ============================================================
  // TRANSFORM SNAPSHOT
  // ============================================================

  clearTransformSnapshot() {
    this.originalPosition.set(0, 0, 0);

    this.hasTransformSnapshot = false;
  }

  // ============================================================
  // RESET
  // ============================================================

  resetState() {
    GizmoState.dragging = false;

    GizmoState.transforming = false;

    GizmoState.axis = null;

    GizmoState.dragOrigin = null;

    GizmoState.dragPlane = null;

    GizmoState.pointer = null;

    GizmoState.pointerId = null;

    GizmoState.pointerTarget = null;

    this.startPoint.set(0, 0, 0);

    this.currentPoint.set(0, 0, 0);

    this.delta.set(0, 0, 0);
  }

  // ============================================================
  // GETTERS
  // ============================================================

  getDelta() {
    return this.delta.clone();
  }

  isDragging() {
    return GizmoState.dragging;
  }

  getPointerId() {
    return GizmoState.pointerId;
  }

  getAxis() {
    return GizmoState.axis;
  }
}

export default new GizmoDragController();
