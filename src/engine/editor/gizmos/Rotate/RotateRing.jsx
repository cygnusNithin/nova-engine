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
    event.stopPropagation();

    onPointerDown?.(event, axis);
  };

  const handlePointerOver = (event) => {
    event.stopPropagation();

    onPointerOver?.(event, axis);
  };

  const handlePointerOut = (event) => {
    event.stopPropagation();

    onPointerOut?.(event);
  };

  return (
    <Torus
      args={[1.25, 0.025, 16, 96]}
      rotation={rotation}
      renderOrder={1000}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={GizmoMaterial.get(color)} attach="material" />
    </Torus>
  );
}
