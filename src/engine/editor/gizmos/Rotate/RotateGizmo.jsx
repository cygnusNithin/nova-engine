import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import RotateRing from "./RotateRing";

import { GIZMO_AXIS, GIZMO_COLORS } from "../shared/GizmoConstants";

export default function RotateGizmo({
  entity,
  hoveredAxis,
  activeAxis,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}) {
  const group = useRef();

  useFrame(() => {
    if (!group.current || !entity?.transform) {
      return;
    }

    group.current.position.copy(entity.transform.position);
  });

  const isHidden = (axis) => {
    return activeAxis !== null && activeAxis !== axis;
  };

  return (
    <group ref={group} name="RotateGizmo" scale={[2.5, 2.5, 2.5]}>
      <RotateRing
        axis={GIZMO_AXIS.X}
        color={GIZMO_COLORS.X}
        hovered={hoveredAxis === GIZMO_AXIS.X}
        active={activeAxis === GIZMO_AXIS.X}
        hidden={isHidden(GIZMO_AXIS.X)}
        rotation={[0, Math.PI / 2, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      <RotateRing
        axis={GIZMO_AXIS.Y}
        color={GIZMO_COLORS.Y}
        hovered={hoveredAxis === GIZMO_AXIS.Y}
        active={activeAxis === GIZMO_AXIS.Y}
        hidden={isHidden(GIZMO_AXIS.Y)}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      <RotateRing
        axis={GIZMO_AXIS.Z}
        color={GIZMO_COLORS.Z}
        hovered={hoveredAxis === GIZMO_AXIS.Z}
        active={activeAxis === GIZMO_AXIS.Z}
        hidden={isHidden(GIZMO_AXIS.Z)}
        rotation={[0, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />
    </group>
  );
}
