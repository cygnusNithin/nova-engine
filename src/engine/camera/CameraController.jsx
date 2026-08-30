import { useRef } from "react";

import { useFrame, useThree } from "@react-three/fiber";

import useEngineStore from "../../store/engineStore";

import CameraManager from "./CameraManager";

export default function CameraController() {
  const { camera, events } = useThree();

  const keyboard = useEngineStore((state) => state.keyboard);

  const mouse = useEngineStore((state) => state.mouse);

  const editor = useEngineStore((state) => state.editor);

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

  useFrame((_, delta) => {
    /*
     * ============================================================
     * 1. UPDATE CAMERA
     * ============================================================
     */

    CameraManager(camera, keyboard, mouse, editor, delta);

    /*
     * ============================================================
     * 2. UPDATE CAMERA MATRICES
     * ============================================================
     *
     * The camera has been changed manually by CameraManager.
     * Three.js must have the current world matrix before any
     * pointer ray is calculated.
     */

    camera.updateMatrixWorld(true);

    /*
     * ============================================================
     * 3. CAMERA MOVED?
     * ============================================================
     */

    const cameraChanged = !previousCameraMatrix.current.equals(
      camera.matrixWorld,
    );

    /*
     * ============================================================
     * 4. RECALCULATE HOVER WITH CURRENT CAMERA
     * ============================================================
     *
     * R3F normally raycasts when the pointer moves.
     *
     * But in this engine the camera can move while the cursor
     * stays still. In that situation we must explicitly tell
     * R3F to re-run the pointer intersection using the current
     * camera.
     */

    if (cameraChanged && events?.update) {
      events.update();

      previousCameraMatrix.current.copy(camera.matrixWorld);
    }

    /*
     * ============================================================
     * 5. CONSUME CAMERA INPUT
     * ============================================================
     */

    if (mouse.deltaX || mouse.deltaY || mouse.wheel) {
      consumeMouseMotion();
    }
  }, -1);

  return null;
}
