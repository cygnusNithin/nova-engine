import { useEffect, useRef } from "react";

import Entity from "../../entity/Entity";
import World from "../../world/World";

export default function EditorEntity({
  name,
  type = "Mesh",
  children,
  position = [0, 0, 0],
}) {
  const groupRef = useRef(null);

  useEffect(() => {
    const object = groupRef.current;

    if (!object) {
      return;
    }

    const entity = new Entity(name, type);

    entity.setObject(object);

    // ------------------------------------------------------------
    // Three.js metadata
    // ------------------------------------------------------------

    object.name = name;

    object.userData.entity = entity;
    object.userData.entityId = entity.id;
    object.userData.entityUUID = entity.uuid;
    object.userData.ignoreRaycast = false;

    // ------------------------------------------------------------
    // Initial Entity transform
    //
    // The React object already owns the actual scene hierarchy.
    // We only copy its local position into the Entity state.
    // ------------------------------------------------------------

    entity.transform.setPosition(
      position[0] ?? 0,
      position[1] ?? 0,
      position[2] ?? 0,
    );

    // ------------------------------------------------------------
    // Register entity.
    //
    // IMPORTANT:
    // World.spawn() must NOT re-parent the object.
    // ------------------------------------------------------------

    World.spawn(entity);

    return () => {
      if (World.running) {
        World.despawn(entity);
      }
    };
  }, [name, type, position]);

  return (
    <group ref={groupRef} name={name} position={position}>
      {children}
    </group>
  );
}
