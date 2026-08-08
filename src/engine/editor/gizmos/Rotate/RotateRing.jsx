import { Torus } from "@react-three/drei";

import GizmoMaterial from "../shared/GizmoMaterial";

import { GIZMO_COLORS } from "../shared/GizmoConstants";

export default function RotateRing({
  axis,
  color,
  rotation,
  hovered,
  active,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}) {
  const displayColor = active
    ? GIZMO_COLORS.HOVER
    : hovered
      ? GIZMO_COLORS.ROTATE_HOVER
      : color;

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
      {/* Invisible enlarged interaction ring */}
      <Torus
        args={[1.2, 0.11, 12, 64]}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshBasicMaterial
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
        />
      </Torus>

      {/* Visible ring */}
      <Torus args={[1.2, 0.025, 12, 64]}>
        <primitive object={GizmoMaterial.get(displayColor)} attach="material" />
      </Torus>
    </group>
  );
}
