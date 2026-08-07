import { useEffect, useRef } from "react";

import * as THREE from "three";

import { useFrame } from "@react-three/fiber";

import { EventBus, EngineEvents } from "../../events";

import { EditorVisualService } from "./";

export default function OutlineRenderer() {
  const meshRef = useRef(null);

  //--------------------------------------------------

  function onSelected(entity) {
    meshRef.current = entity?.getObject() ?? null;

    if (!meshRef.current) return;

    const helper = new THREE.BoxHelper(
      meshRef.current,

      0xffff00,
    );

    EditorVisualService.add(
      "outline",

      helper,
    );
  }

  //--------------------------------------------------

  function onDeselected() {
    meshRef.current = null;

    EditorVisualService.remove("outline");
  }

  //--------------------------------------------------

  useFrame(() => {
    const helper = EditorVisualService.get("outline");

    if (helper) helper.update();
  });

  //--------------------------------------------------

  useEffect(() => {
    EventBus.on(
      EngineEvents.ENTITY_SELECTED,

      onSelected,
    );

    EventBus.on(
      EngineEvents.ENTITY_DESELECTED,

      onDeselected,
    );

    return () => {
      EventBus.off(
        EngineEvents.ENTITY_SELECTED,

        onSelected,
      );

      EventBus.off(
        EngineEvents.ENTITY_DESELECTED,

        onDeselected,
      );

      EditorVisualService.remove("outline");
    };
  }, []);

  return null;
}
