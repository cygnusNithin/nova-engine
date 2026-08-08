import { Cylinder, Box } from "@react-three/drei";

import GizmoMaterial from "../shared/GizmoMaterial";

import { GIZMO_COLORS } from "../shared/GizmoConstants";

export default function ScaleAxis({
  axis,
  color,
  rotation,
  highlighted,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}) {
  const displayColor = highlighted ? GIZMO_COLORS.HOVER : color;

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
        args={[0.025, 0.025, 0.9]}
        position={[0, 0.45, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <primitive object={GizmoMaterial.get(displayColor)} attach="material" />
      </Cylinder>

      <Box
        args={[0.12, 0.12, 0.12]}
        position={[0, 0.95, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <primitive object={GizmoMaterial.get(displayColor)} attach="material" />
      </Box>
    </group>
  );
}
