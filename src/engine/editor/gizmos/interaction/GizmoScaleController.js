import * as THREE from "three";

import EditorTransform from "../../transform/EditorTransform";

import GizmoState from "../GizmoState";

class GizmoScaleController {
  constructor() {
    // ============================================================
    // SMOOTHING
    // ============================================================

    /*
     * Higher values = faster response.
     * Lower values = smoother / slower response.
     */
    this.smoothingSpeed = 18;

    // ============================================================
    // ENTITY / STATE
    // ============================================================

    this.entity = null;

    this.axis = null;

    this.scaling = false;

    // ============================================================
    // SCALE STATE
    // ============================================================

    this.startScale = new THREE.Vector3();

    /*
     * The actual scale currently applied to the entity.
     * This smoothly moves toward nextScale.
     */
    this.currentScale = new THREE.Vector3();

    /*
     * The target scale calculated from the pointer position.
     */
    this.nextScale = new THREE.Vector3();

    // ============================================================
    // DRAG STATE
    // ============================================================

    this.currentPoint = new THREE.Vector3();

    this.startPoint = new THREE.Vector3();

    this.delta = new THREE.Vector3();

    // ============================================================
    // AXIS / CAMERA STATE
    // ============================================================

    this.scaleAxis = new THREE.Vector3();

    this.screenAxis = new THREE.Vector3();

    this.cameraQuaternion = new THREE.Quaternion();

    // ============================================================
    // POINTER / DRAG PLANE
    // ============================================================

    this.pointerId = null;

    this.pointerTarget = null;

    /*
     * Keep this exactly because GizmoInteraction uses
     * GizmoState.dragPlane during the active transform.
     */
    this.dragPlane = null;

    this.initialized = false;
  }

  // ============================================================
  // BEGIN
  // ============================================================

  begin(
    entity,
    axis,
    startPoint,
    camera,
    plane,
    pointerId = null,
    pointerTarget = null,
  ) {
    if (!entity?.transform) {
      return false;
    }

    if (!startPoint || !camera || !plane) {
      return false;
    }

    if (axis !== "x" && axis !== "y" && axis !== "z" && axis !== "xyz") {
      return false;
    }

    if (this.scaling || GizmoState.transforming) {
      return false;
    }

    this.entity = entity;

    this.axis = axis;

    this.scaling = true;

    this.startScale.copy(entity.transform.scale);

    /*
     * Start the smoothing state at the entity's current scale.
     */
    this.currentScale.copy(this.startScale);

    this.nextScale.copy(this.startScale);

    this.startPoint.copy(startPoint);

    this.currentPoint.copy(startPoint);

    this.delta.set(0, 0, 0);

    this.pointerId = pointerId;

    this.pointerTarget = pointerTarget;

    this.dragPlane = plane;

    this.cameraQuaternion.copy(
      camera.getWorldQuaternion(this.cameraQuaternion),
    );

    this.screenAxis
      .set(0, 1, 0)
      .applyQuaternion(this.cameraQuaternion)
      .normalize();

    if (axis === "xyz") {
      this.scaleAxis.copy(this.screenAxis);
    } else {
      const axisVector = this.getAxisVector(axis);

      if (!axisVector) {
        this.reset();

        return false;
      }

      this.scaleAxis.copy(axisVector);
    }

    this.initialized = true;

    GizmoState.transforming = true;

    GizmoState.axis = axis;

    GizmoState.dragPlane = plane;

    return true;
  }

  // ============================================================
  // UPDATE
  // ============================================================

