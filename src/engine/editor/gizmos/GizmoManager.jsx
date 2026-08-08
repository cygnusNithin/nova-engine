import { useEffect, useState } from "react";

import { useThree } from "@react-three/fiber";

import * as THREE from "three";

import useEngineStore from "../../../store/engineStore";

import GizmoController from "./GizmoController";

import GizmoHoverController from "./interaction/GizmoHoverController";

import GizmoDragController from "./interaction/GizmoDragController";

import GizmoDragPlane from "./interaction/GizmoDragPlane";

import GizmoRaycaster from "./interaction/GizmoRaycaster";

import GizmoRotateController from "./interaction/GizmoRotateController";

import GizmoScaleController from "./interaction/GizmoScaleController";

import GizmoInteraction from "./interaction/GizmoInteraction";

import MoveGizmo from "./Move/MoveGizmo";

import RotateGizmo from "./Rotate/RotateGizmo";

import ScaleGizmo from "./Scale/ScaleGizmo";

import { GIZMO_MODES } from "./shared/GizmoConstants";

import GizmoState from "./GizmoState";

export default function GizmoManager() {
  const selectedEntity = useEngineStore((state) => state.editor.selectedEntity);

  const gizmoMode = useEngineStore((state) => state.editor.gizmoMode);

  const { camera } = useThree();

  const [hoveredAxis, setHoveredAxis] = useState(null);

  const [activeAxis, setActiveAxis] = useState(null);

  // ============================================================
  // SELECTION
  // ============================================================

  useEffect(() => {
    if (GizmoController.isTransforming()) {
      return;
    }

    if (!selectedEntity) {
      GizmoController.clear();

      GizmoHoverController.clear();

      return;
    }

    GizmoController.select(selectedEntity);
  }, [selectedEntity]);

  // ============================================================
  // MODE
  // ============================================================

  useEffect(() => {
    if (GizmoController.isTransforming()) {
      return;
    }

    GizmoController.setMode(gizmoMode);
  }, [gizmoMode]);

  // ============================================================
  // END / CANCEL
  // ============================================================

  const endActiveTransform = (pointerId = null) => {
    if (GizmoDragController.isDragging()) {
      GizmoDragController.end(pointerId);
    }

    if (GizmoRotateController.isRotating()) {
      GizmoRotateController.end(pointerId);
    }

    if (GizmoScaleController.isScaling()) {
      GizmoScaleController.end(pointerId);
    }

    setActiveAxis(null);

    setHoveredAxis(null);

    GizmoHoverController.clear();
  };

  const cancelActiveTransform = (pointerId = null) => {
    if (GizmoDragController.isDragging()) {
      GizmoDragController.cancel(pointerId);
    }

    if (GizmoRotateController.isRotating()) {
      GizmoRotateController.cancel(pointerId);
    }

    if (GizmoScaleController.isScaling()) {
      GizmoScaleController.cancel(pointerId);
    }

    setActiveAxis(null);

    setHoveredAxis(null);

    GizmoHoverController.clear();
  };

  // ============================================================
  // GLOBAL POINTER EVENTS
  // ============================================================

  useEffect(() => {
    const handlePointerUp = (event) => {
      if (!GizmoController.isTransforming()) {
        return;
      }

      endActiveTransform(event.pointerId);
    };

    const handlePointerCancel = (event) => {
      if (!GizmoController.isTransforming()) {
        return;
      }

      cancelActiveTransform(event.pointerId);
    };

    const handleWindowBlur = () => {
      if (!GizmoController.isTransforming()) {
        return;
      }

      cancelActiveTransform();
    };

    window.addEventListener("pointerup", handlePointerUp);

    window.addEventListener("pointercancel", handlePointerCancel);

    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);

      window.removeEventListener("pointercancel", handlePointerCancel);

      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  // ============================================================
  // NO SELECTION
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

    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    if (GizmoController.isTransforming()) {
      return;
    }

    const object = selectedEntity?.getObject?.();

    if (!object) {
      return;
    }

    const nativeEvent = event.nativeEvent;

    const pointerId = nativeEvent?.pointerId ?? event.pointerId;

    const pointerTarget = nativeEvent?.target ?? event.target;

    if (
      pointerTarget &&
      typeof pointerTarget.setPointerCapture === "function" &&
      pointerId !== undefined
    ) {
      try {
        pointerTarget.setPointerCapture(pointerId);
      } catch {
        // Pointer capture may already belong elsewhere.
      }
    }

    // ==========================================================
    // MOVE
    // ==========================================================

    if (gizmoMode === GIZMO_MODES.MOVE) {
      const plane = GizmoDragPlane.build(
        axis,
        object.position,
        camera,
        event.ray.direction,
      );

      if (!plane) {
        return;
      }

      const startPoint = GizmoRaycaster.intersectPlane(
        camera,
        event.pointer,
        plane,
      );

      if (!startPoint) {
        return;
      }

      const started = GizmoDragController.begin(
        axis,
        object.position.clone(),
        plane,
        startPoint,
        pointerId,
        pointerTarget,
      );

      if (!started) {
        return;
      }

      setActiveAxis(axis);

      setHoveredAxis(axis);

      return;
    }

    // ==========================================================
    // ROTATE
    // ==========================================================

    if (gizmoMode === GIZMO_MODES.ROTATE) {
      if (axis !== "x" && axis !== "y" && axis !== "z") {
        return;
      }

      const axisVector = new THREE.Vector3();

      if (axis === "x") {
        axisVector.set(1, 0, 0);
      }

      if (axis === "y") {
        axisVector.set(0, 1, 0);
      }

      if (axis === "z") {
        axisVector.set(0, 0, 1);
      }

      const rotationPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
        axisVector,
        object.position,
      );

      const startPoint = GizmoRaycaster.intersectPlane(
        camera,
        event.pointer,
        rotationPlane,
      );

      if (!startPoint) {
        return;
      }

      const started = GizmoRotateController.begin(
        selectedEntity,
        axis,
        startPoint,
        object.position.clone(),
        rotationPlane,
        pointerId,
        pointerTarget,
      );

      if (!started) {
        return;
      }

      setActiveAxis(axis);

      setHoveredAxis(axis);

      return;
    }

    // ==========================================================
    // SCALE
    // ==========================================================

    if (gizmoMode === GIZMO_MODES.SCALE) {
      const plane = GizmoDragPlane.build(
        axis,
        object.position,
        camera,
        event.ray.direction,
      );

      if (!plane) {
        return;
      }

      const startPoint = GizmoRaycaster.intersectPlane(
        camera,
        event.pointer,
        plane,
      );

      if (!startPoint) {
        return;
      }

      const started = GizmoScaleController.begin(
        selectedEntity,
        axis,
        startPoint,
        camera,
        pointerId,
        pointerTarget,
      );

      if (!started) {
        return;
      }

      /*
       * Scale owns the transform.
       *
       * Do NOT start GizmoDragController here.
       * GizmoDragController belongs to Move.
       */
      GizmoState.dragPlane = plane;

      setActiveAxis(axis);
      setHoveredAxis(axis);
    }
  };

  // ============================================================
  // HOVER
  // ============================================================

  const handlePointerOver = (event, axis) => {
    event.stopPropagation();

    if (GizmoController.isTransforming()) {
      return;
    }

    setHoveredAxis(axis);

    GizmoController.setHovered(axis);

    GizmoHoverController.enter(axis);
  };

  // ============================================================
  // HOVER OUT
  // ============================================================

  const handlePointerOut = (event) => {
    event.stopPropagation();

    if (GizmoController.isTransforming()) {
      return;
    }

    setHoveredAxis(null);

    GizmoController.clearHover();

    GizmoHoverController.leave();
  };

  // ============================================================
  // HIGHLIGHT
  // ============================================================

  const isHighlighted = (axis) => {
    return hoveredAxis === axis || activeAxis === axis;
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <GizmoInteraction />

      {gizmoMode === GIZMO_MODES.MOVE && (
        <MoveGizmo
          entity={selectedEntity}
          hoveredAxis={hoveredAxis}
          activeAxis={activeAxis}
          isHighlighted={isHighlighted}
          onPointerDown={handlePointerDown}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      )}

      {gizmoMode === GIZMO_MODES.ROTATE && (
        <RotateGizmo
          entity={selectedEntity}
          hoveredAxis={hoveredAxis}
          activeAxis={activeAxis}
          isHighlighted={isHighlighted}
          onPointerDown={handlePointerDown}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      )}

      {gizmoMode === GIZMO_MODES.SCALE && (
        <ScaleGizmo
          entity={selectedEntity}
          hoveredAxis={hoveredAxis}
          activeAxis={activeAxis}
          isHighlighted={isHighlighted}
          onPointerDown={handlePointerDown}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      )}
    </>
  );
}
