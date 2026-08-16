import { useEffect, useRef } from "react";

import { useThree } from "@react-three/fiber";

import * as THREE from "three";

import EditorSelection from "./EditorSelection";

import GizmoController from "../gizmos/GizmoController";

import EntityManager from "../../entity/EntityManager";

function isGizmoObject(object) {
  let current = object;

  while (current) {
    if (current.userData?.gizmo) {
      return true;
    }

    current = current.parent;
  }

  return false;
}

export default function EditorRaycaster() {
  const { camera, scene, gl } = useThree();

  const raycaster = useRef(new THREE.Raycaster());

  const pointer = useRef(new THREE.Vector2());

  useEffect(() => {
    function onPointerDown(event) {
      if (event.button !== 0) {
        return;
      }

      if (GizmoController.isTransforming()) {
        return;
      }

      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("[data-nova-editor='true']")
      ) {
        return;
      }

      const rect = gl.domElement.getBoundingClientRect();

      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

      pointer.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      camera.updateMatrixWorld();
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
      raycaster.current.setFromCamera(pointer.current, camera);

      const meshes = [];

      scene.traverse((object) => {
        if (!object.isMesh) {
          return;
        }

        if (object.userData.ignoreRaycast) {
          return;
        }

        if (object.type === "Sky" || object.type === "Sky2") {
          return;
        }

        meshes.push(object);
      });

      const intersects = raycaster.current.intersectObjects(meshes, false);

      if (!intersects.length) {
        EditorSelection.clearSelection();

        return;
      }

      // ========================================================
      // GIZMO OWNS THIS CLICK
      // ========================================================

      const nearestHit = intersects[0];

      if (nearestHit?.object && isGizmoObject(nearestHit.object)) {
        return;
      }

      // ========================================================
      // FIND ENTITY
      // ========================================================

      let selectedEntity = null;

      for (const hit of intersects) {
        let object = hit.object;

        if (isGizmoObject(object)) {
          continue;
        }

        while (object) {
          if (object.userData?.entity) {
            selectedEntity = object.userData.entity;

            break;
          }

          if (object.userData?.entityUUID) {
            const entity = EntityManager.getByUUID(object.userData.entityUUID);

            if (entity) {
              selectedEntity = entity;

              break;
            }
          }

          object = object.parent;
        }

        if (selectedEntity) {
          break;
        }
      }

      if (!selectedEntity) {
        EditorSelection.clearSelection();

        return;
      }

      EditorSelection.selectEntity(selectedEntity);
    }

    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [camera, scene]);

  return null;
}
