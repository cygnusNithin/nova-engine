import { Box, Cylinder } from "@react-three/drei";
import * as THREE from "three";

import GizmoMaterial from "../shared/GizmoMaterial";

import { GIZMO_COLORS } from "../shared/GizmoConstants";

export default function ScaleAxis({
  axis,
  color,
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
    <group rotation={rotation}>
      {/* ====================================================== */}
      {/* LARGE AXIS HIT AREA                                    */}
      {/* ====================================================== */}

      <mesh
        name={`ScaleAxisHit:${axis}`}
        userData={{
          gizmo: true,
          gizmoAxis: axis,
        }}
        position={[0, 0.45, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[0.14, 0.14, 0.95, 10]} />

        <meshBasicMaterial
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ====================================================== */}
      {/* VISIBLE AXIS                                           */}
      {/* ====================================================== */}

      <Cylinder
        args={[0.025, 0.025, 0.9, 8]}
        position={[0, 0.45, 0]}
        userData={{
          gizmo: true,
          gizmoAxis: axis,
        }}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <primitive object={GizmoMaterial.get(displayColor)} attach="material" />
      </Cylinder>

      {/* ====================================================== */}
      {/* LARGE SCALE CUBE HIT AREA                              */}
      {/* ====================================================== */}

      <mesh
        name={`ScaleCubeHit:${axis}`}
        userData={{
          gizmo: true,
          gizmoAxis: axis,
        }}
        position={[0, 0.95, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[0.25, 0.25, 0.25]} />

        <meshBasicMaterial
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ====================================================== */}
      {/* VISIBLE SCALE CUBE                                     */}
      {/* ====================================================== */}

      <Box
        args={[0.12, 0.12, 0.12]}
        position={[0, 0.95, 0]}
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
    </group>
  );
}
