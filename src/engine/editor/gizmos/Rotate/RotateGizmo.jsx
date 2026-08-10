import { useFrame, useThree } from "@react-three/fiber";

import { useRef, useState } from "react";

import * as THREE from "three";

import RotateRing from "./RotateRing";

import { GIZMO_AXIS, GIZMO_COLORS } from "../shared/GizmoConstants";

const GIZMO_SCALE = 2;

const RING_RADIUS = 1.2;

const HOVER_SPHERE_RADIUS = 1.28;

export default function RotateGizmo({
  entity,
  hoveredAxis,
  activeAxis,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}) {
  const group = useRef();

  const { camera } = useThree();

  const [sphereHovered, setSphereHovered] = useState(false);

  const sphere = useRef(
    new THREE.Sphere(new THREE.Vector3(), HOVER_SPHERE_RADIUS * GIZMO_SCALE),
  );

  const hitPoint = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!group.current || !entity?.transform) {
      return;
    }

    group.current.position.copy(entity.transform.position);

    if (activeAxis !== null) {
      if (sphereHovered) {
        setSphereHovered(false);
      }

      return;
    }

    sphere.current.center.copy(entity.transform.position);

    sphere.current.radius = HOVER_SPHERE_RADIUS * GIZMO_SCALE;

    const ray = camera.getWorldPosition(new THREE.Vector3());

    void ray;

    const raycaster = new THREE.Raycaster();

    raycaster.setFromCamera(
      camera.userData?.__gizmoPointer ?? {
        x: 999,
        y: 999,
      },
      camera,
    );

    const hit = raycaster.ray.intersectSphere(sphere.current, hitPoint.current);

    const nextHovered = Boolean(hit);

    if (nextHovered !== sphereHovered) {
      setSphereHovered(nextHovered);
    }
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
      userData={{
        gizmo: true,
        gizmoMode: "rotate",
      }}
      scale={[GIZMO_SCALE, GIZMO_SCALE, GIZMO_SCALE]}
    >
      {/* ================================================== */}
      {/* HOVER SPHERE — VISUAL ONLY                        */}
      {/* ================================================== */}

      <mesh
        name="RotateGizmoHoverSphere"
        raycast={() => null}
        userData={{
          gizmo: true,
          gizmoSurface: "rotateSphere",
          gizmoVisual: true,
        }}
      >
        <sphereGeometry args={[HOVER_SPHERE_RADIUS, 24, 16]} />

        <meshBasicMaterial
          transparent
          opacity={showSphereHover ? 0.08 : 0}
          color={GIZMO_COLORS.ROTATE_HOVER}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* ================================================== */}
      {/* X RING                                             */}
      {/* ================================================== */}

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

      {/* ================================================== */}
      {/* Y RING                                             */}
      {/* ================================================== */}

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

      {/* ================================================== */}
      {/* Z RING                                             */}
      {/* ================================================== */}

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
