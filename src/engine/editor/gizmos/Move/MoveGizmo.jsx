import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import MoveAxis from "./MoveAxis";
import MovePlane from "./MovePlane";

import { GIZMO_COLORS, GIZMO_AXIS } from "../shared/GizmoConstants";

const planeInnerOffset = 0.08;
const visualPlaneSize = 0.32;
const hitPlaneSize = 0.42;

const visualPlaneCenter = planeInnerOffset + visualPlaneSize / 2;

const hitPlaneCenter = planeInnerOffset + hitPlaneSize / 2;

export default function MoveGizmo({
  entity,
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
    <group ref={group} name="MoveGizmo" scale={[2.5, 2.5, 2.5]}>
      {/* X AXIS */}

      <MoveAxis
        axis={GIZMO_AXIS.X}
        color={GIZMO_COLORS.X}
        rotation={[0, 0, -Math.PI / 2]}
        arrowPosition={[0, 0.9, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      {/* Y AXIS */}

      <MoveAxis
        axis={GIZMO_AXIS.Y}
        color={GIZMO_COLORS.Y}
        rotation={[0, 0, 0]}
        arrowPosition={[0, 0.9, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      {/* Z AXIS */}

      <MoveAxis
        axis={GIZMO_AXIS.Z}
        color={GIZMO_COLORS.Z}
        rotation={[Math.PI / 2, 0, 0]}
        arrowPosition={[0, 0.9, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      {/* XY PLANE */}

      <MovePlane
        axis={GIZMO_AXIS.XY}
        color={GIZMO_COLORS.X}
        visualSize={visualPlaneSize}
        hitSize={hitPlaneSize}
        visualPosition={[visualPlaneCenter, visualPlaneCenter, 0]}
        hitPosition={[hitPlaneCenter, hitPlaneCenter, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      {/* XZ PLANE */}

      <MovePlane
        axis={GIZMO_AXIS.XZ}
        color={GIZMO_COLORS.Y}
        rotation={[Math.PI / 2, 0, 0]}
        visualSize={visualPlaneSize}
        hitSize={hitPlaneSize}
        visualPosition={[visualPlaneCenter, 0, visualPlaneCenter]}
        hitPosition={[hitPlaneCenter, 0, hitPlaneCenter]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      {/* YZ PLANE */}

      <MovePlane
        axis={GIZMO_AXIS.YZ}
        color={GIZMO_COLORS.Z}
        rotation={[0, Math.PI / 2, 0]}
        visualSize={visualPlaneSize}
        hitSize={hitPlaneSize}
        visualPosition={[0, visualPlaneCenter, visualPlaneCenter]}
        hitPosition={[0, hitPlaneCenter, hitPlaneCenter]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />
    </group>
  );
}
