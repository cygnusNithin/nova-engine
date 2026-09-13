import { useRef } from "react";

import { useFrame, useThree } from "@react-three/fiber";

import * as THREE from "three";

import useEngineStore from "../../store/engineStore";

import CameraManager from "./CameraManager";

export default function CameraController() {
  const { camera, events, size, set } = useThree();

  const keyboard = useEngineStore((state) => state.keyboard);

  const mouse = useEngineStore((state) => state.mouse);

  const editor = useEngineStore((state) => state.editor);

  const cameraViewRequest = useEngineStore((state) => state.cameraViewRequest);

  const clearCameraViewRequest = useEngineStore(
    (state) => state.clearCameraViewRequest,
  );

  const setCameraProjection = useEngineStore(
    (state) => state.setCameraProjection,
  );

  const consumeMouseMotion = useEngineStore(
    (state) => state.consumeMouseMotion,
  );

  /*
   * Remember the previous camera matrix.
   *
   * We only need to force an event recalculation when the
   * camera has actually moved or rotated.
   */
  const previousCameraMatrix = useRef(camera.matrixWorld.clone());

  // ============================================================
  // TARGET
  // ============================================================

  const getTarget = () => {
    const selected = useEngineStore.getState().editor.selectedEntity;

    if (selected?.transform?.position) {
      return selected.transform.position.clone();
    }

    return new THREE.Vector3(0, 0, 0);
  };

  // ============================================================
  // SNAP VIEW
  // ============================================================

  const snapView = (direction, up) => {
    const target = getTarget();

    const currentDistance = camera.position.distanceTo(target);

    const distance = Math.max(currentDistance, 8);

    const position = target
      .clone()
      .add(direction.clone().normalize().multiplyScalar(distance));

    camera.position.copy(position);

    camera.up.copy(up);

    camera.lookAt(target);

    camera.updateProjectionMatrix();

    camera.updateMatrixWorld(true);
  };

  // ============================================================
  // PROJECTION
  // ============================================================

  const toggleProjection = () => {
    const target = getTarget();

    const position = camera.position.clone();

    const quaternion = camera.quaternion.clone();

    const up = camera.up.clone();

    const distance = Math.max(camera.position.distanceTo(target), 8);

    // ==========================================================
    // PERSPECTIVE -> ORTHOGRAPHIC
    // ==========================================================

    if (camera.isPerspectiveCamera) {
      const aspect = size.width / Math.max(size.height, 1);

      const halfHeight = Math.max(distance * 0.35, 4);

      const halfWidth = halfHeight * aspect;

      const nextCamera = new THREE.OrthographicCamera(
        -halfWidth,
        halfWidth,
        halfHeight,
        -halfHeight,
        0.1,
        2000,
      );

      nextCamera.position.copy(position);

      nextCamera.quaternion.copy(quaternion);

      nextCamera.up.copy(up);

      nextCamera.lookAt(target);

      nextCamera.zoom = 1;

      nextCamera.updateProjectionMatrix();

      nextCamera.updateMatrixWorld(true);

      set({
        camera: nextCamera,
      });

      setCameraProjection("orthographic");

      return;
    }

    // ==========================================================
    // ORTHOGRAPHIC -> PERSPECTIVE
    // ==========================================================

    const nextCamera = new THREE.PerspectiveCamera(
      60,
      size.width / Math.max(size.height, 1),
      0.1,
      2000,
    );

    nextCamera.position.copy(position);

    nextCamera.quaternion.copy(quaternion);

    nextCamera.up.copy(up);

    nextCamera.lookAt(target);

    nextCamera.updateProjectionMatrix();

    nextCamera.updateMatrixWorld(true);

    set({
      camera: nextCamera,
    });

    setCameraProjection("perspective");
  };

  // ============================================================
  // CAMERA VIEW REQUEST
  // ============================================================

  const processCameraViewRequest = () => {
    if (!cameraViewRequest) {
      return;
    }

    const { type, direction, up } = cameraViewRequest;

    if (type === "snap") {
      snapView(
        new THREE.Vector3(direction[0], direction[1], direction[2]),
        new THREE.Vector3(up[0], up[1], up[2]),
      );
    }

    if (type === "projection") {
      toggleProjection();
    }

    clearCameraViewRequest();
  };

  // ============================================================
  // FRAME
  // ============================================================

  useFrame((_, delta) => {
    // ----------------------------------------------------------
    // 1. UPDATE CAMERA
    // ----------------------------------------------------------

    CameraManager(camera, keyboard, mouse, editor, delta);

    // ----------------------------------------------------------
    // 2. PROCESS VIEW BUTTON
    // ----------------------------------------------------------

    processCameraViewRequest();

    // ----------------------------------------------------------
    // 3. UPDATE CAMERA MATRICES
    // ----------------------------------------------------------

    camera.updateMatrixWorld(true);

    // ----------------------------------------------------------
    // 4. CAMERA MOVED?
    // ----------------------------------------------------------

    const cameraChanged = !previousCameraMatrix.current.equals(
      camera.matrixWorld,
    );

    // ----------------------------------------------------------
    // 5. RECALCULATE HOVER
    // ----------------------------------------------------------

    if (cameraChanged && events?.update) {
      events.update();

      previousCameraMatrix.current.copy(camera.matrixWorld);
    }

    // ----------------------------------------------------------
    // 6. CONSUME CAMERA INPUT
    // ----------------------------------------------------------

    if (mouse.deltaX || mouse.deltaY || mouse.wheel) {
      consumeMouseMotion();
    }
  }, -1);

  return null;
}
