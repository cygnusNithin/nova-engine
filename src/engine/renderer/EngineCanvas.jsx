import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import Renderer from "./Renderer";
import CameraController from "../camera/CameraController";
import { SceneManager } from "../scene";
import { EngineLoop } from "../loop";

export default function EngineCanvas() {
  return (
    <Canvas
      shadows
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
