import { useCallback, useEffect, useState } from "react";

import { useFrame, useThree } from "@react-three/fiber";

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
import GizmoDebug from "./interaction/GizmoDebug";

export default function GizmoManager() {
  const selectedEntity = useEngineStore((state) => state.editor.selectedEntity);

  const gizmoMode = useEngineStore((state) => state.editor.gizmoMode);

  const { camera, pointer } = useThree();

  const [hoveredAxis, setHoveredAxis] = useState(null);

  const [activeAxis, setActiveAxis] = useState(null);

  /*
   * ============================================================
   * CAMERA DIAGNOSTICS
   * ============================================================
   */

  useFrame(() => {
    GizmoDebug.observeCamera(
      camera,
      gizmoMode,
      GizmoController.isTransforming(),
      pointer,
      selectedEntity,
    );
  });

  /*
   * ============================================================
   * MODE DIAGNOSTICS
   * ============================================================
   */

  useEffect(() => {
    GizmoDebug.modeChanged(gizmoMode);
  }, [gizmoMode]);

  /*
   * ============================================================
   * SELECTION
   * ============================================================
   */

  useEffect(() => {
    /*
     * Do not allow selection changes while a gizmo operation
     * is active.
     */

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

  /*
   * ============================================================
   * MODE
   * ============================================================
   */

  useEffect(() => {
    if (GizmoController.isTransforming()) {
      return;
    }

    GizmoController.setMode(gizmoMode);
  }, [gizmoMode]);

  /*
   * ============================================================
   * POINTER CAPTURE
   * ============================================================
   */

  const capturePointer = (pointerTarget, pointerId) => {
    if (!pointerTarget || pointerId === null || pointerId === undefined) {
      return;
    }

    if (typeof pointerTarget.setPointerCapture !== "function") {
      return;
    }

    try {
      pointerTarget.setPointerCapture(pointerId);
    } catch {
      /*
       * Pointer capture may already belong to another target.
       */
    }
  };

  /*
   * ============================================================
   * END TRANSFORM
   * ============================================================
   */

  const endActiveTransform = useCallback(
    (pointerId = null) => {
      const mode = gizmoMode;
      const axis = GizmoState.axis;

      /*
       * MOVE
       */

      if (GizmoDragController.isDragging()) {
        GizmoDragController.end(pointerId);

        GizmoDebug.transformEnd(mode, axis);
      }

      /*
       * ROTATE
       */

      if (GizmoRotateController.isRotating()) {
        GizmoRotateController.end(pointerId);

        GizmoDebug.transformEnd(mode, axis);
      }

      /*
       * SCALE
       */

      if (GizmoScaleController.isScaling()) {
        GizmoScaleController.end(pointerId);

        GizmoDebug.transformEnd(mode, axis);
      }

      /*
       * Clear React state.
       */

      setActiveAxis(null);
      setHoveredAxis(null);

      /*
       * Clear shared gizmo state.
       */

      GizmoState.transforming = false;
      GizmoState.axis = null;
      GizmoState.hoveredAxis = null;

      GizmoHoverController.clear();
    },
    [gizmoMode],
  );

  /*
   * ============================================================
   * CANCEL TRANSFORM
   * ============================================================
   */

  const cancelActiveTransform = useCallback(
    (pointerId = null) => {
      const mode = gizmoMode;
      const axis = GizmoState.axis;

      /*
       * MOVE
       */

      if (GizmoDragController.isDragging()) {
        GizmoDragController.cancel(pointerId);

        GizmoDebug.transformCancel(mode, axis);
      }

      /*
       * ROTATE
       */

      if (GizmoRotateController.isRotating()) {
        GizmoRotateController.cancel(pointerId);

        GizmoDebug.transformCancel(mode, axis);
      }

      /*
       * SCALE
       */

      if (GizmoScaleController.isScaling()) {
        GizmoScaleController.cancel(pointerId);

        GizmoDebug.transformCancel(mode, axis);
      }

      /*
       * Clear React state.
       */

      setActiveAxis(null);
      setHoveredAxis(null);

      /*
       * Clear shared gizmo state.
       */

      GizmoState.transforming = false;
      GizmoState.axis = null;
      GizmoState.hoveredAxis = null;

      GizmoHoverController.clear();
    },
    [gizmoMode],
  );

  /*
   * ============================================================
   * GLOBAL POINTER EVENTS
   * ============================================================
   *
   * IMPORTANT:
   * These functions are now useCallback functions, so the effect
   * can safely depend on them.
   */

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
  }, [gizmoMode, endActiveTransform, cancelActiveTransform]);

  /*
   * ============================================================
   * POINTER DOWN
   * ============================================================
   */

  const handlePointerDown = (event, axis) => {
    /*
     * FIRST:
     * Stop the gizmo pointer event from reaching the scene/entity
     * selection system.
     *
     * This is important for the Ground-selection problem.
     */

    event.stopPropagation();

    event.nativeEvent?.stopPropagation();

    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    /*
     * Do not allow a second gizmo operation to begin while one
     * is already active.
     */

    if (GizmoController.isTransforming()) {
      GizmoDebug.pointerBlocked?.({
        mode: gizmoMode,
        axis,
        reason: "already-transforming",
      });

      return;
    }

    const object = selectedEntity?.getObject?.();

    if (!object) {
      GizmoDebug.pointerBlocked?.({
        mode: gizmoMode,
        axis,
        reason: "selected-object-missing",
      });

      return;
    }

    const nativeEvent = event.nativeEvent;

    const pointerId = nativeEvent?.pointerId ?? event.pointerId ?? null;

    const pointerTarget = nativeEvent?.target ?? event.target ?? null;

    /*
     * The DOM event may have arrived while the editor camera was moving.
     * Rebuild the ray from the camera's current world matrix before choosing
     * a drag plane. This keeps move and scale plane selection aligned with
     * the same camera pose that R3F uses for the handle hit test.
     */
    camera.updateMatrixWorld(true);

    const currentRay = GizmoRaycaster.update(camera, event.pointer);

    const pointerRayDirection = currentRay?.direction ?? event.ray?.direction;

    GizmoDebug.pointerDown?.({
      mode: gizmoMode,
      axis,
      event,
      selectedEntity,
      object,
      pointerId,
      pointerTarget,
      camera,
      ray: currentRay,
    });

    /*
     * ==========================================================
     * MOVE
     * ==========================================================
     */

    if (gizmoMode === GIZMO_MODES.MOVE) {
      const plane = GizmoDragPlane.build(
        axis,
        object.position,
        camera,
        pointerRayDirection,
      );

      if (!plane) {
        GizmoDebug.transformRejected?.({
          mode: "move",
          axis,
          reason: "drag-plane-build-failed",
        });

        return;
      }

      const startPoint = GizmoRaycaster.intersectPlane(
        camera,
        event.pointer,
        plane,
      );

      if (!startPoint) {
        GizmoDebug.transformRejected?.({
          mode: "move",
          axis,
          reason: "start-plane-intersection-failed",
        });

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
        GizmoDebug.transformRejected?.({
          mode: "move",
          axis,
          reason: "move-controller-rejected",
        });

        return;
      }

      capturePointer(pointerTarget, pointerId);

      setActiveAxis(axis);
      setHoveredAxis(axis);

      GizmoState.transforming = true;
      GizmoState.axis = axis;

      GizmoDebug.transformStart({
        mode: "move",
        axis,
        entity: selectedEntity,
        pointerId,
      });

      return;
    }

    /*
     * ==========================================================
     * ROTATE
     * ==========================================================
     */

    if (gizmoMode === GIZMO_MODES.ROTATE) {
      if (axis !== "x" && axis !== "y" && axis !== "z") {
        GizmoDebug.transformRejected?.({
          mode: "rotate",
          axis,
          reason: "invalid-rotation-axis",
        });

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
        GizmoDebug.transformRejected?.({
          mode: "rotate",
          axis,
          reason: "rotation-plane-intersection-failed",
        });

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
        GizmoDebug.transformRejected?.({
          mode: "rotate",
          axis,
          reason: "rotate-controller-rejected",
        });

        return;
      }

      capturePointer(pointerTarget, pointerId);

      setActiveAxis(axis);
      setHoveredAxis(axis);

      GizmoState.transforming = true;
      GizmoState.axis = axis;

      GizmoDebug.transformStart({
        mode: "rotate",
        axis,
        entity: selectedEntity,
        pointerId,
      });

      return;
    }

    /*
     * ==========================================================
     * SCALE
     * ==========================================================
     */

    if (gizmoMode === GIZMO_MODES.SCALE) {
      const plane = GizmoDragPlane.build(
        axis,
        object.position,
        camera,
        pointerRayDirection,
      );

      if (!plane) {
        GizmoDebug.transformRejected?.({
          mode: "scale",
          axis,
          reason: "scale-drag-plane-build-failed",
        });

        return;
      }

      const startPoint = GizmoRaycaster.intersectPlane(
        camera,
        event.pointer,
        plane,
      );

      if (!startPoint) {
        GizmoDebug.transformRejected?.({
          mode: "scale",
          axis,
          reason: "scale-start-plane-intersection-failed",
        });

        return;
      }

      const started = GizmoScaleController.begin(
        selectedEntity,
        axis,
        startPoint,
        camera,
        plane,
        pointerId,
        pointerTarget,
      );

      if (!started) {
        GizmoDebug.transformRejected?.({
          mode: "scale",
          axis,
          reason: "scale-controller-rejected",
        });

        return;
      }

      capturePointer(pointerTarget, pointerId);

      setActiveAxis(axis);
      setHoveredAxis(axis);

      GizmoState.transforming = true;
      GizmoState.axis = axis;

      GizmoDebug.transformStart({
        mode: "scale",
        axis,
        entity: selectedEntity,
        pointerId,
      });
    }
  };

  /*
   * ============================================================
   * HOVER
   * ============================================================
   */

  const handlePointerOver = (event, axis) => {
    event.stopPropagation();

    event.nativeEvent?.stopPropagation();

    if (GizmoController.isTransforming()) {
      return;
    }

    setHoveredAxis(axis);

    GizmoState.hoveredAxis = axis;

    GizmoController.setHovered(axis);

    GizmoHoverController.enter(axis);

    GizmoDebug.hover({
      mode: gizmoMode,
      axis,

      source:
        event.object?.userData?.gizmoType ?? event.object?.name ?? "unknown",

      event,
      selectedEntity,
      camera,
    });
  };

  /*
   * ============================================================
   * HOVER OUT
   * ============================================================
   */

  const handlePointerOut = (event) => {
    event.stopPropagation();

    event.nativeEvent?.stopPropagation();

    if (GizmoController.isTransforming()) {
      return;
    }

    setHoveredAxis(null);

    GizmoState.hoveredAxis = null;

    GizmoController.clearHover();

    GizmoHoverController.leave();

    GizmoDebug.hoverClear();
  };

  /*
   * ============================================================
   * HIGHLIGHT
   * ============================================================
   */

  const isHighlighted = (axis) => {
    return hoveredAxis === axis || activeAxis === axis;
  };

  if (!selectedEntity) {
    return null;
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      <GizmoInteraction />

      {gizmoMode === GIZMO_MODES.MOVE && (
        <MoveGizmo
          entity={selectedEntity}
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
