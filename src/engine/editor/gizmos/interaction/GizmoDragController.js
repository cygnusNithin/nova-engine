import * as THREE from "three";

import GizmoState from "../GizmoState";
import GizmoMoveController from "./GizmoMoveController";

class GizmoDragController {
  constructor() {
    this.startPoint = new THREE.Vector3();

    this.currentPoint = new THREE.Vector3();

    this.delta = new THREE.Vector3();
  }

  // ============================================================
  // BEGIN DRAG
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
      console.warn("[GizmoDragController] Drag already active");

      return false;
    }

    if (!GizmoState.entity) {
      console.warn(
        "[GizmoDragController] Cannot begin drag without selected entity",
      );

      return false;
    }

    if (!plane) {
      console.warn("[GizmoDragController] Cannot begin drag without plane");

      return false;
    }

    if (!startPoint) {
      console.warn(
        "[GizmoDragController] Cannot begin drag without start point",
      );

      return false;
    }

    // ------------------------------------------------------------
    // GIZMO STATE
    // ------------------------------------------------------------

    GizmoState.axis = axis;

    GizmoState.dragOrigin = origin ? origin.clone() : new THREE.Vector3();

    GizmoState.dragPlane = plane;

    GizmoState.pointer = startPoint.clone();

    GizmoState.pointerId = pointerId;

    GizmoState.pointerTarget = pointerTarget;

    GizmoState.dragging = true;

    // ------------------------------------------------------------
    // INTERNAL STATE
    // ------------------------------------------------------------

    this.startPoint.copy(startPoint);

    this.currentPoint.copy(startPoint);

    this.delta.set(0, 0, 0);

    // Reset movement controller for this drag transaction.
    GizmoMoveController.reset();

    console.log("[GizmoDragController] DRAG START", {
      entity: GizmoState.entity?.name,
      axis,
      pointerId,
      origin: GizmoState.dragOrigin.clone(),
      startPoint: this.startPoint.clone(),
    });

    return true;
  }

  // ============================================================
  // UPDATE
  // ============================================================

  update(pointer, pointerId = null) {
    if (!GizmoState.dragging) {
      return null;
    }

    // ------------------------------------------------------------
    // Pointer ownership
    // ------------------------------------------------------------

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

    // ------------------------------------------------------------
    // Update pointer
    // ------------------------------------------------------------

    this.currentPoint.copy(pointer);

    this.delta.subVectors(this.currentPoint, this.startPoint);

    GizmoState.pointer = this.currentPoint.clone();

    return this.delta.clone();
  }

  // ============================================================
  // END
  // ============================================================

  end(pointerId = null) {
    if (!GizmoState.dragging) {
      return false;
    }

    // ------------------------------------------------------------
    // Pointer ownership
    // ------------------------------------------------------------

    if (
      GizmoState.pointerId !== null &&
      pointerId !== null &&
      GizmoState.pointerId !== pointerId
    ) {
      return false;
    }

    console.log("[GizmoDragController] DRAG END", {
      entity: GizmoState.entity?.name,
      axis: GizmoState.axis,
      pointerId: GizmoState.pointerId,
      finalDelta: this.delta.clone(),
    });

    // ------------------------------------------------------------
    // Release pointer capture
    // ------------------------------------------------------------

    const target = GizmoState.pointerTarget;

    if (target) {
      try {
        if (
          typeof target.hasPointerCapture === "function" &&
          target.hasPointerCapture(GizmoState.pointerId)
        ) {
          target.releasePointerCapture(GizmoState.pointerId);
        }
      } catch (error) {
        console.warn(
          "[GizmoDragController] Failed to release pointer capture",
          error,
        );
      }
    }

    // ------------------------------------------------------------
    // Reset movement controller
    // ------------------------------------------------------------

    GizmoMoveController.reset();

    // ------------------------------------------------------------
    // Reset gizmo drag state
    // ------------------------------------------------------------

    GizmoState.dragging = false;

    GizmoState.axis = null;

    GizmoState.dragOrigin = null;

    GizmoState.dragPlane = null;

    GizmoState.pointer = null;

    GizmoState.pointerId = null;

    GizmoState.pointerTarget = null;

    // ------------------------------------------------------------
    // Reset internal state
    // ------------------------------------------------------------

    this.startPoint.set(0, 0, 0);

    this.currentPoint.set(0, 0, 0);

    this.delta.set(0, 0, 0);

    return true;
  }

  // ============================================================
  // CANCEL
  // ============================================================

  cancel(pointerId = null) {
    if (!GizmoState.dragging) {
      return false;
    }

    console.log("[GizmoDragController] DRAG CANCEL");

    return this.end(pointerId);
  }

  // ============================================================
  // GET DELTA
  // ============================================================

  getDelta() {
    return this.delta.clone();
  }

  // ============================================================
  // IS DRAGGING
  // ============================================================

  isDragging() {
    return GizmoState.dragging;
  }

  // ============================================================
  // GET POINTER ID
  // ============================================================

  getPointerId() {
    return GizmoState.pointerId;
  }
}

export default new GizmoDragController();
