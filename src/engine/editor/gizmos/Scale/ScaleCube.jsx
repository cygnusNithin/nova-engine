import { Box } from "@react-three/drei";

import GizmoMaterial from "../shared/GizmoMaterial";

export default function ScaleCube({
  axis,
  color,
  position,
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
    <Box
      args={[0.15, 0.15, 0.15]}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={GizmoMaterial.get(color)} attach="material" />
    </Box>
  );
}
