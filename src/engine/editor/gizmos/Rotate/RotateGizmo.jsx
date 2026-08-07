import { useMemo } from "react";

import RotateRing from "./RotateRing";

import { GIZMO_AXIS, GIZMO_COLORS } from "../shared/GizmoConstants";

export default function RotateGizmo({
  entity,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}) {
  const position = useMemo(() => {
    if (!entity?.getObject) {
      return [0, 0, 0];
    }

    return entity.getObject().position.toArray();
  }, [entity]);

  return (
    <group position={position}>
      <RotateRing
        axis={GIZMO_AXIS.X}
        color={GIZMO_COLORS.X}
        rotation={[0, Math.PI / 2, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      <RotateRing
        axis={GIZMO_AXIS.Y}
        color={GIZMO_COLORS.Y}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      <RotateRing
        axis={GIZMO_AXIS.Z}
        color={GIZMO_COLORS.Z}
        rotation={[0, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />
    </group>
  );
}
