import System from "../systems/System";

export default class TransformSystem extends System {
  constructor() {
    super("Transform");
  }

  update() {
    const rootChildren = this.world?.sceneGraph?.root?.children;

    if (!rootChildren) {
      console.warn("[TransformSystem] No scene graph root");
      return;
    }

    rootChildren.forEach((entity) => {
      this.updateEntity(entity);
    });
  }

  updateEntity(entity) {
    if (!entity) {
      return;
    }

    if (!entity.transform) {
      console.warn("[TransformSystem] Entity has no transform:", entity);

      return;
    }

    entity.syncTransformToObject();

    entity.children.forEach((child) => {
      this.updateEntity(child);
    });
  }
}