  update(entity, axis, currentPoint, pointerId = null, deltaTime = 1 / 60) {
    if (!this.scaling || !this.initialized) {
      return false;
    }

    if (!entity || entity !== this.entity) {
      return false;
    }

    if (axis !== this.axis) {
      return false;
    }

    if (
      this.pointerId !== null &&
      pointerId !== null &&
      this.pointerId !== pointerId
    ) {
      return false;
    }

    if (!currentPoint) {
      return false;
    }

    // ==========================================================
    // POINTER DELTA
    // ==========================================================

    this.currentPoint.copy(currentPoint);

    this.delta.subVectors(this.currentPoint, this.startPoint);

    // ==========================================================
    // CALCULATE TARGET SCALE
    // ==========================================================

    const amount = this.delta.dot(this.scaleAxis);

    const factor = Math.max(0.01, 1 + amount);

    this.nextScale.copy(this.startScale);

    if (axis === "xyz") {
      this.nextScale.multiplyScalar(factor);
    } else if (axis === "x") {
      this.nextScale.x = Math.max(0.01, this.startScale.x * factor);
    } else if (axis === "y") {
      this.nextScale.y = Math.max(0.01, this.startScale.y * factor);
    } else if (axis === "z") {
      this.nextScale.z = Math.max(0.01, this.startScale.z * factor);
    }

    // ==========================================================
    // SMOOTH SCALE
    // ==========================================================

    /*
     * Frame-rate-independent interpolation factor.
     *
     * This gives approximately the same smoothing behavior
     * regardless of whether the engine runs at 30, 60, or 120 FPS.
     */
    const safeDeltaTime = Math.min(Math.max(deltaTime, 0), 0.1);

    const smoothingFactor = 1 - Math.exp(-this.smoothingSpeed * safeDeltaTime);

    this.currentScale.lerp(this.nextScale, smoothingFactor);

    // ==========================================================
    // APPLY SMOOTHED SCALE
    // ==========================================================

    EditorTransform.setEntityScale(
      entity,
      this.currentScale.x,
      this.currentScale.y,
      this.currentScale.z,
    );

    return true;
  }

  // ============================================================
  // AXIS
  // ============================================================

  getAxisVector(axis) {
    switch (axis) {
      case "x":
        return new THREE.Vector3(1, 0, 0);

      case "y":
        return new THREE.Vector3(0, 1, 0);

      case "z":
        return new THREE.Vector3(0, 0, 1);

      default:
        return null;
    }
  }

  // ============================================================
  // END
  // ============================================================

  end(pointerId = null) {
    if (!this.scaling) {
      return false;
    }

    if (
      this.pointerId !== null &&
      pointerId !== null &&
      this.pointerId !== pointerId
    ) {
      return false;
    }

    this.releasePointerCapture();

    this.reset();

    return true;
  }

  // ============================================================
  // CANCEL
  // ============================================================

  cancel(pointerId = null) {
    if (!this.scaling) {
      return false;
    }

    if (
      this.pointerId !== null &&
      pointerId !== null &&
      this.pointerId !== pointerId
    ) {
      return false;
    }

    this.releasePointerCapture();

    if (this.entity?.transform) {
      EditorTransform.setEntityScale(
        this.entity,
        this.startScale.x,
        this.startScale.y,
        this.startScale.z,
      );
    }

    this.reset();

    return true;
  }

  // ============================================================
  // RESET
  // ============================================================

  reset() {
    this.entity = null;

    this.axis = null;

    this.scaling = false;

    this.startScale.set(1, 1, 1);

    this.currentScale.set(1, 1, 1);

    this.currentPoint.set(0, 0, 0);

    this.startPoint.set(0, 0, 0);

    this.delta.set(0, 0, 0);

    this.nextScale.set(1, 1, 1);

    this.scaleAxis.set(0, 0, 0);

    this.screenAxis.set(0, 1, 0);

    this.cameraQuaternion.identity();

    this.pointerId = null;

    this.pointerTarget = null;

    this.dragPlane = null;

    this.initialized = false;

    GizmoState.dragPlane = null;

    GizmoState.transforming = false;

    GizmoState.axis = null;

    GizmoState.hoveredAxis = null;
  }

  // ============================================================
  // POINTER CAPTURE
  // ============================================================

  releasePointerCapture() {
    if (!this.pointerTarget || this.pointerId === null) {
      return;
    }

    try {
      if (
        typeof this.pointerTarget.hasPointerCapture === "function" &&
        this.pointerTarget.hasPointerCapture(this.pointerId)
      ) {
        this.pointerTarget.releasePointerCapture(this.pointerId);
      }
    } catch {
      // Pointer may already be released.
    }
  }

  // ============================================================
  // SMOOTHING
  // ============================================================

  setSmoothingSpeed(value) {
    if (!Number.isFinite(value) || value <= 0) {
      return false;
    }

    this.smoothingSpeed = value;

    return true;
  }

  getSmoothingSpeed() {
    return this.smoothingSpeed;
  }

  // ============================================================
  // STATE
  // ============================================================

  isScaling() {
    return this.scaling;
  }

  getAxis() {
    return this.axis;
  }

  getEntity() {
    return this.entity;
  }

  getDragPlane() {
    return this.dragPlane;
  }

  getPointerId() {
    return this.pointerId;
  }

  getCurrentScale() {
    return this.currentScale.clone();
  }

  getTargetScale() {
    return this.nextScale.clone();
  }
}

export default new GizmoScaleController();
