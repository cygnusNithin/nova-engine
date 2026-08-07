import { useEffect } from "react";
import * as THREE from "three";

import { EntityFactory } from "../entity";
import World from "../world/World";

export default function DebugEntity() {
  useEffect(() => {
    console.log("========================================");
    console.log("[DebugEntity] Effect started");
    console.log("========================================");

    const entities = [];

    function createCube(name, x, color) {
      console.log("[DebugEntity] Creating cube:", {
        name,
        x,
        color,
      });

      // --------------------------------------------------
      // Create entity
      // --------------------------------------------------

      const entity = EntityFactory.createMeshEntity({
        name,
        type: "Mesh",
        geometry: new THREE.BoxGeometry(1, 1, 1),
        material: new THREE.MeshStandardMaterial({
          color,
        }),
      });

      // --------------------------------------------------
      // Validate
      // --------------------------------------------------

      if (!entity) {
        console.error("[DebugEntity] FAILED: EntityFactory returned null");

        return null;
      }

      console.log("[DebugEntity] Entity created:", entity);

      // --------------------------------------------------
      // Transform
      // --------------------------------------------------

      entity.transform.setPosition(x, 0.5, 0);

      console.log("[DebugEntity] Transform set:", entity.transform.position);

      // --------------------------------------------------
      // Spawn
      // --------------------------------------------------

      World.spawn(entity);

      console.log("[DebugEntity] Entity spawned:", entity.name);

      entities.push(entity);

      return entity;
    }

    // --------------------------------------------------
    // Test Cube
    // --------------------------------------------------

    createCube("Cube", 0, "orange");

    console.log("[DebugEntity] Effect completed successfully");

    // --------------------------------------------------
    // Cleanup
    // --------------------------------------------------

    return () => {
      console.log("[DebugEntity] Cleanup. Entities:", entities.length);

      entities.forEach((entity) => {
        if (!entity) {
          return;
        }

        if (World.running) {
          World.despawn(entity);
        }
      });
    };
  }, []);

  return null;
}
