import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

import EditorSelection from "./EditorSelection";
import GizmoDragController from "../gizmos/interaction/GizmoDragController";

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
      // IGNORE GIZMO DRAG
      // ============================================================

      if (GizmoDragController.isDragging()) {
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

      // ============================================================
      // FILTER INVALID HITS
      // ============================================================

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
      // DEBUG
      // ============================================================

      console.group("========== RAYCAST ==========");

      console.log("Hits:", hits.length);

      // ============================================================
      // NOTHING HIT
      // ============================================================

      if (!hits.length) {
        console.log("Nothing hit");

        console.groupEnd();

        EditorSelection.clearSelection();

        return;
      }

      // ============================================================
      // LOG ALL HITS
      // ============================================================

      hits.forEach((hit, index) => {
        console.log("-------------------------");

        console.log("HIT", index);

        console.log("Mesh UUID :", hit.object.uuid);

        console.log("Mesh Name :", hit.object.name);

        console.log("Mesh Type :", hit.object.type);

        console.log("Distance  :", hit.distance);

        console.log("UserData  :", hit.object.userData);
      });

      // ============================================================
      // FIND ENTITY FROM HIT
      // ============================================================

      let selectedEntity = null;
      let selectedObject = null;

      /*
       * IMPORTANT:
       *
       * We check EVERY hit, not only hits[0].
       *
       * This matters because a visual mesh may be sitting above
       * another selectable entity.
       *
       * The first hit that actually belongs to a Nova Entity
       * becomes the selection.
       */

      for (const hit of hits) {
        let object = hit.object;

        // ----------------------------------------------------------
        // Walk up the Three.js hierarchy
        // ----------------------------------------------------------

        while (object) {
          // --------------------------------------------------------
          // Direct Entity reference
          // --------------------------------------------------------

          if (object.userData?.entity) {
            selectedEntity = object.userData.entity;
            selectedObject = object;

            break;
          }

          // --------------------------------------------------------
          // Entity UUID reference
          // --------------------------------------------------------

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
      // NO ENTITY FOUND
      // ============================================================

      if (!selectedEntity) {
        console.warn(
          "Raycast hit a render object, but that object is not attached to a Nova Entity.",
        );

        console.warn(
          "Selection requires userData.entity or userData.entityUUID.",
        );

        console.groupEnd();

        EditorSelection.clearSelection();

        return;
      }

      // ============================================================
      // ENTITY FOUND
      // ============================================================

      console.log("");

      console.log("FOUND ENTITY");

      console.table({
        id: selectedEntity.id,
        uuid: selectedEntity.uuid,
        name: selectedEntity.name,
        type: selectedEntity.type,
      });

      console.log("Selected Render Object:", selectedObject);

      console.groupEnd();

      // ============================================================
      // SELECT ENTITY
      // ============================================================

      EditorSelection.selectEntity(selectedEntity);
    }

    // ================================================================
    // WINDOW POINTER LISTENER
    // ================================================================

    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [camera, scene]);

  return null;
}
