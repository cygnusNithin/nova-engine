import * as THREE from "three";

import EditorTransform from "../../transform/EditorTransform";

import GizmoState from "../GizmoState";

class GizmoRotateController {
  constructor() {
    this.entity = null;

    this.axis = null;

    this.rotating = false;

    // ------------------------------------------------------------
    // Rotation state
    // ------------------------------------------------------------

    this.startRotation = new THREE.Euler();

    this.accumulatedAngle = 0;

    // ------------------------------------------------------------
    // Vectors
    // ------------------------------------------------------------

    this.startVector = new THREE.Vector3();

    this.previousVector = new THREE.Vector3();

    this.currentVector = new THREE.Vector3();

    this.axisVector = new THREE.Vector3();

    this.crossVector = new THREE.Vector3();

    // ------------------------------------------------------------
    // Rotation plane
    // ------------------------------------------------------------

    this.rotationPlane = new THREE.Plane();

    this.rotationCenter = new THREE.Vector3();

    // ------------------------------------------------------------
    // Temporary rotation
    // ------------------------------------------------------------

    this.nextRotation = new THREE.Euler();

    // ------------------------------------------------------------
    // Pointer state
    // ------------------------------------------------------------

    this.pointerId = null;

    this.pointerTarget = null;

    this.initialized = false;
  }

  // ============================================================
  // RESET
  // ============================================================

  reset() {
    this.entity = null;

    this.axis = null;

    this.rotating = false;

    this.startRotation.set(0, 0, 0);

    this.accumulatedAngle = 0;

    this.startVector.set(0, 0, 0);

    this.previousVector.set(0, 0, 0);

    this.currentVector.set(0, 0, 0);

    this.axisVector.set(0, 0, 0);

    this.crossVector.set(0, 0, 0);

    this.rotationPlane.set(new THREE.Vector3(0, 1, 0), 0);

    this.rotationCenter.set(0, 0, 0);

    this.nextRotation.set(0, 0, 0);

    this.pointerId = null;

    this.pointerTarget = null;

    this.initialized = false;

    GizmoState.transforming = false;
    GizmoState.axis = null;
    GizmoState.hoveredAxis = null;
  }

  // ============================================================
  // BEGIN
  // ============================================================

  begin(
    entity,
    axis,
    startPoint,
    center,
    rotationPlane,
    pointerId = null,
    pointerTarget = null,
  ) {
    if (!entity) {
      return false;
    }

    if (!entity.transform) {
      return false;
    }

    if (!startPoint || !center || !rotationPlane) {
      return false;
    }

    if (axis !== "x" && axis !== "y" && axis !== "z") {
      return false;
    }

    if (this.rotating || GizmoState.transforming) {
      return false;
    }

    this.entity = entity;

    this.axis = axis;

    this.rotating = true;

    this.rotationCenter.copy(center);

    this.rotationPlane.copy(rotationPlane);

    this.startRotation.copy(entity.transform.rotation);

    this.startVector.copy(startPoint).sub(center).normalize();

    this.previousVector.copy(this.startVector);

    this.currentVector.copy(this.startVector);

    this.setAxisVector(axis);

    this.accumulatedAngle = 0;

    this.pointerId = pointerId;

    this.pointerTarget = pointerTarget;

    this.initialized = true;

    GizmoState.transforming = true;
    GizmoState.axis = axis;

    return true;
  }

  // ============================================================
  // UPDATE
  // ============================================================

  update(entity, axis, currentPoint, pointerId = null) {
    if (!this.rotating) {
      return false;
    }

    if (!this.initialized) {
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

    /*
     * Calculate the current direction from the rotation center
     * to the pointer intersection.
     */
    this.currentVector.copy(currentPoint).sub(this.rotationCenter).normalize();

    if (
      this.previousVector.lengthSq() < 1e-8 ||
      this.currentVector.lengthSq() < 1e-8
    ) {
      return false;
    }

    /*
     * Calculate the SMALL signed angle between the previous
     * pointer position and the current pointer position.
     *
     * This is intentionally incremental.
     *
     * We do NOT calculate:
     *
     * start → current
     *
     * because that angle is limited to ±PI.
     *
     * Instead:
     *
     * previous → current
     *
     * gives us a small step that can be accumulated indefinitely.
     */
    const deltaAngle = this.getSignedAngle(
      this.previousVector,
      this.currentVector,
      this.axisVector,
    );

    if (!Number.isFinite(deltaAngle)) {
      return false;
    }

    /*
     * Accumulate the angle.
     *
     * This allows continuous rotation:
     *
     * 0°
     * 90°
     * 180°
     * 270°
     * 360°
     * 450°
     * ...
     */
    this.accumulatedAngle += deltaAngle;

    /*
     * Apply the accumulated angle to the ORIGINAL rotation.
     *
     * This preserves the existing architecture where the
     * transform is always calculated from the drag start state
     * rather than accumulating transform values directly.
     */
    this.nextRotation.copy(this.startRotation);

    switch (axis) {
      case "x":
        this.nextRotation.x = this.startRotation.x + this.accumulatedAngle;
        break;

      case "y":
        this.nextRotation.y = this.startRotation.y + this.accumulatedAngle;
        break;

      case "z":
        this.nextRotation.z = this.startRotation.z + this.accumulatedAngle;
        break;

      default:
        return false;
    }

    EditorTransform.setEntityRotation(
      entity,
      this.nextRotation.x,
      this.nextRotation.y,
      this.nextRotation.z,
    );

    /*
     * The current vector becomes the reference for the next
     * frame.
     */
    this.previousVector.copy(this.currentVector);

    return true;
  }

  // ============================================================
  // AXIS
  // ============================================================

  setAxisVector(axis) {
    switch (axis) {
      case "x":
        this.axisVector.set(1, 0, 0);
        return true;

      case "y":
        this.axisVector.set(0, 1, 0);
        return true;

      case "z":
        this.axisVector.set(0, 0, 1);
        return true;

      default:
        this.axisVector.set(0, 0, 0);
        return false;
    }
  }

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
  // SIGNED ANGLE
  // ============================================================

  getSignedAngle(from, to, axis) {
    this.crossVector.crossVectors(from, to);

    const dot = THREE.MathUtils.clamp(from.dot(to), -1, 1);

    /*
     * atan2 gives us a signed angle in the range:
     *
     * -PI → +PI
     *
     * That's exactly what we want here because this function
     * calculates only the SMALL incremental angle between two
     * consecutive pointer positions.
     *
     * The controller is responsible for accumulating it.
     */
    return Math.atan2(this.crossVector.dot(axis), dot);
  }

  // ============================================================
  // END / COMMIT
  // ============================================================

  end(pointerId = null) {
    if (!this.rotating) {
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
    if (!this.rotating) {
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
      EditorTransform.setEntityRotation(
        this.entity,
        this.startRotation.x,
        this.startRotation.y,
        this.startRotation.z,
      );
    }

    this.reset();

    return true;
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
  // STATE
  // ============================================================

  isRotating() {
    return this.rotating;
  }

  getAxis() {
    return this.axis;
  }

  getEntity() {
    return this.entity;
  }

  getRotationCenter() {
    return this.rotationCenter.clone();
  }

  getRotationPlane() {
    return this.rotationPlane;
  }

  getPointerId() {
    return this.pointerId;
  }

  getAccumulatedAngle() {
    return this.accumulatedAngle;
  }

  getAccumulatedDegrees() {
    return THREE.MathUtils.radToDeg(this.accumulatedAngle);
  }
}

export default new GizmoRotateController();
