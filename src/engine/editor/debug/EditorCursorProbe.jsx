import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function EditorCursorProbe() {
  const { camera, gl, scene } = useThree();

  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());

  const lastCameraPosition = useRef(new THREE.Vector3());
  const lastCameraQuaternion = useRef(new THREE.Quaternion());

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

    function getGizmoWorldData(object) {
      object.updateWorldMatrix(true, false);

      const position = new THREE.Vector3();
      const quaternion = new THREE.Quaternion();
      const scale = new THREE.Vector3();

      object.matrixWorld.decompose(position, quaternion, scale);

      return {
        position,
        quaternion,
        scale,
      };
    }

    function logCameraChanged() {
      camera.updateMatrixWorld();

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

      console.log("matrixWorldNeedsUpdate:", camera.matrixWorldNeedsUpdate);

      console.log(
        "projectionMatrixNeedsUpdate:",
        camera.projectionMatrixNeedsUpdate,
      );

      console.log("matrixWorld:", camera.matrixWorld.clone());

      console.log("projectionMatrix:", camera.projectionMatrix.clone());

      console.groupEnd();

      lastCameraPosition.current.copy(camera.position);
      lastCameraQuaternion.current.copy(camera.quaternion);
    }

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
       * The camera must be up-to-date BEFORE setFromCamera().
       */
      camera.updateMatrixWorld();

      if (camera.isPerspectiveCamera) {
        camera.updateProjectionMatrix();
      }

      raycaster.current.setFromCamera(pointer.current, camera);

      console.groupCollapsed("[EDITOR_POINTER]");

      console.log("screen:", {
        x: event.clientX,
        y: event.clientY,
      });

      console.log("canvasRect:", {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });

      console.log("normalizedPointer:", {
        x,
        y,
      });

      console.log("camera.position:", camera.position.clone());

      console.log("camera.rotation:", camera.rotation.clone());

      console.log("camera.quaternion:", camera.quaternion.clone());

      console.log("camera.matrixWorld:", camera.matrixWorld.clone());

      console.log("camera.projectionMatrix:", camera.projectionMatrix.clone());

      console.log("ray.origin:", raycaster.current.ray.origin.clone());

      console.log("ray.direction:", raycaster.current.ray.direction.clone());

      console.groupEnd();

      /*
       * ---------------------------------------------------------
       * Gizmo intersection diagnostic
       * ---------------------------------------------------------
       *
       * We intentionally inspect ALL meshes here.
       * This does not modify selection.
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

      const gizmoHit = intersections.find((hit) => isGizmoObject(hit.object));

      console.groupCollapsed("[EDITOR_RAYCAST_HITS]");

      console.log("hit count:", intersections.length);

      intersections.forEach((hit, index) => {
        console.log(`hit[${index}]`, {
          object: hit.object,
          name: hit.object?.name,
          type: hit.object?.type,
          userData: hit.object?.userData,
          distance: hit.distance,
          point: hit.point?.clone(),
        });
      });

      console.groupEnd();

      if (!gizmoHit) {
        console.log("[GIZMO_POINTER] NO GIZMO HIT");
        return;
      }

      const gizmoObject = gizmoHit.object;

      const gizmoWorld = getGizmoWorldData(gizmoObject);

      console.groupCollapsed("[GIZMO_POINTER]");

      console.log("pointer:", pointer.current.clone());

      console.log("ray.origin:", raycaster.current.ray.origin.clone());

      console.log("ray.direction:", raycaster.current.ray.direction.clone());

      console.log("gizmo object:", gizmoObject);

      console.log("gizmo world position:", gizmoWorld.position.clone());

      console.log("gizmo world quaternion:", gizmoWorld.quaternion.clone());

      console.log("gizmo world scale:", gizmoWorld.scale.clone());

      console.log("intersection distance:", gizmoHit.distance);

      console.log("intersection point:", gizmoHit.point.clone());

      console.log("intersection face:", gizmoHit.face);

      console.groupEnd();
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

      /*
       * Run immediately when cursor enters the canvas.
       * This establishes the first valid pointer/ray state.
       */
      onPointerMove(event);
    }

    function onPointerLeave() {
      console.log("[EDITOR_POINTER_LEAVE]");
    }

    /*
     * Camera diagnostic polling.
     *
     * This is deliberately lightweight.
     * It lets us detect camera changes even when the
     * camera controller does not dispatch an event.
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
