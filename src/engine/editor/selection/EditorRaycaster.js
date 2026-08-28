import { useEffect, useRef } from "react";

import { useThree } from "@react-three/fiber";

import * as THREE from "three";

import EditorSelection from "./EditorSelection";

import GizmoController from "../gizmos/GizmoController";

import EntityManager from "../../entity/EntityManager";

const DEBUG_SELECTION = true;

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

function getObjectName(object) {
  if (!object) {
    return "Unknown";
  }

  return (
    object.name || object.userData?.name || object.type || "Unnamed Object"
  );
}

function getEntityFromObject(object) {
  let current = object;

  while (current) {
    if (current.userData?.entity) {
      return current.userData.entity;
    }

    if (current.userData?.entityUUID) {
      const entity = EntityManager.getByUUID(current.userData.entityUUID);

      if (entity) {
        return entity;
      }
    }

    current = current.parent;
  }

  return null;
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
        if (DEBUG_SELECTION) {
          console.log("[NOVA SELECTION] Click ignored: gizmo is transforming");
        }

        return;
      }

      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("[data-nova-editor='true']")
      ) {
        if (DEBUG_SELECTION) {
          console.log("[NOVA SELECTION] Click ignored: editor UI");
        }

        return;
      }

      const rect = gl.domElement.getBoundingClientRect();

      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

      pointer.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      /*
       * Ensure the ray uses the latest camera transform.
       */
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);

      raycaster.current.setFromCamera(pointer.current, camera);

      if (DEBUG_SELECTION) {
        const cameraDirection = new THREE.Vector3();

        camera.getWorldDirection(cameraDirection);

        console.groupCollapsed("[NOVA SELECTION] Pointer click");

        console.log("Screen position:", {
          clientX: event.clientX,
          clientY: event.clientY,
        });

        console.log("Canvas rect:", {
          left: Number(rect.left.toFixed(2)),
          top: Number(rect.top.toFixed(2)),
          width: Number(rect.width.toFixed(2)),
          height: Number(rect.height.toFixed(2)),
        });

        console.log("NDC pointer:", {
          x: Number(pointer.current.x.toFixed(6)),
          y: Number(pointer.current.y.toFixed(6)),
        });

        console.log("Camera position:", {
          x: Number(camera.position.x.toFixed(4)),
          y: Number(camera.position.y.toFixed(4)),
          z: Number(camera.position.z.toFixed(4)),
        });

        console.log("Camera rotation:", {
          x: Number(camera.rotation.x.toFixed(4)),
          y: Number(camera.rotation.y.toFixed(4)),
          z: Number(camera.rotation.z.toFixed(4)),
        });

        console.log("Camera direction:", {
          x: Number(cameraDirection.x.toFixed(6)),
          y: Number(cameraDirection.y.toFixed(6)),
          z: Number(cameraDirection.z.toFixed(6)),
        });

        console.log("Ray origin:", {
          x: Number(raycaster.current.ray.origin.x.toFixed(4)),
          y: Number(raycaster.current.ray.origin.y.toFixed(4)),
          z: Number(raycaster.current.ray.origin.z.toFixed(4)),
        });

        console.log("Ray direction:", {
          x: Number(raycaster.current.ray.direction.x.toFixed(6)),
          y: Number(raycaster.current.ray.direction.y.toFixed(6)),
          z: Number(raycaster.current.ray.direction.z.toFixed(6)),
        });
      }

      const meshes = [];

      let entityMeshCount = 0;
      let ignoredMeshCount = 0;
      let gizmoMeshCount = 0;

      scene.traverse((object) => {
        if (!object.isMesh) {
          return;
        }

        if (object.userData.ignoreRaycast) {
          ignoredMeshCount += 1;
          return;
        }

        if (object.type === "Sky" || object.type === "Sky2") {
          ignoredMeshCount += 1;
          return;
        }

        if (isGizmoObject(object)) {
          gizmoMeshCount += 1;
        }

        if (getEntityFromObject(object)) {
          entityMeshCount += 1;
        }

        meshes.push(object);
      });

      const intersects = raycaster.current.intersectObjects(meshes, false);

      if (DEBUG_SELECTION) {
        console.log("Raycast mesh count:", meshes.length);
        console.log("Entity mesh count:", entityMeshCount);
        console.log("Gizmo mesh count:", gizmoMeshCount);
        console.log("Ignored mesh count:", ignoredMeshCount);
        console.log("Intersection count:", intersects.length);

        console.table(
          intersects.slice(0, 10).map((hit, index) => {
            const entity = getEntityFromObject(hit.object);

            return {
              index,
              object: getObjectName(hit.object),
              type: hit.object.type,
              distance: Number(hit.distance.toFixed(4)),
              gizmo: isGizmoObject(hit.object),
              entity: entity?.name || entity?.id || entity?.uuid || null,
              entityUUID: hit.object.userData?.entityUUID || null,
            };
          }),
        );
      }

      if (!intersects.length) {
        if (DEBUG_SELECTION) {
          console.warn(
            "[NOVA SELECTION FAILED] No objects intersected the selection ray.",
          );

          console.warn("This usually means one of these is wrong:", {
            pointerCoordinates: "NDC does not match canvas",
            cameraMatrix: "Camera transform is stale or incorrect",
            rayDirection: "Ray is pointing away from the entity",
            meshRegistration: "Entity meshes are missing from the scene",
          });

          console.groupEnd();
        }

        EditorSelection.clearSelection();

        return;
      }

      /*
       * GIZMO OWNS THIS CLICK
       */
      const nearestHit = intersects[0];

      if (nearestHit?.object && isGizmoObject(nearestHit.object)) {
        if (DEBUG_SELECTION) {
          console.log(
            "[NOVA SELECTION] Nearest hit belongs to gizmo. Selection skipped.",
          );

          console.groupEnd();
        }

        return;
      }

      /*
       * FIND ENTITY
       */
      let selectedEntity = null;
      let selectedHit = null;

      for (const hit of intersects) {
        const object = hit.object;

        if (isGizmoObject(object)) {
          continue;
        }

        const entity = getEntityFromObject(object);

        if (entity) {
          selectedEntity = entity;
          selectedHit = hit;

          break;
        }
      }

      if (!selectedEntity) {
        if (DEBUG_SELECTION) {
          console.warn(
            "[NOVA SELECTION FAILED] Objects were hit, but none belonged to an entity.",
          );

          console.log("Nearest blocking object:", {
            name: getObjectName(nearestHit.object),
            type: nearestHit.object.type,
            distance: Number(nearestHit.distance.toFixed(4)),
            userData: nearestHit.object.userData,
          });

          console.groupEnd();
        }

        EditorSelection.clearSelection();

        return;
      }

      if (DEBUG_SELECTION) {
        console.log("[NOVA SELECTION SUCCESS] Entity selected:", {
          entity:
            selectedEntity.name ||
            selectedEntity.id ||
            selectedEntity.uuid ||
            "Unknown",
          hitObject: getObjectName(selectedHit.object),
          distance: Number(selectedHit.distance.toFixed(4)),
        });

        console.groupEnd();
      }

      EditorSelection.selectEntity(selectedEntity);
    }

    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [camera, scene, gl.domElement]);

  return null;
}
