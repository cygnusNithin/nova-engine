import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

import RotateRing from "./RotateRing";

import { GIZMO_AXIS, GIZMO_COLORS } from "../shared/GizmoConstants";

export default function RotateGizmo({
  entity,
  hoveredAxis,
  activeAxis,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}) {
  const group = useRef();

  const [sphereHovered, setSphereHovered] = useState(false);

  useFrame(() => {
    if (!group.current || !entity?.transform) {
      return;
    }

    group.current.position.copy(entity.transform.position);
  });

  const isHidden = (axis) => {
    return activeAxis !== null && activeAxis !== axis;
  };

  const showSphereHover =
    sphereHovered && hoveredAxis === null && activeAxis === null;

  return (
    <group
      ref={group}
      name="RotateGizmo"
      userData={{ gizmo: true }}
      scale={[2.5, 2.5, 2.5]}
    >
      {/* ====================================================== */}
      {/* OUTER SPHERICAL HOVER AREA                             */}
      {/* ====================================================== */}

      <mesh
        name="RotateGizmoHoverSphere"
        userData={{
          gizmo: true,
          gizmoSurface: "rotateSphere",
        }}
        onPointerOver={() => {
          if (activeAxis === null) {
            setSphereHovered(true);
          }
        }}
        onPointerOut={() => {
          setSphereHovered(false);
        }}
      >
        <sphereGeometry args={[1.36, 32, 20]} />

        <meshBasicMaterial
          transparent
          opacity={showSphereHover ? 0.09 : 0}
          color={GIZMO_COLORS.ROTATE_HOVER}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* ====================================================== */}
      {/* X RING                                                  */}
      {/* ====================================================== */}

      <RotateRing
        axis={GIZMO_AXIS.X}
        color={GIZMO_COLORS.X}
        hovered={hoveredAxis === GIZMO_AXIS.X}
        active={activeAxis === GIZMO_AXIS.X}
        hidden={isHidden(GIZMO_AXIS.X)}
        rotation={[0, Math.PI / 2, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      {/* ====================================================== */}
      {/* Y RING                                                  */}
      {/* ====================================================== */}

      <RotateRing
        axis={GIZMO_AXIS.Y}
        color={GIZMO_COLORS.Y}
        hovered={hoveredAxis === GIZMO_AXIS.Y}
        active={activeAxis === GIZMO_AXIS.Y}
        hidden={isHidden(GIZMO_AXIS.Y)}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      {/* ====================================================== */}
      {/* Z RING                                                  */}
      {/* ====================================================== */}

      <RotateRing
        axis={GIZMO_AXIS.Z}
        color={GIZMO_COLORS.Z}
        hovered={hoveredAxis === GIZMO_AXIS.Z}
        active={activeAxis === GIZMO_AXIS.Z}
        hidden={isHidden(GIZMO_AXIS.Z)}
        rotation={[0, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />
    </group>
  );
}
