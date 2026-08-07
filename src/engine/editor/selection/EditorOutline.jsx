import { useEffect, useState } from "react";

import { EventBus, EngineEvents } from "../../events";

export default function EditorOutline() {
  const [entity, setEntity] = useState(null);

  useEffect(() => {
    EventBus.on(
      EngineEvents.ENTITY_SELECTED,

      setEntity,
    );

    EventBus.on(
      EngineEvents.ENTITY_DESELECTED,

      () => setEntity(null),
    );

    return () => {
      EventBus.off(
        EngineEvents.ENTITY_SELECTED,

        setEntity,
      );
    };
  }, []);

  return null;
}
