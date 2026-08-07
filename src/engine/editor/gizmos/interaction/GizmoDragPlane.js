import * as THREE from "three";

class GizmoDragPlane {
  constructor() {
    this.plane = new THREE.Plane();
  }

  build(axis, origin, camera, pointerRayDirection) {
    const normal = new THREE.Vector3();
    const axisDirection = new THREE.Vector3();

    switch (axis) {
      case "x":
        axisDirection.set(1, 0, 0);
        break;

      case "y":
        axisDirection.set(0, 1, 0);
        break;

      case "z":
        axisDirection.set(0, 0, 1);
        break;

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
        normal.copy(camera.getWorldDirection(new THREE.Vector3()));
        break;
    }

    if (axisDirection.lengthSq() > 0) {
      const cameraWorldQuaternion = camera.getWorldQuaternion(
        new THREE.Quaternion(),
      );
      const cameraRight = new THREE.Vector3(1, 0, 0)
        .applyQuaternion(cameraWorldQuaternion)
        .normalize();
      const cameraUp = new THREE.Vector3(0, 1, 0)
        .applyQuaternion(cameraWorldQuaternion)
        .normalize();
      const rayDirection = pointerRayDirection?.clone().normalize();
      const candidates = [
        new THREE.Vector3().crossVectors(axisDirection, cameraRight),
        new THREE.Vector3().crossVectors(axisDirection, cameraUp),
      ];

      let bestNormal = null;
      let bestScore = -1;

      candidates.forEach((candidate) => {
        if (candidate.lengthSq() < 1e-6) {
          return;
        }

        candidate.normalize();

        const score = rayDirection
          ? Math.abs(candidate.dot(rayDirection))
          : 0;

        if (score > bestScore) {
          bestNormal = candidate;
          bestScore = score;
        }
      });

      if (!bestNormal || bestScore < 1e-6) {
        // Exact axis-parallel pointer rays have no unique axis drag plane.
        // Keep the plane valid with a deterministic axis-perpendicular normal.
        const fallback =
          Math.abs(axisDirection.y) < 0.9
            ? new THREE.Vector3(0, 1, 0)
            : new THREE.Vector3(1, 0, 0);

        bestNormal = new THREE.Vector3()
          .crossVectors(axisDirection, fallback)
          .normalize();
      }

      normal.copy(bestNormal);
    }

    this.plane.setFromNormalAndCoplanarPoint(normal, origin);

    return this.plane;
  }

  get() {
    return this.plane;
  }
}

export default new GizmoDragPlane();
