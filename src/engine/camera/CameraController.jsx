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

  useFrame((_, delta) => {
    /*
     * Update the actual camera transform first.
     */
    CameraManager(camera, keyboard, mouse, editor, delta);

    /*
     * IMPORTANT:
     *
     * CameraManager can change position/orientation.
     *
     * Three.js normally updates matrixWorld during the render
     * phase, but R3F pointer events may be refreshed before that.
     *
     * The pointer ray must therefore use the NEW camera matrix.
     */
    camera.updateMatrixWorld(true);

    /*
     * Recalculate R3F's pointer ray using the current camera.
     *
     * This is what keeps gizmo hover synchronized even when the
     * mouse itself has not moved.
     */
    if (events?.update) {
      events.update();
    }

    if (mouse.deltaX || mouse.deltaY || mouse.wheel) {
      consumeMouseMotion();
    }
  }, -1);

  return null;
}
