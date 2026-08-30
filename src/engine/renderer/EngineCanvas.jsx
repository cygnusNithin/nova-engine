import { Canvas, events } from "@react-three/fiber";
import * as THREE from "three";

import Renderer from "./Renderer";
import CameraController from "../camera/CameraController";
import { SceneManager } from "../scene";
import { EngineLoop } from "../loop";

/*
 * IMPORTANT:
 *
 * Always calculate pointer coordinates from the real browser
 * client position and the actual canvas rectangle.
 *
 * This avoids relying on offsetX / offsetY, which can become
 * unreliable when event targets or layout contexts change.
 */
const novaEvents = (state) => ({
  ...events(state),

  compute: (event, currentState) => {
    const canvas = currentState.gl.domElement;
    const rect = canvas.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    currentState.pointer.set(x, y);

    /*
     * Ensure the camera world matrix is current before the
     * ray is generated.
     */
    currentState.camera.updateMatrixWorld(true);

    /*
     * Generate the interaction ray using the SAME camera that
     * is currently rendering the scene.
     */
    currentState.raycaster.setFromCamera(
      currentState.pointer,
      currentState.camera,
    );
  },
});

export default function EngineCanvas() {
  return (
    <Canvas
      shadows
      events={novaEvents}
      camera={{
        position: [0, 5, 12],
        fov: 60,
      }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
    >
      <Renderer />

      <CameraController />

      <EngineLoop />

      <SceneManager />
    </Canvas>
  );
}
