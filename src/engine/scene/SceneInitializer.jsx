import { useLayoutEffect } from "react";

import { useThree } from "@react-three/fiber";

import SceneService from "./SceneService";

export default function SceneInitializer() {
  const { scene } = useThree();

  useLayoutEffect(() => {
    console.log("[SceneInitializer] Initializing scene");

    SceneService.initialize(scene);

    console.log("[SceneInitializer] Scene initialized:", SceneService.scene);
  }, [scene]);

  return null;
}
