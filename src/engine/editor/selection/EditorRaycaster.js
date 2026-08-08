import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

import EditorSelection from "./EditorSelection";

import GizmoController from "../gizmos/GizmoController";

import EntityManager from "../../entity/EntityManager";

export default function EditorRaycaster() {
  const { camera, scene } = useThree();

  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());

  useEffect(() => {
    function onPointerDown(event) {
      // ============================================================
      // LEFT MOUSE BUTTON ONLY
      // ============================================================

      if (event.button !== 0) {
        return;
      }

      // ============================================================
      // TRANSFORM LOCK
      // ============================================================

      if (GizmoController.isTransforming()) {
        return;
      }

      // ============================================================
      // IGNORE NOVA EDITOR UI
      // ============================================================

      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("[data-nova-editor='true']")
      ) {
        return;
      }

      // ============================================================
      // POINTER -> NDC
      // ============================================================

      const rect = event.target?.getBoundingClientRect?.();

      if (rect) {
        pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

        pointer.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      } else {
        pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;

        pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }

      // ============================================================
      // UPDATE RAY
      // ============================================================

      raycaster.current.setFromCamera(pointer.current, camera);

      // ============================================================
      // COLLECT RAYCASTABLE MESHES
      // ============================================================

      const meshes = [];

      scene.traverse((object) => {
        if (!object.isMesh) {
          return;
        }

        if (object.userData.ignoreRaycast) {
          return;
        }

        meshes.push(object);
      });

      // ============================================================
      // RAYCAST
      // ============================================================

      const intersects = raycaster.current.intersectObjects(meshes, false);

      const hits = intersects.filter((hit) => {
        const object = hit.object;

        if (!object) {
          return false;
        }

        if (object.userData.ignoreRaycast) {
          return false;
        }

        if (object.type === "Sky" || object.type === "Sky2") {
          return false;
        }

        return true;
      });

      // ============================================================
      // NOTHING HIT
      // ============================================================

      if (!hits.length) {
        EditorSelection.clearSelection();

        return;
      }

      // ============================================================
      // FIND ENTITY
      // ============================================================

      let selectedEntity = null;
      let selectedObject = null;

      for (const hit of hits) {
        let object = hit.object;

        while (object) {
          if (object.userData?.entity) {
            selectedEntity = object.userData.entity;
            selectedObject = object;

            break;
          }

          if (object.userData?.entityUUID) {
            const entity = EntityManager.getByUUID(object.userData.entityUUID);

            if (entity) {
              selectedEntity = entity;
              selectedObject = object;

              break;
            }
          }

          object = object.parent;
        }

        if (selectedEntity) {
          break;
        }
      }

      // ============================================================
      // NO ENTITY
      // ============================================================

      if (!selectedEntity) {
        EditorSelection.clearSelection();

        return;
      }

      // ============================================================
      // SELECT
      // ============================================================

      EditorSelection.selectEntity(selectedEntity);
    }

    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [camera, scene]);

  return null;
}
