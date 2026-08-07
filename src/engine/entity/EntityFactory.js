import * as THREE from "three";

import Entity from "./Entity";
import MeshComponent from "./MeshComponent";

class EntityFactory {
  // --------------------------------------------------
  // Mesh Entity
  // --------------------------------------------------

  createMeshEntity({ name = "Mesh", type = "Mesh", geometry, material }) {
    if (!geometry) {
      console.error("[EntityFactory] Missing geometry:", name);
      return null;
    }

    if (!material) {
      console.error("[EntityFactory] Missing material:", name);
      return null;
    }

    const mesh = new THREE.Mesh(geometry, material);

    const entity = new Entity(name, type);

    this.attachObject(entity, mesh);

    entity.addComponent(new MeshComponent(mesh));

    return entity;
  }

  // --------------------------------------------------
  // Group Entity
  // --------------------------------------------------

  createGroupEntity({ name = "Entity", type = "Entity" } = {}) {
    const group = new THREE.Group();

    const entity = new Entity(name, type);

    this.attachObject(entity, group);

    return entity;
  }

  // --------------------------------------------------
  // Attach Object
  // --------------------------------------------------

  attachObject(entity, object) {
    if (!entity || !object) {
      console.error("[EntityFactory] attachObject failed", {
        entity,
        object,
      });

      return null;
    }

    object.name = entity.name;

    object.userData.entity = entity;
    object.userData.entityId = entity.id;
    object.userData.entityUUID = entity.uuid;

    object.userData.ignoreRaycast = false;
    object.userData.novaEntityRoot = true;

    entity.setObject(object);

    return object;
  }

  // --------------------------------------------------
  // Add Child Object
  // --------------------------------------------------

  addChildObject(entity, object) {
    const parent = entity?.getObject?.();

    if (!parent || !object) {
      console.warn("[EntityFactory] addChildObject failed", {
        entity,
        object,
      });

      return null;
    }

    parent.add(object);

    return object;
  }
}

export default new EntityFactory();
