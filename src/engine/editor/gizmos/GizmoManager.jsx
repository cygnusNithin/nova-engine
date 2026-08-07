import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

import useEngineStore from "../../../store/engineStore";

import GizmoController from "./GizmoController";
import GizmoHoverController from "./interaction/GizmoHoverController";

import MoveGizmo from "./Move/MoveGizmo";
import RotateGizmo from "./Rotate/RotateGizmo";
import ScaleGizmo from "./Scale/ScaleGizmo";

import GizmoInteraction from "./interaction/GizmoInteraction";
import GizmoDragController from "./interaction/GizmoDragController";
import GizmoDragPlane from "./interaction/GizmoDragPlane";
import GizmoRaycaster from "./interaction/GizmoRaycaster";

export default function GizmoManager() {
  const selectedEntity = useEngineStore((state) => state.editor.selectedEntity);

  const { camera } = useThree();

  // ============================================================
  // SELECTION CHANGE
  // ============================================================

  useEffect(() => {
    console.log("========== GIZMO SELECTION ==========");
    console.log("Selected Entity:", selectedEntity);

    if (!selectedEntity) {
      console.log("No selected entity -> clearing gizmo");

      GizmoController.clear();
      GizmoHoverController.clear();
      return;
    }

    GizmoController.select(selectedEntity);
  }, [selectedEntity]);

  useEffect(() => {
    const handlePointerUp = () => {
      if (GizmoDragController.isDragging()) {
        GizmoDragController.end();
      }
    };

    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  // ============================================================
  // NO ENTITY
  // ============================================================

  if (!selectedEntity) {
    return null;
  }

  // ============================================================
  // POINTER DOWN
  // ============================================================

  const handlePointerDown = (event, axis) => {
    event.stopPropagation();
    event.nativeEvent?.stopPropagation();

    console.log("");
    console.log("========================================");
    console.log("========== GIZMO AXIS CLICK ==========");
    console.log("========================================");

    console.log("Clicked Axis:", axis);
    console.log("Selected Entity:", selectedEntity);

    const object = selectedEntity?.getObject?.();

    console.log("Object:", object);

    if (!object) {
      console.warn("GIZMO ERROR: Selected entity has no object");
      return;
    }

    console.log("Object Position:", object.position);

    // ------------------------------------------------------------
    // Build drag plane
    // ------------------------------------------------------------

    const plane = GizmoDragPlane.build(
      axis,
      object.position,
      camera,
      event.ray.direction,
    );

    console.log("Drag Axis:", axis);
    console.log("Created Drag Plane:", plane);

    if (!plane) {
      console.warn("GIZMO ERROR: Drag plane was not created");
      return;
    }

    // ------------------------------------------------------------
    // Start drag
    // ------------------------------------------------------------

    const startPoint = GizmoRaycaster.intersectPlane(
      camera,
      event.pointer,
      plane,
    );

    if (!startPoint) {
      console.warn("GIZMO ERROR: Pointer did not intersect drag plane");
      return;
    }

    GizmoDragController.begin(
      axis,
      object.position.clone(),
      plane,
      startPoint,
    );

    console.log("========== DRAG STARTED ==========");
    console.log("Axis:", axis);
    console.log("Object Position:", object.position);
    console.log("==================================");
    console.log("");
  };

  // ============================================================
  // POINTER OVER
  // ============================================================

  const handlePointerOver = (event, axis) => {
    event.stopPropagation();

    console.log("========== GIZMO HOVER ==========");
    console.log("Hover Axis:", axis);

    GizmoController.setHovered(axis);
    GizmoHoverController.enter(axis);
  };

  // ============================================================
  // POINTER OUT
  // ============================================================

  const handlePointerOut = (event) => {
    event.stopPropagation();

    console.log("========== GIZMO HOVER OUT ==========");

    GizmoController.setHovered(null);
    GizmoHoverController.leave();
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      {/* Handles drag calculation every frame */}
      <GizmoInteraction />

      {/* MOVE GIZMO */}
      <MoveGizmo
        entity={selectedEntity}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />

      {/* ROTATE - DISABLED FOR NOW */}
      {/*
      <RotateGizmo
        entity={selectedEntity}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
      */}

      {/* SCALE - DISABLED FOR NOW */}
      {/*
      <ScaleGizmo
        entity={selectedEntity}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
      */}
    </>
  );
}
