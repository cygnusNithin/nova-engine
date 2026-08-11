import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

import EditorSelection from "./EditorSelection";
import GizmoDragController from "../gizmos/interaction/GizmoDragController";

import EntityManager from "../../entity/EntityManager";

export default function EditorRaycaster() {
  const { camera, scene, gl } = useThree();

  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());

  useEffect(() => {
    function isEditorObject(object) {
      if (!object) {
        return false;
      }

      const userData = object.userData || {};

      return (
        userData.gizmo === true ||
        userData.isGizmo === true ||
        userData.gizmoHandle === true ||
        userData.gizmoRing === true ||
        userData.gizmoAxis === true
      );
    }

    function isGroundEntity(entity) {
      if (!entity) {
        return false;
      }

      return entity.type === "Ground" || entity.name === "Ground";
    }

    function findEntityFromObject(object) {
      let current = object;

      while (current) {
        const userData = current.userData || {};

        // ----------------------------------------------------------
        // Never allow gizmo objects to resolve to an entity.
        // ----------------------------------------------------------

        if (isEditorObject(current)) {
          return null;
        }

        // ----------------------------------------------------------
        // Direct Entity reference.
        // ----------------------------------------------------------

        if (userData.entity) {
          const entity = userData.entity;

          if (!isGroundEntity(entity)) {
            return {
              entity,
              object: current,
            };
          }

          return null;
        }

        // ----------------------------------------------------------
        // Entity UUID reference.
        // ----------------------------------------------------------

        if (userData.entityUUID) {
          const entity = EntityManager.getByUUID(userData.entityUUID);

          if (entity && !isGroundEntity(entity)) {
            return {
              entity,
              object: current,
            };
          }

          if (entity && isGroundEntity(entity)) {
            return null;
          }
        }

        // ----------------------------------------------------------
        // Continue through the render hierarchy.
        // ----------------------------------------------------------

        current = current.parent;
      }

      return null;
    }

    function hasEditorAncestor(object) {
      let current = object;

      while (current) {
        if (isEditorObject(current)) {
          return true;
        }

        current = current.parent;
      }

      return false;
    }

    function isGroundObject(object) {
      let current = object;

      while (current) {
        const userData = current.userData || {};

        if (userData.entity) {
          return isGroundEntity(userData.entity);
        }

        if (userData.entityUUID) {
          const entity = EntityManager.getByUUID(userData.entityUUID);

          if (entity) {
            return isGroundEntity(entity);
          }
        }

        current = current.parent;
      }

      return false;
    }

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
      // R3F CANVAS
      // ============================================================

      const canvas = gl?.domElement;

      if (!canvas) {
        console.warn("[EditorSelection] R3F canvas unavailable.");
        return;
      }

      const rect = canvas.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      // ============================================================
      // POINTER -> NDC
      // ============================================================

      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

      pointer.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // ============================================================
      // CAMERA RAY
      // ============================================================

      raycaster.current.setFromCamera(pointer.current, camera);

      // ============================================================
      // COLLECT RENDERABLE MESHES
      //
      // IMPORTANT:
      //
      // Do NOT require entity metadata directly on the mesh.
      //
      // Building/Road/etc. store entity metadata on their root
      // Group. Their actual meshes are children of that group.
      //
      // We raycast the mesh and resolve the Entity by walking upward.
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
        // Ignore gizmo meshes and meshes inside gizmo hierarchy.
        // ----------------------------------------------------------

        if (hasEditorAncestor(object)) {
          return;
        }

        // ----------------------------------------------------------
        // Ground is infrastructure, not selectable.
        //
        // We can identify it from the Entity root even though the
        // actual ground mesh itself may not contain entity metadata.
        // ----------------------------------------------------------

        if (isGroundObject(object)) {
          return;
        }

        // ----------------------------------------------------------
        // Add every remaining mesh.
        //
        // Entity ownership is resolved after the raycast by walking
        // from the hit mesh toward the root.
        // ----------------------------------------------------------

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

      console.log("Canvas:", canvas);

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
        console.log("Result: nothing under cursor.");

        console.groupEnd();

        EditorSelection.clearSelection();

        return;
      }

      // ============================================================
      // FIND FIRST VALID ENTITY
      //
      // Important:
      //
      // Three.js may return a child mesh as the ray hit.
      //
      // We walk:
      //
      // Mesh
      //   ↓
      // Entity Group
      //   ↓
      // Scene
      //
      // and resolve the Entity from the first matching ancestor.
      // ============================================================

      let selectedEntity = null;
      let selectedObject = null;
      let selectedHit = null;

      for (const hit of hits) {
        const result = findEntityFromObject(hit.object);

        if (!result) {
          continue;
        }

        selectedEntity = result.entity;
        selectedObject = result.object;
        selectedHit = hit;

        break;
      }

      // ============================================================
      // NO VALID ENTITY
      // ============================================================

      if (!selectedEntity) {
        console.log(
          "Result: ray hit render objects, but no Nova Entity was found.",
        );

        console.log("Closest hit object:", hits[0]?.object);

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

      console.log("Selected entity root:", selectedObject);

      console.log("Hit mesh:", selectedHit?.object);

      console.log("Hit distance:", selectedHit?.distance);

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
  }, [camera, scene, gl]);

  return null;
}
