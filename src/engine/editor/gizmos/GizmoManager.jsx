import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

import useEngineStore from "../../../store/engineStore";

import GizmoController from "./GizmoController";
import GizmoHoverController from "./interaction/GizmoHoverController";

import MoveGizmo from "./Move/MoveGizmo";

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
    console.log(
      "[GizmoManager] Selection changed:",
      selectedEntity?.name ?? null,
    );

    // Never allow a drag to survive a selection change.
    if (GizmoDragController.isDragging()) {
      GizmoDragController.cancel();
    }

    if (!selectedEntity) {
      GizmoController.clear();
      GizmoHoverController.clear();

      return;
    }

    GizmoController.select(selectedEntity);
  }, [selectedEntity]);

  // ============================================================
  // GLOBAL POINTER / WINDOW EVENTS
  // ============================================================

  useEffect(() => {
    const handlePointerUp = (event) => {
      if (!GizmoDragController.isDragging()) {
        return;
      }

      GizmoDragController.end(event.pointerId);
    };

    const handlePointerCancel = (event) => {
      if (!GizmoDragController.isDragging()) {
        return;
      }

      GizmoDragController.cancel(event.pointerId);
    };

    // If the browser/window loses focus during a drag,
    // cancel instead of leaving the gizmo in a stuck state.
    const handleWindowBlur = () => {
      if (!GizmoDragController.isDragging()) {
        return;
      }

      console.warn("[GizmoManager] Window lost focus -> cancelling gizmo drag");

      GizmoDragController.cancel();
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

    // ----------------------------------------------------------
    // Only primary mouse button can start a transform.
    //
    // Prevent:
    // 0 = left click   -> allowed
    // 1 = middle click -> ignored
    // 2 = right click  -> ignored
    // ----------------------------------------------------------

    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    if (GizmoDragController.isDragging()) {
      return;
    }

    const object = selectedEntity?.getObject?.();

    if (!object) {
      console.warn("[GizmoManager] Selected entity has no render object");

      return;
    }

    // ----------------------------------------------------------
    // Pointer capture
    // ----------------------------------------------------------

    const nativeEvent = event.nativeEvent;

    const pointerId = nativeEvent?.pointerId ?? event.pointerId;

    const pointerTarget = event.target;

    if (
      pointerTarget &&
      typeof pointerTarget.setPointerCapture === "function" &&
      pointerId !== undefined
    ) {
      try {
        pointerTarget.setPointerCapture(pointerId);
      } catch (error) {
        console.warn("[GizmoManager] Failed to capture pointer", error);
      }
    }

    // ----------------------------------------------------------
    // Build drag plane
    // ----------------------------------------------------------

    const plane = GizmoDragPlane.build(
      axis,
      object.position,
      camera,
      event.ray.direction,
    );

    if (!plane) {
      console.warn("[GizmoManager] Failed to create drag plane");

      return;
    }

    // ----------------------------------------------------------
    // Calculate starting intersection
    // ----------------------------------------------------------

    const startPoint = GizmoRaycaster.intersectPlane(
      camera,
      event.pointer,
      plane,
    );

    if (!startPoint) {
      console.warn("[GizmoManager] Pointer does not intersect drag plane");

      return;
    }

    // ----------------------------------------------------------
    // Begin drag
    // ----------------------------------------------------------

    const started = GizmoDragController.begin(
      axis,
      object.position.clone(),
      plane,
      startPoint,
      pointerId,
      pointerTarget,
    );

    if (!started) {
      // If drag initialization fails,
      // release pointer capture.
      try {
        if (
          pointerTarget &&
          typeof pointerTarget.releasePointerCapture === "function" &&
          pointerId !== undefined
        ) {
          pointerTarget.releasePointerCapture(pointerId);
        }
      } catch {
        // Ignore pointer-release errors.
      }

      return;
    }

    console.log("[GizmoManager] Drag started", {
      entity: selectedEntity.name,
      axis,
      pointerId,
    });
  };

  // ============================================================
  // POINTER OVER
  // ============================================================

  const handlePointerOver = (event, axis) => {
    event.stopPropagation();

    // Do not modify hover state while dragging.
    if (GizmoDragController.isDragging()) {
      return;
    }

    GizmoController.setHovered(axis);
    GizmoHoverController.enter(axis);
  };

  // ============================================================
  // POINTER OUT
  // ============================================================

  const handlePointerOut = (event) => {
    event.stopPropagation();

    if (GizmoDragController.isDragging()) {
      return;
    }

    GizmoController.setHovered(null);
    GizmoHoverController.leave();
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <GizmoInteraction />

      <MoveGizmo
        entity={selectedEntity}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
    </>
  );
}
