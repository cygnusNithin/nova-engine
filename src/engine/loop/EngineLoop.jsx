import { useFrame } from "@react-three/fiber";

import World from "../world/World";

export default function EngineLoop() {
  useFrame((state, delta) => {
    World.update(delta);

    World.lateUpdate(delta);
  });

  return null;
}
