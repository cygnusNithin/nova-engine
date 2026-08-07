import { useEffect } from "react";
import * as THREE from "three";

import EntityFactory from "../entity/EntityFactory";
import World from "../world/World";

export default function Ground({ position = [0, 0, 0] } = {}) {
  useEffect(() => {
    console.log("[Ground] Effect started");
    console.log("[Ground] Position:", position);
    console.log("[Ground] World running:", World.running);

    const entity = EntityFactory.createMeshEntity({
      name: "Ground",
      type: "Ground",

      geometry: new THREE.PlaneGeometry(100, 100),

      material: new THREE.MeshStandardMaterial({
        color: "#4f8a3f",
      }),
    });

    if (!entity) {
      console.error("[Ground] Failed to create entity");
      return;
    }

    console.log("[Ground] Entity created:", entity);

    const object = entity.getObject();

    if (!object) {
      console.error("[Ground] Entity has no Object3D:", entity);
      return;
    }

    object.receiveShadow = true;

    // --------------------------------------------------
    // Position
    // --------------------------------------------------

    entity.transform.setPosition(
      position[0] ?? 0,
      position[1] ?? 0,
      position[2] ?? 0,
    );

    // --------------------------------------------------
    // Rotation
    //
    // PlaneGeometry starts vertical (XY plane).
    // Ground must lie horizontally on the XZ plane.
    //
    // IMPORTANT:
    // Rotation belongs to Entity.transform, not directly
    // on the Three.js object, because TransformSystem
    // synchronizes Entity -> Object every frame.
    // --------------------------------------------------

    entity.transform.setRotation(-Math.PI / 2, 0, 0);

    entity.syncTransformToObject();

    console.log("[Ground] Before spawn");

    World.spawn(entity);

    console.log("[Ground] Spawned:", entity);

    return () => {
      console.log("[Ground] Cleanup:", entity);

      if (World.running) {
        World.despawn(entity);
      }
    };
  }, [position]);

  return null;
}
