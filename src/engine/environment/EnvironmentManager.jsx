import { useFrame } from "@react-three/fiber";

import Ground from "./Ground";
import SkyComponent from "./Sky";

import TimeManager from "./TimeManager";

export default function EnvironmentManager() {
  useFrame((_, delta) => {
    TimeManager.update(delta);
  });

  return (
    <>
      <SkyComponent />

      <Ground />
    </>
  );
}
