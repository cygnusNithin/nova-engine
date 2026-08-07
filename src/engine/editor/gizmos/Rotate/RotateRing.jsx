import { Torus } from "@react-three/drei";

import GizmoMaterial from "../shared/GizmoMaterial";

export default function RotateRing({
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
    <Torus
      args={[1.2, 0.015, 12, 64]}
      rotation={rotation}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={GizmoMaterial.get(color)} attach="material" />
    </Torus>
  );
}
