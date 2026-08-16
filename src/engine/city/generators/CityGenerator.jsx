import { useEffect } from "react";

import CityBlock from "../blocks/CityBlock";
import World from "../../world/World";

export default function CityGenerator() {
  useEffect(() => {
    console.log("[CityGenerator] Starting city generation");

    const spacing = 35;
    const entities = [];

    entities.push(...CityBlock({
      position: [-spacing, 0, -spacing],
    }));

    entities.push(...CityBlock({
      position: [spacing, 0, -spacing],
    }));

    entities.push(...CityBlock({
      position: [-spacing, 0, spacing],
    }));

    entities.push(...CityBlock({
      position: [spacing, 0, spacing],
    }));

    console.log("[CityGenerator] City generation complete");

    return () => {
      entities.forEach((entity) => {
        World.despawn(entity);
      });
    };
  }, []);

  return null;
}
