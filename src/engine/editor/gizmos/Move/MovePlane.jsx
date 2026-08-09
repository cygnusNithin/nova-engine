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
    <>
      {/* ====================================================== */}
      {/* VISIBLE PLANE                                         */}
      {/* ====================================================== */}

      <mesh
        name={`MovePlane:${axis}`}
        userData={{
          gizmo: true,
          gizmoAxis: axis,
        }}
        position={visualPosition}
        rotation={rotation}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[visualSize, visualSize]} />

        <primitive
          object={GizmoMaterial.getTransparent(displayColor)}
          attach="material"
        />
      </mesh>

      {/* ====================================================== */}
      {/* LARGE PLANE HIT AREA                                   */}
      {/* ====================================================== */}

      <mesh
        name={`MovePlaneHit:${axis}`}
        userData={{
          gizmo: true,
          gizmoAxis: axis,
        }}
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
