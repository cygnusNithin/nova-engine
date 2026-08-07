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

  begin(axis, origin, plane, startPoint = origin) {
    console.log("");
    console.log("========================================");
    console.log("========== DRAG BEGIN ==========");
    console.log("========================================");

    console.log("Axis:", axis);
    console.log("Entity:", GizmoState.entity);
    console.log("Origin:", origin);
    console.log("Plane:", plane);

    if (!GizmoState.entity) {
      console.warn("DRAG BEGIN FAILED: GizmoState.entity is null");

      return;
    }

    GizmoState.axis = axis;

    GizmoState.dragOrigin = origin ? origin.clone() : new THREE.Vector3();

    GizmoState.dragPlane = plane;

    GizmoState.pointer = null;

    GizmoState.dragging = true;

    this.startPoint.copy(startPoint);

    this.currentPoint.copy(startPoint);

    this.delta.set(0, 0, 0);

    GizmoMoveController.reset();

    console.log("Drag started.");
    console.log("GizmoState.entity:", GizmoState.entity);
    console.log("GizmoState.axis:", GizmoState.axis);
    console.log("GizmoState.dragging:", GizmoState.dragging);
    console.log("Start Point:", this.startPoint);

    console.log("========================================");
    console.log("");
  }

  // ============================================================
  // UPDATE
  // ============================================================

  update(pointer) {
    if (!GizmoState.dragging) {
      return null;
    }

    if (!pointer) {
      console.warn("DRAG UPDATE: Pointer intersection is null");

      return null;
    }

    this.currentPoint.copy(pointer);

    this.delta.subVectors(this.currentPoint, this.startPoint);

    GizmoState.pointer = this.currentPoint.clone();

    return this.delta.clone();
  }

  // ============================================================
  // END
  // ============================================================

  end() {
    console.log("");
    console.log("========== DRAG END ==========");

    console.log("Final Axis:", GizmoState.axis);
    console.log("Final Pointer:", GizmoState.pointer);
    console.log("Final Delta:", this.delta);

    GizmoMoveController.reset();

    GizmoState.dragging = false;

    GizmoState.axis = null;

    GizmoState.dragOrigin = null;

    GizmoState.dragPlane = null;

    GizmoState.pointer = null;

    this.startPoint.set(0, 0, 0);

    this.currentPoint.set(0, 0, 0);

    this.delta.set(0, 0, 0);

    console.log("Dragging:", GizmoState.dragging);
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
}

export default new GizmoDragController();
