import * as THREE from "three";

class GizmoRaycaster {
  constructor() {
    this.raycaster = new THREE.Raycaster();

    this.ndc = new THREE.Vector2();

    this.intersection = new THREE.Vector3();

    this.lastRay = new THREE.Ray();

    this.lastCamera = null;
  }

  update(camera, pointer) {
    if (!camera || !pointer) {
      return null;
    }

    this.ndc.set(pointer.x, pointer.y);

    this.raycaster.setFromCamera(this.ndc, camera);

    this.lastRay.copy(this.raycaster.ray);

    this.lastCamera = camera;

    return this.raycaster.ray;
  }

  getRay() {
    return this.lastRay;
  }

  intersectPlane(camera, pointer, plane) {
    if (!camera || !pointer || !plane) {
      return null;
    }

    const ray = this.update(camera, pointer);

    if (!ray) {
      return null;
    }

    /*
     * If the ray is almost parallel to the plane, the intersection
     * becomes numerically unstable.
     */
    const denominator = Math.abs(plane.normal.dot(ray.direction));

    if (denominator < 0.0005) {
      return null;
    }

    const hit = ray.intersectPlane(plane, this.intersection);

    if (!hit) {
      return null;
    }

    return this.intersection.clone();
  }

  intersectSphere(camera, pointer, sphere, target = this.intersection) {
    if (!camera || !pointer || !sphere) {
      return null;
    }

    const ray = this.update(camera, pointer);

    if (!ray) {
      return null;
    }

    return ray.intersectSphere(sphere, target);
  }
}

export default new GizmoRaycaster();
