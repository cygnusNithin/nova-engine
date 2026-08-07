import { EventBus, EngineEvents } from "../../events";

class EditorTransform {
  constructor() {
    this.entity = null;

    EventBus.on(EngineEvents.ENTITY_SELECTED, (entity) => {
      this.entity = entity;
    });

    EventBus.on(EngineEvents.ENTITY_DESELECTED, () => {
      this.entity = null;
    });
  }

  // ============================================================
  // SELECTION
  // ============================================================

  getSelectedEntity() {
    return this.entity;
  }

  // ============================================================
  // POSITION
  // ============================================================

  translate(delta) {
    if (!this.entity || !delta) return;

    this.entity.transform.translate(delta.x, delta.y, delta.z);
  }

  translateAxis(axis, amount) {
    if (!this.entity) return;

    const position = this.entity.transform.position.clone();

    switch (axis) {
      case "x":
        position.x += amount;
        break;

      case "y":
        position.y += amount;
        break;

      case "z":
        position.z += amount;
        break;

      default:
        return;
    }

    this.entity.transform.setPosition(position.x, position.y, position.z);
  }

  setPosition(x, y, z) {
    if (!this.entity) return;

    this.entity.transform.setPosition(x, y, z);
  }

  // ============================================================
  // ENTITY POSITION
  // ============================================================

  setEntityPosition(entity, x, y, z) {
    if (!entity) {
      console.warn("[EditorTransform] setEntityPosition: missing entity");

      return;
    }

    if (!entity.transform) {
      console.warn(
        "[EditorTransform] setEntityPosition: missing transform",
        entity,
      );

      return;
    }

    console.log("[EditorTransform] Position update", {
      entity: entity.name,
      from: entity.transform.position.clone(),
      to: { x, y, z },
    });

    entity.transform.setPosition(x, y, z);
  }

  // ============================================================
  // ROTATION
  // ============================================================

  setRotation(x, y, z) {
    if (!this.entity) return;

    this.entity.transform.setRotation(x, y, z);
  }

  rotate(delta) {
    if (!this.entity || !delta) return;

    this.entity.transform.rotate(delta.x, delta.y, delta.z);
  }

  // ============================================================
  // ENTITY ROTATION
  // ============================================================

  setEntityRotation(entity, x, y, z) {
    if (!entity) return;

    if (!entity.transform) return;

    entity.transform.setRotation(x, y, z);
  }

  // ============================================================
  // SCALE
  // ============================================================

  setScale(x, y, z) {
    if (!this.entity) return;

    this.entity.transform.setScale(x, y, z);
  }

  scaleBy(delta) {
    if (!this.entity || !delta) return;

    this.entity.transform.scaleBy(delta.x, delta.y, delta.z);
  }

  // ============================================================
  // ENTITY SCALE
  // ============================================================

  setEntityScale(entity, x, y, z) {
    if (!entity) return;

    if (!entity.transform) return;

    entity.transform.setScale(x, y, z);
  }
}

export default new EditorTransform();
