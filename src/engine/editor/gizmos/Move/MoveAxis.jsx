import { Cylinder } from "@react-three/drei";
import * as THREE from "three";

import MoveArrow from "./MoveArrow";
import GizmoMaterial from "../shared/GizmoMaterial";

export default function MoveAxis({
  axis,

  color,

  rotation,

  arrowPosition,

  onPointerDown,

  onPointerOver,

  onPointerOut,
}) {
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
        <primitive object={GizmoMaterial.get(color)} attach="material" />
      </Cylinder>

      <MoveArrow
        color={color}
        position={arrowPosition}
        axis={axis}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
    </group>
  );
}
