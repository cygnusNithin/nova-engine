import * as THREE from "three";

import GizmoMaterial from "../shared/GizmoMaterial";

export default function MovePlane({
  axis,
  color,
  visualSize,
  hitSize,
  visualPosition,
  hitPosition,
  rotation,
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
    <>
      <mesh position={visualPosition} rotation={rotation}>
        <planeGeometry args={[visualSize, visualSize]} />
        <primitive
          object={GizmoMaterial.getTransparent(color)}
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
