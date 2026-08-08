import * as THREE from "three";

import EditorTransform from "../../transform/EditorTransform";

class GizmoRotateController {
  constructor() {
    this.entity = null;

    this.axis = null;

    this.rotating = false;

    this.startRotation = new THREE.Euler();

    this.startVector = new THREE.Vector3();

    this.currentVector = new THREE.Vector3();

    this.rotationPlane = new THREE.Plane();

    this.rotationCenter = new THREE.Vector3();

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

    this.startVector.set(0, 0, 0);

    this.currentVector.set(0, 0, 0);

    this.rotationPlane.set(new THREE.Vector3(0, 1, 0), 0);

    this.rotationCenter.set(0, 0, 0);

    this.initialized = false;
  }

  // ============================================================
  // BUILD ROTATION PLANE
  // ============================================================

  buildRotationPlane(axis, center) {
    if (!center) {
      return null;
    }

    let normal;

    switch (axis) {
      case "x":
        normal = new THREE.Vector3(1, 0, 0);
        break;

      case "y":
        normal = new THREE.Vector3(0, 1, 0);
        break;

      case "z":
        normal = new THREE.Vector3(0, 0, 1);
        break;

      default:
        console.warn("[GizmoRotateController] Invalid rotation axis:", axis);

        return null;
    }

    this.rotationPlane.setFromNormalAndCoplanarPoint(normal, center);

    return this.rotationPlane;
  }

  // ============================================================
  // BEGIN ROTATION
  // ============================================================

  begin(entity, axis, startPoint, center) {
    if (!entity) {
      console.warn("[GizmoRotateController] Missing entity");

      return false;
    }

    if (!entity.transform) {
      console.warn("[GizmoRotateController] Entity has no transform", entity);

      return false;
    }

    if (!startPoint || !center) {
      console.warn("[GizmoRotateController] Missing rotation geometry");

      return false;
    }

    if (axis !== "x" && axis !== "y" && axis !== "z") {
      console.warn("[GizmoRotateController] Invalid axis:", axis);

      return false;
    }

    const plane = this.buildRotationPlane(axis, center);

    if (!plane) {
      return false;
    }

    const startVector = startPoint.clone().sub(center);

    if (startVector.lengthSq() === 0) {
      console.warn("[GizmoRotateController] Invalid start rotation vector");

      return false;
    }

    this.entity = entity;

    this.axis = axis;

    this.rotating = true;

    this.rotationCenter.copy(center);

    this.startRotation.copy(entity.transform.rotation);

    this.startVector.copy(startVector).normalize();

    this.currentVector.copy(this.startVector);

    this.initialized = true;

    console.log("[GizmoRotateController] Rotation started", {
      entity: entity.name,
      axis,
      center: this.rotationCenter.clone(),
      startRotation: this.startRotation.clone(),
    });

    return true;
  }

  // ============================================================
  // UPDATE ROTATION
  // ============================================================

  update(entity, axis, currentPoint) {
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

    if (!currentPoint) {
      return false;
    }

    const currentVector = currentPoint.clone().sub(this.rotationCenter);

    if (currentVector.lengthSq() === 0) {
      return false;
    }

    this.currentVector.copy(currentVector).normalize();

    const angle = this.getSignedAngle(
      this.startVector,
      this.currentVector,
      axis,
    );

    if (!Number.isFinite(angle)) {
      return false;
    }

    const rotation = this.startRotation.clone();

    switch (axis) {
      case "x":
        rotation.x = this.startRotation.x + angle;
        break;

      case "y":
        rotation.y = this.startRotation.y + angle;
        break;

      case "z":
        rotation.z = this.startRotation.z + angle;
        break;

      default:
        return false;
    }

    return EditorTransform.setEntityRotation(
      entity,
      rotation.x,
      rotation.y,
      rotation.z,
    );
  }

  // ============================================================
  // SIGNED ANGLE
  // ============================================================

  getSignedAngle(from, to, axis) {
    const cross = new THREE.Vector3();

    cross.crossVectors(from, to);

    const dot = THREE.MathUtils.clamp(from.dot(to), -1, 1);

    const angle = Math.acos(dot);

    switch (axis) {
      case "x":
        return angle * (Math.sign(cross.x) || 1);

      case "y":
        return angle * (Math.sign(cross.y) || 1);

      case "z":
        return angle * (Math.sign(cross.z) || 1);

      default:
        return 0;
    }
  }

  // ============================================================
  // END
  // ============================================================

  end() {
    if (!this.rotating) {
      return;
    }

    console.log("[GizmoRotateController] Rotation ended");

    this.reset();
  }

  // ============================================================
  // CANCEL
  // ============================================================

  cancel() {
    if (!this.rotating) {
      return;
    }

    if (this.entity) {
      EditorTransform.setEntityRotation(
        this.entity,
        this.startRotation.x,
        this.startRotation.y,
        this.startRotation.z,
      );
    }

    console.log("[GizmoRotateController] Rotation cancelled");

    this.reset();
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
}

export default new GizmoRotateController();
