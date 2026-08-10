import { Torus } from "@react-three/drei";

import GizmoMaterial from "../shared/GizmoMaterial";

import { GIZMO_COLORS } from "../shared/GizmoConstants";

const HIT_TUBE_RADIUS = 0.12;

const VISUAL_TUBE_RADIUS = 0.022;

export default function RotateRing({
  axis,
  radius,
  color,
  rotation,
  hovered,
  active,
  hidden,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}) {
  if (hidden) {
    return null;
  }

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
    onPointerOut?.(event);
  };

  return (
    <group rotation={rotation}>
      {/* ================================================== */}
      {/* RING HIT AREA                                     */}
      {/* ================================================== */}

      <Torus
        args={[radius, HIT_TUBE_RADIUS, 12, 64]}
        name={`RotateRingHit:${axis}`}
        userData={{
          gizmo: true,
          gizmoAxis: axis,
          gizmoHit: true,
          gizmoType: "rotate-ring",
        }}
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

      {/* ================================================== */}
      {/* VISIBLE RING                                     */}
      {/* ================================================== */}

      <Torus
        args={[radius, VISUAL_TUBE_RADIUS, 12, 64]}
        raycast={() => null}
        userData={{
          gizmo: true,
          gizmoAxis: axis,
          gizmoVisual: true,
        }}
      >
        <primitive object={GizmoMaterial.get(displayColor)} attach="material" />
      </Torus>
    </group>
  );
}
