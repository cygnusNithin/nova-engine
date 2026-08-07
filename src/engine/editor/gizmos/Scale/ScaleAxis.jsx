import { Cylinder, Box } from "@react-three/drei";

import GizmoMaterial from "../shared/GizmoMaterial";

export default function ScaleAxis({
  axis,
  color,
  rotation,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}) {
  const handlePointerDown = (event) => {
    onPointerDown?.(event, axis);
  };

  const handlePointerOver = (event) => {
    onPointerOver?.(event, axis);
  };

  const handlePointerOut = (event) => {
    onPointerOut?.(event, axis);
  };

  return (
    <group rotation={rotation}>
      <Cylinder
        args={[0.015, 0.015, 0.9]}
        position={[0, 0.45, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <primitive object={GizmoMaterial.get(color)} attach="material" />
      </Cylinder>

      <Box
        args={[0.08, 0.08, 0.08]}
        position={[0, 0.95, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <primitive object={GizmoMaterial.get(color)} attach="material" />
      </Box>
    </group>
  );
}
