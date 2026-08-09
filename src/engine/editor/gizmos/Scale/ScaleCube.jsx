import { Box } from "@react-three/drei";
import * as THREE from "three";

import GizmoMaterial from "../shared/GizmoMaterial";

import { GIZMO_COLORS } from "../shared/GizmoConstants";

export default function ScaleCube({
  axis,
  color,
  position,
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
      {/* CENTER HIT AREA                                        */}
      {/* ====================================================== */}

      <mesh
        name="ScaleCenterHit"
        userData={{
          gizmo: true,
          gizmoAxis: axis,
        }}
        position={position}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[0.28, 0.28, 0.28]} />

        <meshBasicMaterial
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ====================================================== */}
      {/* VISIBLE CENTER / XYZ HANDLE                            */}
      {/* ====================================================== */}

      <Box
        args={[0.18, 0.18, 0.18]}
        position={position}
        userData={{
          gizmo: true,
          gizmoAxis: axis,
        }}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <primitive object={GizmoMaterial.get(displayColor)} attach="material" />
      </Box>
    </>
  );
}
