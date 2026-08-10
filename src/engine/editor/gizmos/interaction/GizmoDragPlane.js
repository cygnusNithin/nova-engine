import * as THREE from "three";

class GizmoDragPlane {
  constructor() {
    this.plane = new THREE.Plane();

    this.axisDirection = new THREE.Vector3();
    this.cameraRight = new THREE.Vector3();
    this.cameraUp = new THREE.Vector3();
    this.cameraDirection = new THREE.Vector3();

    this.axisPlaneA = new THREE.Vector3();
    this.axisPlaneB = new THREE.Vector3();

    this.cameraQuaternion = new THREE.Quaternion();
  }

  build(axis, origin, camera, pointerRayDirection) {
    if (!origin || !camera) {
      return null;
    }

    const normal = new THREE.Vector3();

    /*
     * ============================================================
     * PLANE GIZMOS
     * ============================================================
     */

    switch (axis) {
      case "xy":
        normal.set(0, 0, 1);
        break;

      case "xz":
        normal.set(0, 1, 0);
        break;

      case "yz":
        normal.set(1, 0, 0);
        break;

      default:
        break;
    }

    /*
     * ============================================================
     * AXIS GIZMOS
     * ============================================================
     */

    if (normal.lengthSq() === 0) {
      switch (axis) {
        case "x":
          this.axisDirection.set(1, 0, 0);
          break;

        case "y":
          this.axisDirection.set(0, 1, 0);
          break;

        case "z":
          this.axisDirection.set(0, 0, 1);
          break;

        default:
          return null;
      }

      this.axisDirection.normalize();

      camera.getWorldQuaternion(this.cameraQuaternion);

      this.cameraRight
        .set(1, 0, 0)
        .applyQuaternion(this.cameraQuaternion)
        .normalize();

      this.cameraUp
        .set(0, 1, 0)
        .applyQuaternion(this.cameraQuaternion)
        .normalize();

      camera.getWorldDirection(this.cameraDirection);
      this.cameraDirection.normalize();

      const pointerDirection = pointerRayDirection
        ? pointerRayDirection.clone().normalize()
        : this.cameraDirection.clone();

      /*
       * The drag plane must:
       *
       * 1. contain the selected axis
       * 2. face the camera as much as practical
       * 3. not become nearly parallel to the pointer ray
       *
       * Construct two planes containing the selected axis:
       *
       * axis × cameraRight
       * axis × cameraUp
       */

      this.axisPlaneA
        .crossVectors(this.axisDirection, this.cameraRight)
        .normalize();

      this.axisPlaneB
        .crossVectors(this.axisDirection, this.cameraUp)
        .normalize();

      const candidates = [this.axisPlaneA, this.axisPlaneB];

      let bestNormal = null;
      let bestScore = -Infinity;

      for (const candidate of candidates) {
        if (candidate.lengthSq() < 1e-8) {
          continue;
        }

        /*
         * For a plane/ray intersection we want:

         * |normal · ray| to be large.
         *
         * Near zero means the ray is almost parallel to the plane,
         * producing unstable/very large intersection distances.
         */
        const rayAlignment = Math.abs(candidate.dot(pointerDirection));

        /*
         * Also prefer a plane whose normal faces the camera.
         */
        const cameraAlignment = Math.abs(candidate.dot(this.cameraDirection));

        const score = rayAlignment * 0.75 + cameraAlignment * 0.25;

        if (score > bestScore) {
          bestScore = score;
          bestNormal = candidate.clone();
        }
      }

      /*
       * If the camera is looking almost exactly along the selected
       * axis, both normal candidates can become poorly conditioned.
       *
       * Use a deterministic fallback.
       */
      if (!bestNormal || bestScore < 0.08) {
        let fallback;

        if (Math.abs(this.axisDirection.y) < 0.9) {
          fallback.set(0, 1, 0);
        } else {
          fallback.set(1, 0, 0);
        }

        bestNormal = new THREE.Vector3()
          .crossVectors(this.axisDirection, fallback)
          .normalize();
      }

      normal.copy(bestNormal);
    }

    this.plane.setFromNormalAndCoplanarPoint(normal.normalize(), origin);

    return this.plane;
  }

  get() {
    return this.plane;
  }
}

export default new GizmoDragPlane();
