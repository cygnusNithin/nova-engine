import * as THREE from "three";

class GizmoMaterial {
  constructor() {
    this.cache = {};
  }

  get(color) {
    if (this.cache[color]) {
      return this.cache[color];
    }

    this.cache[color] = new THREE.MeshBasicMaterial({
      color,

      depthTest: false,

      depthWrite: false,

      toneMapped: false,
    });

    return this.cache[color];
  }

  getTransparent(color) {
    const key = `${color}-transparent`;

    if (this.cache[key]) {
      return this.cache[key];
    }

    this.cache[key] = new THREE.MeshBasicMaterial({
      color,

      transparent: true,

      opacity: 0.25,

      side: THREE.DoubleSide,

      depthTest: false,

      depthWrite: false,

      toneMapped: false,
    });

    return this.cache[key];
  }

  dispose() {
    Object.values(this.cache).forEach((material) => material.dispose());

    this.cache = {};
  }
}

export default new GizmoMaterial();
