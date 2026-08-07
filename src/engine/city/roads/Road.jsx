import * as THREE from "three";

import EntityFactory from "../../entity/EntityFactory";
import World from "../../world/World";

export default function Road({ position = [0, 0, 0] } = {}) {
  console.log("[Road] Creating:", position);

  const entity = EntityFactory.createGroupEntity({
    name: "Road",
    type: "Road",
  });

  if (!entity) {
    console.error("[Road] Failed to create entity");
    return null;
  }

  // --------------------------------------------------
  // Asphalt
  // --------------------------------------------------

  const asphalt = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 6),
    new THREE.MeshStandardMaterial({
      color: "#2d2d2d",
    }),
  );

  asphalt.rotation.x = -Math.PI / 2;
  asphalt.receiveShadow = true;

  // --------------------------------------------------
  // Center Line
  // --------------------------------------------------

  const centerLine = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 0.15),
    new THREE.MeshStandardMaterial({
      color: "#ffd400",
    }),
  );

  centerLine.rotation.x = -Math.PI / 2;
  centerLine.position.y = 0.02;

  // --------------------------------------------------
  // Sidewalk
  // --------------------------------------------------

  const sidewalkMaterial = new THREE.MeshStandardMaterial({
    color: "#bdbdbd",
  });

  const sidewalkLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 1),
    sidewalkMaterial,
  );

  sidewalkLeft.rotation.x = -Math.PI / 2;
  sidewalkLeft.position.set(-3.5, 0.05, 0);

  const sidewalkRight = sidewalkLeft.clone();

  sidewalkRight.position.x = 3.5;

  // --------------------------------------------------
  // Hierarchy
  // --------------------------------------------------

  const root = entity.getObject();

  root.add(asphalt);
  root.add(centerLine);
  root.add(sidewalkLeft);
  root.add(sidewalkRight);

  // --------------------------------------------------
  // Transform
  // --------------------------------------------------

  entity.transform.setPosition(
    position[0] ?? 0,
    position[1] ?? 0,
    position[2] ?? 0,
  );

  entity.syncTransformToObject();

  // --------------------------------------------------
  // Spawn
  // --------------------------------------------------

  World.spawn(entity);

  return entity;
}
