import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import ScaleAxis from "./ScaleAxis";
import ScaleCube from "./ScaleCube";

import { GIZMO_AXIS, GIZMO_COLORS } from "../shared/GizmoConstants";

export default function ScaleGizmo({
  entity,
  isHighlighted,
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

  return (
    <group ref={group} name="ScaleGizmo" scale={[2.5, 2.5, 2.5]}>
      <ScaleAxis
        axis={GIZMO_AXIS.X}
        color={GIZMO_COLORS.X}
        highlighted={isHighlighted(GIZMO_AXIS.X)}
        rotation={[0, 0, -Math.PI / 2]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      <ScaleAxis
        axis={GIZMO_AXIS.Y}
        color={GIZMO_COLORS.Y}
        highlighted={isHighlighted(GIZMO_AXIS.Y)}
        rotation={[0, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      <ScaleAxis
        axis={GIZMO_AXIS.Z}
        color={GIZMO_COLORS.Z}
        highlighted={isHighlighted(GIZMO_AXIS.Z)}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      <ScaleCube
        axis={GIZMO_AXIS.XYZ}
        color={GIZMO_COLORS.CENTER}
        highlighted={isHighlighted(GIZMO_AXIS.XYZ)}
        position={[0, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />
    </group>
  );
}
