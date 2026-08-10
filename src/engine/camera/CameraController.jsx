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
    CameraManager(camera, keyboard, mouse, editor, delta);

    /*
     * IMPORTANT
     *
     * Camera movement changes the projection of the pointer ray even
     * when the physical mouse has not moved.
     *
     * R3F normally refreshes pointer intersections from pointer events.
     * Camera movement itself does not necessarily generate another
     * pointer event.
     *
     * Refresh R3F's event ray after the camera has moved so gizmo
     * hover/selection remains correct from every camera angle.
     */
    if (events?.update) {
      events.update();
    }

    if (mouse.deltaX || mouse.deltaY || mouse.wheel) {
      consumeMouseMotion();
    }
  });

  return null;
}
