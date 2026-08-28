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

    /*
     * Always rebuild the camera world transform immediately before
     * creating a gizmo ray. Gizmo interaction must use the same
     * current camera state as editor selection.
     */
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);

    this.raycaster.setFromCamera(this.ndc, camera);

    this.lastRay.copy(this.raycaster.ray);

    this.lastCamera = camera;

    return this.raycaster.ray;
  }

  getRay() {
    return this.lastRay;
  }

  getRayData() {
    return {
      ndc: {
        x: Number(this.ndc.x.toFixed(6)),
        y: Number(this.ndc.y.toFixed(6)),
      },

      origin: {
        x: Number(this.lastRay.origin.x.toFixed(4)),
        y: Number(this.lastRay.origin.y.toFixed(4)),
        z: Number(this.lastRay.origin.z.toFixed(4)),
      },

      direction: {
        x: Number(this.lastRay.direction.x.toFixed(6)),
        y: Number(this.lastRay.direction.y.toFixed(6)),
        z: Number(this.lastRay.direction.z.toFixed(6)),
      },
    };
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
     * Do not attempt an unstable intersection when the ray is
     * effectively parallel to the drag plane.
     */
    const denominator = plane.normal.dot(ray.direction);

    if (Math.abs(denominator) < 0.0005) {
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
