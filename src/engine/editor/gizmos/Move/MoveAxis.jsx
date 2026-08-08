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
    onPointerOut?.(event, axis);
  };

  return (
    <group rotation={rotation}>
      {/* ====================================================== */}
      {/* LARGE INTERACTION REGION                              */}
      {/* ====================================================== */}

      <mesh
        name={`MoveAxisHit:${axis}`}
        position={[0, 0.525, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[0.13, 0.13, 1.05, 8]} />

        <meshBasicMaterial
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ====================================================== */}
      {/* VISIBLE AXIS                                          */}
      {/* ====================================================== */}

      <Cylinder args={[0.02, 0.02, 0.8, 8]} position={[0, 0.4, 0]}>
        <primitive object={GizmoMaterial.get(displayColor)} attach="material" />
      </Cylinder>

      {/* ====================================================== */}
      {/* VISIBLE ARROW                                         */}
      {/* ====================================================== */}

      <MoveArrow color={displayColor} position={arrowPosition} axis={axis} />
    </group>
  );
}
