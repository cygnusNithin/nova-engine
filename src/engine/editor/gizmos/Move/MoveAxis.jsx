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
  onPointerDown,
  onPointerOver,
  onPointerOut,
}) {
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
      <mesh
        name={`MoveAxisHit:${axis}`}
        position={[0, 0.525, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[0.1, 0.1, 1.05, 8]} />

        <meshBasicMaterial
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <Cylinder
        args={[0.02, 0.02, 0.8, 8]}
        position={[0, 0.4, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <primitive object={GizmoMaterial.get(displayColor)} attach="material" />
      </Cylinder>

      <MoveArrow
        color={displayColor}
        position={arrowPosition}
        axis={axis}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
    </group>
  );
}
