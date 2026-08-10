import { Cylinder } from "@react-three/drei";
import * as THREE from "three";

import MoveArrow from "./MoveArrow";
import GizmoMaterial from "../shared/GizmoMaterial";

import { GIZMO_COLORS } from "../shared/GizmoConstants";

export default function MoveAxis({
  axis,
  color,
  rotation,
  arrowPosition,
  highlighted,
  hidden,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}) {
  if (hidden) {
    return null;
  }

  const displayColor = highlighted ? GIZMO_COLORS.HOVER : color;

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
      {/* POINTER HIT AREA — ONLY INTERACTIVE GEOMETRY      */}
      {/* ================================================== */}

      <mesh
        name={`MoveAxisHit:${axis}`}
        userData={{
          gizmo: true,
          gizmoAxis: axis,
          gizmoHit: true,
          gizmoType: "move-axis",
        }}
        position={[0, 0.525, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[0.16, 0.16, 1.1, 12]} />

        <meshBasicMaterial
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ================================================== */}
      {/* VISIBLE AXIS — VISUAL ONLY                        */}
      {/* ================================================== */}

      <Cylinder
        args={[0.018, 0.018, 0.8, 8]}
        position={[0, 0.4, 0]}
        raycast={() => null}
        userData={{
          gizmo: true,
          gizmoAxis: axis,
          gizmoVisual: true,
        }}
      >
        <primitive object={GizmoMaterial.get(displayColor)} attach="material" />
      </Cylinder>

      {/* ================================================== */}
      {/* VISIBLE ARROW — VISUAL ONLY                       */}
      {/* ================================================== */}

      <MoveArrow color={displayColor} position={arrowPosition} axis={axis} />
    </group>
  );
}
