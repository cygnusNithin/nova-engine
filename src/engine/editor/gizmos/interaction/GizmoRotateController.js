import * as THREE from "three";

class GizmoRotateController {
  constructor() {
    this.startRotation = new THREE.Euler();

    this.lastRotation = new THREE.Euler();

    this.initialized = false;
  }

  reset() {
    this.startRotation.set(0, 0, 0);

    this.lastRotation.set(0, 0, 0);

    this.initialized = false;
  }

  rotate(entity, axis, angle) {
    if (!entity) return;

    if (!Number.isFinite(angle)) return;

    if (!this.initialized) {
      this.startRotation.copy(entity.transform.rotation);

      this.initialized = true;
    }

    const rotation = this.startRotation.clone();

    switch (axis) {
      case "x":
        rotation.x += angle;
        break;

      case "y":
        rotation.y += angle;
        break;

      case "z":
        rotation.z += angle;
        break;

      default:
        return;
    }

    entity.transform.setRotation(rotation.x, rotation.y, rotation.z);

    this.lastRotation.copy(rotation);
  }

  getRotation() {
    return this.lastRotation.clone();
  }
}

export default new GizmoRotateController();
