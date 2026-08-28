import { useRef } from "react";

import { useFrame, useThree } from "@react-three/fiber";

import useEngineStore from "../../store/engineStore";

import CameraManager from "./CameraManager";

const DEBUG_CAMERA = true;

export default function CameraController() {
  const { camera, events } = useThree();

  const keyboard = useEngineStore((state) => state.keyboard);
  const mouse = useEngineStore((state) => state.mouse);
  const editor = useEngineStore((state) => state.editor);

  const consumeMouseMotion = useEngineStore(
    (state) => state.consumeMouseMotion,
  );

  /*
   * Persist diagnostic values between React renders.
   */
  const lastCameraPosition = useRef(null);
  const lastCameraRotation = useRef(null);

  useFrame((_, delta) => {
    /*
     * Update the actual camera transform first.
     */
    CameraManager(camera, keyboard, mouse, editor, delta);

    /*
     * CameraManager can change position/orientation.
     * Keep Three.js and R3F pointer calculations synchronized.
     */
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);

    /*
     * Recalculate R3F pointer ray using the current camera.
     */
    if (events?.update) {
      events.update();
    }

    /*
     * Camera movement diagnostics.
     *
     * Only log when the camera actually changes.
     */
    if (DEBUG_CAMERA) {
      const position = {
        x: Number(camera.position.x.toFixed(4)),
        y: Number(camera.position.y.toFixed(4)),
        z: Number(camera.position.z.toFixed(4)),
      };

      const rotation = {
        x: Number(camera.rotation.x.toFixed(4)),
        y: Number(camera.rotation.y.toFixed(4)),
        z: Number(camera.rotation.z.toFixed(4)),
      };

      const positionChanged =
        !lastCameraPosition.current ||
        position.x !== lastCameraPosition.current.x ||
        position.y !== lastCameraPosition.current.y ||
        position.z !== lastCameraPosition.current.z;

      const rotationChanged =
        !lastCameraRotation.current ||
        rotation.x !== lastCameraRotation.current.x ||
        rotation.y !== lastCameraRotation.current.y ||
        rotation.z !== lastCameraRotation.current.z;

      if (positionChanged || rotationChanged) {
        console.groupCollapsed("[NOVA CAMERA] Camera updated");

        console.log("Position:", position);
        console.log("Rotation:", rotation);

        console.log("Matrix world position:", {
          x: Number(camera.matrixWorld.elements[12].toFixed(4)),
          y: Number(camera.matrixWorld.elements[13].toFixed(4)),
          z: Number(camera.matrixWorld.elements[14].toFixed(4)),
        });

        console.groupEnd();

        lastCameraPosition.current = position;
        lastCameraRotation.current = rotation;
      }
    }

    if (mouse.deltaX || mouse.deltaY || mouse.wheel) {
      consumeMouseMotion();
    }
  }, -1);

  return null;
}
