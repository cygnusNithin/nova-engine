import { useFrame, useThree } from "@react-three/fiber";

import { useRef, useState } from "react";

import * as THREE from "three";

import RotateRing from "./RotateRing";

import { GIZMO_AXIS, GIZMO_COLORS } from "../shared/GizmoConstants";

const GIZMO_SCALE = 1.6;

/*
 * Shared rotation-ring radius.
 *
 * This value is now actually passed to RotateRing.
 */
const RING_RADIUS = 1.0;

/*
 * Slightly larger than the visible ring.
 *
 * This is only the hover/selection sphere.
 */
const HOVER_SPHERE_RADIUS = 1.12;

export default function RotateGizmo({
  entity,
  hoveredAxis,
  activeAxis,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}) {
  const group = useRef();

  const { camera, pointer } = useThree();

  const [sphereHovered, setSphereHovered] = useState(false);

  const sphere = useRef(
    new THREE.Sphere(new THREE.Vector3(), HOVER_SPHERE_RADIUS),
  );

  const hitPoint = useRef(new THREE.Vector3());

  const raycaster = useRef(new THREE.Raycaster());

  useFrame(() => {
    if (!group.current || !entity?.transform) {
      return;
    }

    group.current.position.copy(entity.transform.position);

    /*
     * Do not perform sphere hover checks while a ring is locked.
     */
    if (activeAxis !== null) {
      if (sphereHovered) {
        setSphereHovered(false);
      }

      return;
    }

    sphere.current.center.copy(entity.transform.position);

    sphere.current.radius = HOVER_SPHERE_RADIUS * GIZMO_SCALE;

    /*
     * Use the ACTUAL R3F pointer.
     *
     * Do not use camera.userData.__gizmoPointer.
     */
    raycaster.current.setFromCamera(pointer, camera);

    const hit = raycaster.current.ray.intersectSphere(
      sphere.current,
      hitPoint.current,
    );

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
      {/* OUTER HOVER SPHERE                                */}
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
      {/* X RING                                            */}
      {/* ================================================== */}

      <RotateRing
        axis={GIZMO_AXIS.X}
        radius={RING_RADIUS}
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
      {/* Y RING                                            */}
      {/* ================================================== */}

      <RotateRing
        axis={GIZMO_AXIS.Y}
        radius={RING_RADIUS}
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
      {/* Z RING                                            */}
      {/* ================================================== */}

      <RotateRing
        axis={GIZMO_AXIS.Z}
        radius={RING_RADIUS}
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
