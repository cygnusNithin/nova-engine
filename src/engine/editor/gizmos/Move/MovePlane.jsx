import * as THREE from "three";

import GizmoMaterial from "../shared/GizmoMaterial";

import { GIZMO_COLORS } from "../shared/GizmoConstants";

export default function MovePlane({
  axis,
  color,
  visualSize,
  hitSize,
  visualPosition,
  hitPosition,
  rotation,
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
    <>
      <mesh position={visualPosition} rotation={rotation}>
        <planeGeometry args={[visualSize, visualSize]} />

        <primitive
          object={GizmoMaterial.getTransparent(displayColor)}
          attach="material"
        />
      </mesh>

      <mesh
        name={`MovePlaneHit:${axis}`}
        position={hitPosition}
        rotation={rotation}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[hitSize, hitSize]} />

        <meshBasicMaterial
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}
