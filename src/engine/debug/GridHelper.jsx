import { Grid } from "@react-three/drei";

export default function GridHelper() {
  return (
    <Grid
      args={[100, 100]}
      cellSize={1}
      cellThickness={0.5}
      sectionSize={10}
      sectionThickness={1.5}
      fadeDistance={150}
      infiniteGrid
    />
  );
}