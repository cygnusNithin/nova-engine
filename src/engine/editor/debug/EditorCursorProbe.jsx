import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const DEBUG_CURSOR = true;
const DEBUG_GIZMO_COMPARISON = true;

const WORLD_GROUND_Y = 0;

function vectorRecord(vector, precision = 4) {
  if (!vector) {
    return null;
  }

  return {
    x: Number(vector.x.toFixed(precision)),
    y: Number(vector.y.toFixed(precision)),
    z: Number(vector.z.toFixed(precision)),
  };
}

function number(value, precision = 4) {
  if (!Number.isFinite(value)) {
    return null;
  }

  return Number(value.toFixed(precision));
}

export default function EditorCursorProbe() {
  const { camera, gl, scene } = useThree();

  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());

  const lastCameraPosition = useRef(new THREE.Vector3());
  const lastCameraQuaternion = useRef(new THREE.Quaternion());

  /*
   * Reusable temporary objects.
   *
   * These avoid allocating unnecessary Three.js objects
   * on every pointer movement.
   */
  const temp = useRef({
    groundPlane: new THREE.Plane(new THREE.Vector3(0, 1, 0), -WORLD_GROUND_Y),

    groundPoint: new THREE.Vector3(),

    objectPosition: new THREE.Vector3(),

    objectQuaternion: new THREE.Quaternion(),

    objectScale: new THREE.Vector3(),

    projected: new THREE.Vector3(),

    axisDirection: new THREE.Vector3(0, 1, 0),

    axisEnd: new THREE.Vector3(),

    closestPointOnRay: new THREE.Vector3(),

    closestPointOnAxis: new THREE.Vector3(),
  });

  useEffect(() => {
    const canvas = gl.domElement;

    if (!canvas) {
      return undefined;
    }

    function getCanvasPointer(event) {
      const rect = canvas.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return null;
      }

      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      return {
        rect,
        x,
        y,
      };
    }

    function isInsideCanvas(event, rect) {
      return (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      );
    }

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

    function findGizmoRoot(object) {
      let current = object;

      while (current) {
        if (
          current.userData?.gizmoMode ||
          current.name === "MoveGizmo" ||
          current.name === "RotateGizmo" ||
          current.name === "ScaleGizmo"
        ) {
          return current;
        }

        current = current.parent;
      }

      return null;
    }

    function getWorldTransform(object) {
      object.updateWorldMatrix(true, false);

      const { objectPosition, objectQuaternion, objectScale } = temp.current;

      object.matrixWorld.decompose(
        objectPosition,
        objectQuaternion,
        objectScale,
      );

      return {
        position: objectPosition.clone(),
        quaternion: objectQuaternion.clone(),
        scale: objectScale.clone(),
      };
    }

    function projectWorldPosition(worldPosition) {
      temp.current.projected.copy(worldPosition);
      temp.current.projected.project(camera);

      return temp.current.projected.clone();
    }

    function calculateGroundIntersection() {
      const hit = raycaster.current.ray.intersectPlane(
        temp.current.groundPlane,
        temp.current.groundPoint,
      );

      if (!hit) {
        return null;
      }

      return temp.current.groundPoint.clone();
    }

    function calculateCursorToNDCDistance(worldPosition) {
      const projected = projectWorldPosition(worldPosition);

      const dx = projected.x - pointer.current.x;
      const dy = projected.y - pointer.current.y;

      return {
        ndc: vectorRecord(projected),

        distance: number(Math.sqrt(dx * dx + dy * dy), 5),

        dx: number(dx, 5),

        dy: number(dy, 5),
      };
    }

    /*
     * Calculates the shortest distance between the cursor ray
     * and a point in world space.
     *
     * This is extremely useful for gizmo debugging.
     *
     * If the cursor visually appears to be over an axis but
     * this number is large, the ray is not actually aligned
     * with that axis.
     */
    function distanceFromRayToPoint(point) {
      const ray = raycaster.current.ray;

      const closestPoint = ray.closestPointToPoint(
        point,
        temp.current.closestPointOnRay,
      );

      if (!closestPoint) {
        return null;
      }

      return number(closestPoint.distanceTo(point), 5);
    }

    /*
     * Camera diagnostic.
     */
    function logCameraChanged() {
      camera.updateMatrixWorld(true);

      const positionChanged = !lastCameraPosition.current.equals(
        camera.position,
      );

      const quaternionChanged = !lastCameraQuaternion.current.equals(
        camera.quaternion,
      );

      if (!positionChanged && !quaternionChanged) {
        return;
      }

      console.groupCollapsed("[CAMERA_CHANGED]");

      console.log("position:", camera.position.clone());

      console.log("rotation:", camera.rotation.clone());

      console.log("quaternion:", camera.quaternion.clone());

      console.log("matrixWorld:", camera.matrixWorld.clone());

      console.log("projectionMatrix:", camera.projectionMatrix.clone());

      console.groupEnd();

      lastCameraPosition.current.copy(camera.position);

      lastCameraQuaternion.current.copy(camera.quaternion);
    }

    /*
     * Main cursor diagnostic.
     */
    function onPointerMove(event) {
      const result = getCanvasPointer(event);

      if (!result) {
        return;
      }

      const { rect, x, y } = result;

      if (!isInsideCanvas(event, rect)) {
        return;
      }

      pointer.current.set(x, y);

      /*
       * IMPORTANT:
       *
       * Camera must be completely current before
       * creating the ray.
       */
      camera.updateMatrixWorld(true);

      if (camera.isPerspectiveCamera) {
        camera.updateProjectionMatrix();
      }

      raycaster.current.setFromCamera(pointer.current, camera);

      /*
       * ---------------------------------------------------------
       * WORLD CURSOR POSITION
       * ---------------------------------------------------------
       */

      const groundPoint = calculateGroundIntersection();

      if (DEBUG_CURSOR) {
        console.groupCollapsed("[NOVA CURSOR] Pointer State");

        console.log("Screen:", {
          x: event.clientX,
          y: event.clientY,
        });

        console.log("Canvas:", {
          left: number(rect.left, 2),
          top: number(rect.top, 2),
          width: number(rect.width, 2),
          height: number(rect.height, 2),
        });

        console.log("NDC:", {
          x: number(x, 5),
          y: number(y, 5),
        });

        console.log("Camera position:", vectorRecord(camera.position));

        console.log("Camera rotation:", vectorRecord(camera.rotation));

        console.log("Ray origin:", vectorRecord(raycaster.current.ray.origin));

        console.log(
          "Ray direction:",
          vectorRecord(raycaster.current.ray.direction),
        );

        console.log(
          "World position @ Y=0:",
          groundPoint ? vectorRecord(groundPoint) : null,
        );

        console.groupEnd();
      }

      /*
       * ---------------------------------------------------------
       * SCENE RAYCAST
       * ---------------------------------------------------------
       */

      const meshes = [];

      scene.traverse((object) => {
        if (!object.isMesh) {
          return;
        }

        if (object.userData?.ignoreRaycast) {
          return;
        }

        meshes.push(object);
      });

      const intersections = raycaster.current.intersectObjects(meshes, true);

      /*
       * ---------------------------------------------------------
       * GIZMO DATA
       * ---------------------------------------------------------
       */

      const gizmoHits = intersections.filter((hit) =>
        isGizmoObject(hit.object),
      );

      const gizmoRoots = [];

      scene.traverse((object) => {
        if (!object.userData?.gizmo) {
          return;
        }

        if (object.userData?.gizmoMode && !gizmoRoots.includes(object)) {
          gizmoRoots.push(object);
        }

        if (
          object.name === "MoveGizmo" ||
          object.name === "RotateGizmo" ||
          object.name === "ScaleGizmo"
        ) {
          if (!gizmoRoots.includes(object)) {
            gizmoRoots.push(object);
          }
        }
      });

      /*
       * ---------------------------------------------------------
       * GIZMO COMPARISON
       * ---------------------------------------------------------
       */

      if (DEBUG_GIZMO_COMPARISON && gizmoRoots.length > 0) {
        console.groupCollapsed("[NOVA CURSOR ↔ GIZMO]");

        console.log("Cursor NDC:", {
          x: number(pointer.current.x, 5),
          y: number(pointer.current.y, 5),
        });

        console.log(
          "Cursor world @ Y=0:",
          groundPoint ? vectorRecord(groundPoint) : null,
        );

        gizmoRoots.forEach((gizmoRoot) => {
          const gizmoWorld = getWorldTransform(gizmoRoot);

          const gizmoNDC = calculateCursorToNDCDistance(gizmoWorld.position);

          console.groupCollapsed(
            `Gizmo: ${
              gizmoRoot.name || gizmoRoot.userData?.gizmoMode || "unknown"
            }`,
          );

          console.log("World position:", {
            x: number(gizmoWorld.position.x),
            y: number(gizmoWorld.position.y),
            z: number(gizmoWorld.position.z),
          });

          console.log("World rotation:", {
            x: number(
              new THREE.Euler().setFromQuaternion(gizmoWorld.quaternion).x,
            ),

            y: number(
              new THREE.Euler().setFromQuaternion(gizmoWorld.quaternion).y,
            ),

            z: number(
              new THREE.Euler().setFromQuaternion(gizmoWorld.quaternion).z,
            ),
          });

          console.log("Screen/NDC comparison:", gizmoNDC);

          console.log(
            "Cursor ray → gizmo center distance:",
            distanceFromRayToPoint(gizmoWorld.position),
          );

          /*
           * Find all actual interactive gizmo handles.
           */
          const handles = [];

          scene.traverse((object) => {
            if (object.isMesh && object.userData?.gizmoHit) {
              const root = findGizmoRoot(object);

              if (root === gizmoRoot) {
                handles.push(object);
              }
            }
          });

          handles.forEach((handle) => {
            const handleWorld = getWorldTransform(handle);

            const handleNDC = calculateCursorToNDCDistance(
              handleWorld.position,
            );

            const axis =
              handle.userData?.gizmoAxis ??
              handle.userData?.gizmoType ??
              "unknown";

            /*
             * A cylinder is aligned to local Y.
             * Convert local Y into world space to obtain
             * the actual axis direction.
             */
            const axisDirection = temp.current.axisDirection
              .set(0, 1, 0)
              .applyQuaternion(handleWorld.quaternion)
              .normalize()
              .clone();

            const axisEnd = temp.current.axisEnd
              .copy(handleWorld.position)
              .add(
                axisDirection.clone().multiplyScalar(0.5 * handleWorld.scale.y),
              )
              .clone();

            console.groupCollapsed(`Axis/Handle: ${axis}`);

            console.log("Object:", {
              name: handle.name,
              type: handle.type,
              gizmoAxis: handle.userData?.gizmoAxis ?? null,
              gizmoType: handle.userData?.gizmoType ?? null,
            });

            console.log("World position:", vectorRecord(handleWorld.position));

            console.log("World axis direction:", vectorRecord(axisDirection));

            console.log("Approx axis endpoint:", vectorRecord(axisEnd));

            console.log("NDC position:", handleNDC.ndc);

            console.log("Cursor → handle NDC distance:", handleNDC.distance);

            console.log("Cursor → handle NDC delta:", {
              dx: handleNDC.dx,
              dy: handleNDC.dy,
            });

            console.log(
              "Cursor ray → handle center:",
              distanceFromRayToPoint(handleWorld.position),
            );

            /*
             * Tell us whether this handle was actually
             * hit by the scene raycaster.
             */
            const hit = gizmoHits.find(
              (intersection) => intersection.object === handle,
            );

            console.log("Raycast hit:", Boolean(hit));

            if (hit) {
              console.log("Hit distance:", number(hit.distance));

              console.log("Hit world point:", vectorRecord(hit.point));
            }

            console.groupEnd();
          });

          console.groupEnd();
        });

        console.groupEnd();
      }

      /*
       * ---------------------------------------------------------
       * GENERAL RAYCAST DIAGNOSTIC
       * ---------------------------------------------------------
       */

      console.groupCollapsed("[EDITOR_RAYCAST_HITS]");

      console.log("Hit count:", intersections.length);

      console.log("Gizmo hit count:", gizmoHits.length);

      intersections.forEach((hit, index) => {
        console.log(`hit[${index}]`, {
          object: hit.object,
          name: hit.object?.name,
          type: hit.object?.type,
          userData: hit.object?.userData,
          distance: number(hit.distance),
          point: vectorRecord(hit.point),
          isGizmo: isGizmoObject(hit.object),
        });
      });

      console.groupEnd();

      /*
       * ---------------------------------------------------------
       * GIZMO HIT DETAIL
       * ---------------------------------------------------------
       */

      const firstGizmoHit = gizmoHits[0] ?? null;

      if (firstGizmoHit) {
        const object = firstGizmoHit.object;

        const world = getWorldTransform(object);

        console.groupCollapsed("[GIZMO_POINTER]");

        console.log(
          "Axis:",
          object.userData?.gizmoAxis ?? object.userData?.gizmoType ?? null,
        );

        console.log("Object:", object.name);

        console.log("Gizmo world position:", vectorRecord(world.position));

        console.log("Cursor NDC:", {
          x: number(pointer.current.x, 5),
          y: number(pointer.current.y, 5),
        });

        console.log("Gizmo NDC:", calculateCursorToNDCDistance(world.position));

        console.log("Ray origin:", vectorRecord(raycaster.current.ray.origin));

        console.log(
          "Ray direction:",
          vectorRecord(raycaster.current.ray.direction),
        );

        console.log("Intersection point:", vectorRecord(firstGizmoHit.point));

        console.log("Intersection distance:", number(firstGizmoHit.distance));

        console.groupEnd();
      } else {
        console.log("[GIZMO_POINTER] NO GIZMO HIT");
      }
    }

    function onPointerEnter(event) {
      const result = getCanvasPointer(event);

      if (!result) {
        return;
      }

      console.log("[EDITOR_POINTER_ENTER]", {
        screen: {
          x: event.clientX,
          y: event.clientY,
        },

        normalizedPointer: {
          x: result.x,
          y: result.y,
        },
      });

      onPointerMove(event);
    }

    function onPointerLeave() {
      console.log("[EDITOR_POINTER_LEAVE]");
    }

    /*
     * Camera monitoring.
     */
    let animationFrame;

    function monitorCamera() {
      logCameraChanged();

      animationFrame = requestAnimationFrame(monitorCamera);
    }

    canvas.addEventListener("pointermove", onPointerMove);

    canvas.addEventListener("pointerenter", onPointerEnter);

    canvas.addEventListener("pointerleave", onPointerLeave);

    animationFrame = requestAnimationFrame(monitorCamera);

    return () => {
      canvas.removeEventListener("pointermove", onPointerMove);

      canvas.removeEventListener("pointerenter", onPointerEnter);

      canvas.removeEventListener("pointerleave", onPointerLeave);

      cancelAnimationFrame(animationFrame);
    };
  }, [camera, gl, scene]);

  return null;
}
