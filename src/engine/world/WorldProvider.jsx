import { useEffect } from "react";

import World from "./World";

export default function WorldProvider() {
  useEffect(() => {
    World.initialize();

    return () => {
      World.destroy();
    };
  }, []);

  return null;
}
