import Road from "../roads/Road";
import Building from "../buildings/Building";

export default function CityBlock({ position = [0, 0, 0] } = {}) {
  console.log("[CityBlock] Creating:", position);

  const [x, y, z] = position;

  const entities = [];

  const road = Road({
    position: [x, y, z],
  });

  if (road) {
    entities.push(road);
  }

  const southwest = Building({
    position: [x - 6, y, z - 6],
    height: 8,
  });

  if (southwest) {
    entities.push(southwest);
  }

  const southeast = Building({
    position: [x + 6, y, z - 6],
    height: 12,
  });

  if (southeast) {
    entities.push(southeast);
  }

  const northwest = Building({
    position: [x - 6, y, z + 6],
    height: 10,
  });

  if (northwest) {
    entities.push(northwest);
  }

  const northeast = Building({
    position: [x + 6, y, z + 6],
    height: 7,
  });

  if (northeast) {
    entities.push(northeast);
  }

  return entities;
}
