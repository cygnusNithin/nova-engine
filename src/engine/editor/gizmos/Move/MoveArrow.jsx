import { Cone } from "@react-three/drei";

import GizmoMaterial from "../shared/GizmoMaterial";

export default function MoveArrow({
  color,

  position,

  rotation,

  axis,

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
    <Cone
      args={[0.08, 0.18, 16]}
      position={position}
      rotation={rotation}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={GizmoMaterial.get(color)} attach="material" />
    </Cone>
  );
}
