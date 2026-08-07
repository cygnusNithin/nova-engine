import { useEffect, useState } from "react";

import { EventBus, EngineEvents } from "../../events";

import { EntityManager } from "../../entity";

import HierarchyItem from "./HierarchyItem";

export default function Hierarchy() {
  const [entities, setEntities] = useState(EntityManager.getAll());

  useEffect(() => {
    function refresh() {
      setEntities([...EntityManager.getAll()]);
    }

    EventBus.on(
      EngineEvents.ENTITY_CREATED,

      refresh,
    );

    EventBus.on(
      EngineEvents.ENTITY_DESTROYED,

      refresh,
    );

    return () => {
      EventBus.off(
        EngineEvents.ENTITY_CREATED,

        refresh,
      );

      EventBus.off(
        EngineEvents.ENTITY_DESTROYED,

        refresh,
      );
    };
  }, []);

  return (
    <>
      {entities.map((entity) => (
        <HierarchyItem key={entity.uuid} entity={entity} />
      ))}
    </>
  );
}
