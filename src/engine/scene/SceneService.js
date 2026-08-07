class SceneService {
  constructor() {
    this.scene = null;
  }

  initialize(scene) {
    this.scene = scene;

    console.log("[SceneService] Scene initialized:", scene);
  }

  add(object) {
    if (!this.scene) {
      console.error(
        "[SceneService] Cannot add object. Scene is not initialized.",
      );

      return null;
    }

    if (!object) {
      return null;
    }

    if (object.parent === this.scene) {
      return object;
    }

    this.scene.add(object);

    console.log("[SceneService] Added:", object.name);

    return object;
  }

  remove(object) {
    if (!this.scene || !object) {
      return;
    }

    if (object.parent === this.scene) {
      this.scene.remove(object);

      console.log("[SceneService] Removed:", object.name);
    }
  }
}

export default new SceneService();
