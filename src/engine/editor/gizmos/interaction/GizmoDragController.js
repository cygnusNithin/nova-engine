import * as THREE from "three";

import GizmoState from "../GizmoState";

import GizmoMoveController from "./GizmoMoveController";

class GizmoDragController {
  constructor() {
    this.startPoint = new THREE.Vector3();

    this.currentPoint = new THREE.Vector3();

    this.delta = new THREE.Vector3();

    this.originalPosition = new THREE.Vector3();

    this.hasTransformSnapshot = false;
  }

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

    if (!entity?.transform) {
      return false;
    }

    if (!plane || !startPoint) {
      return false;
    }

    this.originalPosition.copy(entity.transform.position);

    this.hasTransformSnapshot = true;

    GizmoState.axis = axis;

    GizmoState.dragOrigin = origin?.clone() ?? new THREE.Vector3();

    GizmoState.dragPlane = plane;

    GizmoState.pointer = startPoint.clone();

    GizmoState.pointerId = pointerId;

    GizmoState.pointerTarget = pointerTarget;

    GizmoState.dragging = true;

    GizmoState.transforming = true;

    this.startPoint.copy(startPoint);

    this.currentPoint.copy(startPoint);

    this.delta.set(0, 0, 0);

    GizmoMoveController.reset();

    return true;
  }

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

    if (entity?.transform && this.hasTransformSnapshot) {
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

  clearTransformSnapshot() {
    this.originalPosition.set(0, 0, 0);

    this.hasTransformSnapshot = false;
  }

  resetState() {
    GizmoState.dragging = false;

    GizmoState.transforming = false;

    GizmoState.axis = null;

    GizmoState.dragOrigin = null;

    GizmoState.dragPlane = null;

    GizmoState.pointer = null;

    GizmoState.pointerId = null;

    GizmoState.pointerTarget = null;
  }

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

  getEntity() {
    return GizmoState.entity;
  }
}

export default new GizmoDragController();
