import { useEffect } from "react";

import CityBlock from "../blocks/CityBlock";

export default function CityGenerator() {
  useEffect(() => {
    console.log("[CityGenerator] Starting city generation");

    const spacing = 35;

    CityBlock({
      position: [-spacing, 0, -spacing],
    });

    CityBlock({
      position: [spacing, 0, -spacing],
    });

    CityBlock({
      position: [-spacing, 0, spacing],
    });

    CityBlock({
      position: [spacing, 0, spacing],
    });

    console.log("[CityGenerator] City generation complete");
  }, []);

  return null;
}
