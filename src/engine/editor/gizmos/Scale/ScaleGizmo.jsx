import { useMemo } from "react";

import ScaleAxis from "./ScaleAxis";

import { GIZMO_AXIS, GIZMO_COLORS } from "../shared/GizmoConstants";
import ScaleCube from "./ScaleCube";

export default function ScaleGizmo({
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
      <ScaleAxis
        axis={GIZMO_AXIS.X}
        color={GIZMO_COLORS.X}
        rotation={[0, 0, -Math.PI / 2]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      <ScaleAxis
        axis={GIZMO_AXIS.Y}
        color={GIZMO_COLORS.Y}
        rotation={[0, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      <ScaleAxis
        axis={GIZMO_AXIS.Z}
        color={GIZMO_COLORS.Z}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      <ScaleCube
        axis={GIZMO_AXIS.XYZ}
        color={GIZMO_COLORS.CENTER}
        position={[0, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />
    </group>
  );
}
