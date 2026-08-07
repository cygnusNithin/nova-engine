import * as THREE from "three";

class GizmoMath {
  static snap(value, size) {
    return Math.round(value / size) * size;
  }

  static axisVector(axis) {
    switch (axis) {
      case "x":
        return new THREE.Vector3(1, 0, 0);

      case "y":
        return new THREE.Vector3(0, 1, 0);

      case "z":
        return new THREE.Vector3(0, 0, 1);

      default:
        return new THREE.Vector3();
    }
  }
}

export default GizmoMath;
