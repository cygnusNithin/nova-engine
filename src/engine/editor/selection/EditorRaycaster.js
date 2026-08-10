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
      // LEFT MOUSE ONLY
      // ============================================================

      if (event.button !== 0) {
        return;
      }

      // ============================================================
      // IGNORE EDITOR UI
      // ============================================================

      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("[data-nova-editor='true']")
      ) {
        return;
      }

      // ============================================================
      // NEVER RUN NORMAL SELECTION DURING GIZMO DRAG
      // ============================================================

      if (GizmoDragController.isDragging()) {
        return;
      }

      // ============================================================
      // POINTER -> NDC
      //
      // IMPORTANT:
      // Always calculate against the actual canvas element.
      // ============================================================

      const canvas =
        target instanceof HTMLCanvasElement
          ? target
          : target?.closest?.("canvas");

      if (!canvas) {
        console.warn("[EditorSelection] No canvas found for pointer.");
        return;
      }

      const rect = canvas.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

      pointer.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // ============================================================
      // CAMERA RAY
      // ============================================================

      raycaster.current.setFromCamera(pointer.current, camera);

      // ============================================================
      // COLLECT SELECTABLE MESHES
      // ============================================================

      const meshes = [];

      scene.traverse((object) => {
        if (!object.isMesh) {
          return;
        }

        const userData = object.userData || {};

        // ----------------------------------------------------------
        // Explicitly ignored
        // ----------------------------------------------------------

        if (userData.ignoreRaycast === true) {
          return;
        }

        // ----------------------------------------------------------
        // Gizmo geometry must NEVER participate in entity selection.
        // ----------------------------------------------------------

        if (
          userData.gizmo === true ||
          userData.isGizmo === true ||
          userData.gizmoHandle === true ||
          userData.gizmoRing === true ||
          userData.gizmoAxis === true
        ) {
          return;
        }

        // ----------------------------------------------------------
        // Ground is editor infrastructure, not a selectable entity.
        // ----------------------------------------------------------

        if (
          userData.entity?.type === "Ground" ||
          userData.entity?.name === "Ground" ||
          (userData.entityUUID &&
            EntityManager.getByUUID(userData.entityUUID)?.type === "Ground")
        ) {
          return;
        }

        // ----------------------------------------------------------
        // Only objects belonging to a Nova Entity are selectable.
        // ----------------------------------------------------------

        if (!userData.entity && !userData.entityUUID) {
          return;
        }

        meshes.push(object);
      });

      // ============================================================
      // RAYCAST
      // ============================================================

      const hits = raycaster.current.intersectObjects(meshes, true);

      // ============================================================
      // DEBUG
      // ============================================================

      console.groupCollapsed("[EditorSelection] Pointer selection");

      console.log("Camera:", camera);

      console.log("Pointer NDC:", {
        x: pointer.current.x,
        y: pointer.current.y,
      });

      console.log("Selectable meshes:", meshes.length);

      console.log("Ray hits:", hits.length);

      // ============================================================
      // NO HIT
      // ============================================================

      if (!hits.length) {
        console.log("Result: nothing selectable under cursor.");

        console.groupEnd();

        EditorSelection.clearSelection();

        return;
      }

      // ============================================================
      // FIND FIRST VALID ENTITY
      // ============================================================

      let selectedEntity = null;
      let selectedObject = null;

      for (const hit of hits) {
        let object = hit.object;

        while (object) {
          // --------------------------------------------------------
          // Direct entity reference
          // --------------------------------------------------------

          if (object.userData?.entity) {
            const entity = object.userData.entity;

            // Ground is never selectable.
            if (entity.type === "Ground" || entity.name === "Ground") {
              object = object.parent;
              continue;
            }

            selectedEntity = entity;
            selectedObject = object;

            break;
          }

          // --------------------------------------------------------
          // Entity UUID reference
          // --------------------------------------------------------

          if (object.userData?.entityUUID) {
            const entity = EntityManager.getByUUID(object.userData.entityUUID);

            if (entity) {
              // Ground is never selectable.
              if (entity.type === "Ground" || entity.name === "Ground") {
                object = object.parent;
                continue;
              }

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
      // NO VALID ENTITY
      // ============================================================

      if (!selectedEntity) {
        console.log("Result: ray hit objects, but no selectable entity.");

        console.groupEnd();

        EditorSelection.clearSelection();

        return;
      }

      // ============================================================
      // SELECTION RESULT
      // ============================================================

      console.log("Selected entity:", {
        id: selectedEntity.id,
        uuid: selectedEntity.uuid,
        name: selectedEntity.name,
        type: selectedEntity.type,
      });

      console.log("Selected render object:", selectedObject);

      console.log(
        "Hit distance:",
        hits.find((hit) => hit.object === selectedObject)?.distance,
      );

      console.groupEnd();

      // ============================================================
      // SELECT
      // ============================================================

      EditorSelection.selectEntity(selectedEntity);
    }

    // ================================================================
    // GLOBAL POINTER LISTENER
    // ================================================================

    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [camera, scene]);

  return null;
}
