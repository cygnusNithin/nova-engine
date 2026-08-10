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

    // Reusable fallback vector.
    // Important: this must be initialized before .set() is called.
    this.fallback = new THREE.Vector3();
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

      /*
       * ----------------------------------------------------------
       * CAMERA BASIS
       * ----------------------------------------------------------
       */

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

      /*
       * ----------------------------------------------------------
       * POINTER RAY
       * ----------------------------------------------------------
       */

      const pointerDirection = pointerRayDirection
        ? pointerRayDirection.clone().normalize()
        : this.cameraDirection.clone();

      /*
       * ----------------------------------------------------------
       * BUILD TWO POSSIBLE PLANES
       * ----------------------------------------------------------
       *
       * Both planes contain the selected axis.
       *
       * axis × cameraRight
       * axis × cameraUp
       *
       * We choose whichever gives the most stable
       * ray/plane intersection.
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
         * --------------------------------------------------------
         * RAY ALIGNMENT
         * --------------------------------------------------------
         *
         * A larger absolute dot product means the ray intersects
         * the plane more directly.
         *
         * A value near zero means the ray is almost parallel to
         * the plane and produces unstable drag movement.
         */

        const rayAlignment = Math.abs(candidate.dot(pointerDirection));

        /*
         * --------------------------------------------------------
         * CAMERA ALIGNMENT
         * --------------------------------------------------------
         */

        const cameraAlignment = Math.abs(candidate.dot(this.cameraDirection));

        const score = rayAlignment * 0.75 + cameraAlignment * 0.25;

        if (score > bestScore) {
          bestScore = score;
          bestNormal = candidate.clone();
        }
      }

      /*
       * ----------------------------------------------------------
       * FALLBACK
       * ----------------------------------------------------------
       *
       * This is important when the camera is looking almost
       * directly along the selected axis.
       *
       * Previously the code had:
       *
       *     let fallback;
       *     fallback.set(...)
       *
       * which is invalid because fallback was undefined.
       *
       * We now reuse this.fallback.
       */

      if (!bestNormal || bestScore < 0.08) {
        if (Math.abs(this.axisDirection.y) < 0.9) {
          this.fallback.set(0, 1, 0);
        } else {
          this.fallback.set(1, 0, 0);
        }

        bestNormal = new THREE.Vector3()
          .crossVectors(this.axisDirection, this.fallback)
          .normalize();
      }

      normal.copy(bestNormal);
    }

    /*
     * ============================================================
     * FINAL PLANE
     * ============================================================
     */

    if (normal.lengthSq() < 1e-8) {
      return null;
    }

    normal.normalize();

    this.plane.setFromNormalAndCoplanarPoint(normal, origin);

    return this.plane;
  }

  get() {
    return this.plane;
  }
}

export default new GizmoDragPlane();
