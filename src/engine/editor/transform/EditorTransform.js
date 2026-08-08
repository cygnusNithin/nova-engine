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
    if (!this.entity || !delta) {
      return false;
    }

    this.entity.transform.translate(delta.x, delta.y, delta.z);

    return true;
  }

  translateAxis(axis, amount) {
    if (!this.entity) {
      return false;
    }

    if (!Number.isFinite(amount)) {
      return false;
    }

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
        return false;
    }

    this.entity.transform.setPosition(position.x, position.y, position.z);

    return true;
  }

  setPosition(x, y, z) {
    if (!this.entity) {
      return false;
    }

    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      return false;
    }

    this.entity.transform.setPosition(x, y, z);

    return true;
  }

  // ============================================================
  // ENTITY POSITION
  // ============================================================

  setEntityPosition(entity, x, y, z) {
    if (!entity) {
      console.warn("[EditorTransform] setEntityPosition: missing entity");

      return false;
    }

    if (!entity.transform) {
      console.warn(
        "[EditorTransform] setEntityPosition: missing transform",
        entity,
      );

      return false;
    }

    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      console.warn("[EditorTransform] setEntityPosition: invalid position", {
        x,
        y,
        z,
      });

      return false;
    }

    console.log("[EditorTransform] Position update", {
      entity: entity.name,
      from: entity.transform.position.clone(),
      to: { x, y, z },
    });

    entity.transform.setPosition(x, y, z);

    return true;
  }

  // ============================================================
  // ROTATION
  // ============================================================

  setRotation(x, y, z) {
    if (!this.entity) {
      return false;
    }

    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      return false;
    }

    this.entity.transform.setRotation(x, y, z);

    return true;
  }

  rotate(delta) {
    if (!this.entity || !delta) {
      return false;
    }

    if (
      !Number.isFinite(delta.x) ||
      !Number.isFinite(delta.y) ||
      !Number.isFinite(delta.z)
    ) {
      return false;
    }

    this.entity.transform.rotate(delta.x, delta.y, delta.z);

    return true;
  }

  // ============================================================
  // ENTITY ROTATION
  // ============================================================

  setEntityRotation(entity, x, y, z) {
    if (!entity) {
      console.warn("[EditorTransform] setEntityRotation: missing entity");

      return false;
    }

    if (!entity.transform) {
      console.warn(
        "[EditorTransform] setEntityRotation: missing transform",
        entity,
      );

      return false;
    }

    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      console.warn("[EditorTransform] setEntityRotation: invalid rotation", {
        x,
        y,
        z,
      });

      return false;
    }

    entity.transform.setRotation(x, y, z);

    return true;
  }

  // ============================================================
  // SCALE
  // ============================================================

  setScale(x, y, z) {
    if (!this.entity) {
      return false;
    }

    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      return false;
    }

    this.entity.transform.setScale(x, y, z);

    return true;
  }

  scaleBy(delta) {
    if (!this.entity || !delta) {
      return false;
    }

    if (
      !Number.isFinite(delta.x) ||
      !Number.isFinite(delta.y) ||
      !Number.isFinite(delta.z)
    ) {
      return false;
    }

    this.entity.transform.scaleBy(delta.x, delta.y, delta.z);

    return true;
  }

  // ============================================================
  // ENTITY SCALE
  // ============================================================

  setEntityScale(entity, x, y, z) {
    if (!entity) {
      return false;
    }

    if (!entity.transform) {
      return false;
    }

    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      return false;
    }

    entity.transform.setScale(x, y, z);

    return true;
  }
}

export default new EditorTransform();
