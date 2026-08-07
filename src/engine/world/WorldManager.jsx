import WorldProvider from "./WorldProvider";

import { LightingManager } from "../lighting";
import { EnvironmentManager } from "../environment";
import CityGenerator from "../city/generators/CityGenerator";

export default function WorldManager() {
  return (
    <>
      <WorldProvider />

      <color attach="background" args={["#87CEEB"]} />

      <LightingManager />

      <EnvironmentManager />

      <CityGenerator />
    </>
  );
}
