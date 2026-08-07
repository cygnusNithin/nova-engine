import * as THREE from "three";

import EntityFactory from "../../entity/EntityFactory";
import World from "../../world/World";

import { createBuildingMaterial } from "../../materials/MaterialFactory";

export default function Building({
  position = [0, 0, 0],
  width = 4,
  height = 8,
  depth = 4,
} = {}) {
  console.log("[Building] Creating", {
    position,
    width,
    height,
    depth,
  });

  const entity = EntityFactory.createGroupEntity({
    name: "Building",
    type: "Building",
  });

  if (!entity) {
    console.error("[Building] Failed to create entity");
    return null;
  }

  const material = createBuildingMaterial();

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material,
  );

  mesh.position.set(0, height / 2, 0);

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  mesh.userData.ignoreRaycast = false;

  entity.getObject().add(mesh);

  entity.transform.setPosition(
    position[0] ?? 0,
    position[1] ?? 0,
    position[2] ?? 0,
  );

  entity.syncTransformToObject();

  World.spawn(entity);

  return entity;
}
