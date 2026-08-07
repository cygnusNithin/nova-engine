import System from "./System";

import { EntityManager } from "../entity";

export default class RenderSystem extends System {
  constructor() {
    super("RenderSystem");
  }

  update() {
    EntityManager.getAll().forEach((entity) => {
      if (!entity.enabled) return;

      const object = entity.getObject();

      if (!object) return;

      //--------------------------------------------------
      // Visibility
      //--------------------------------------------------

      object.visible = entity.visible;
    });
  }
}
