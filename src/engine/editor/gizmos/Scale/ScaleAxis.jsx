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
      {/* ================================================== */}
      {/* AXIS HIT AREA                                     */}
      {/* ================================================== */}

      <mesh
        name={`ScaleAxisHit:${axis}`}
        userData={{
          gizmo: true,
          gizmoAxis: axis,
          gizmoHit: true,
          gizmoType: "scale-axis",
        }}
        position={[0, 0.45, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[0.16, 0.16, 0.95, 12]} />

        <meshBasicMaterial
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ================================================== */}
      {/* VISIBLE AXIS                                      */}
      {/* ================================================== */}

      <Cylinder
        args={[0.022, 0.022, 0.9, 8]}
        position={[0, 0.45, 0]}
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
      {/* SCALE CUBE HIT                                    */}
      {/* ================================================== */}

      <mesh
        name={`ScaleCubeHit:${axis}`}
        userData={{
          gizmo: true,
          gizmoAxis: axis,
          gizmoHit: true,
          gizmoType: "scale-cube",
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

      {/* ================================================== */}
      {/* VISIBLE SCALE CUBE                                */}
      {/* ================================================== */}

      <Box
        args={[0.1, 0.1, 0.1]}
        position={[0, 0.95, 0]}
        raycast={() => null}
        userData={{
          gizmo: true,
          gizmoAxis: axis,
          gizmoVisual: true,
        }}
      >
        <primitive object={GizmoMaterial.get(displayColor)} attach="material" />
      </Box>
    </group>
  );
}
