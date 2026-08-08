import { Torus } from "@react-three/drei";

import GizmoMaterial from "../shared/GizmoMaterial";

import { GIZMO_COLORS } from "../shared/GizmoConstants";

export default function RotateRing({
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
    <Torus
      args={[1.2, 0.025, 12, 64]}
      rotation={rotation}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={GizmoMaterial.get(displayColor)} attach="material" />
    </Torus>
  );
}
