import * as THREE from "three";

class GizmoRaycaster {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.ndc = new THREE.Vector2();
    this.intersection = new THREE.Vector3();
  }

  intersectPlane(camera, pointer, plane) {
    if (!camera || !pointer || !plane) {
      return null;
    }

    this.ndc.set(pointer.x, pointer.y);

    this.raycaster.setFromCamera(this.ndc, camera);

    const hit = this.raycaster.ray.intersectPlane(plane, this.intersection);

    if (!hit) {
      return null;
    }

    return this.intersection.clone();
  }
}

export default new GizmoRaycaster();
