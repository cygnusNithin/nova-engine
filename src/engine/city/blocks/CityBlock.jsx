import Road from "../roads/Road";
import Building from "../buildings/Building";

export default function CityBlock({ position = [0, 0, 0] } = {}) {
  console.log("[CityBlock] Creating:", position);

  const [x, y, z] = position;

  Road({
    position: [x, y, z],
  });

  Building({
    position: [x - 6, y, z - 6],
    height: 8,
  });

  Building({
    position: [x + 6, y, z - 6],
    height: 12,
  });

  Building({
    position: [x - 6, y, z + 6],
    height: 10,
  });

  Building({
    position: [x + 6, y, z + 6],
    height: 7,
  });
}
