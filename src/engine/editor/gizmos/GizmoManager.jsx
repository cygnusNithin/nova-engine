import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";

import useEngineStore from "../../../store/engineStore";

import GizmoController from "./GizmoController";
import GizmoModeController from "./GizmoModeController";
import GizmoHoverController from "./interaction/GizmoHoverController";

import GizmoInteraction from "./interaction/GizmoInteraction";
import GizmoDragController from "./interaction/GizmoDragController";
import GizmoDragPlane from "./interaction/GizmoDragPlane";
import GizmoRaycaster from "./interaction/GizmoRaycaster";
import GizmoRotateController from "./interaction/GizmoRotateController";

import MoveGizmo from "./Move/MoveGizmo";
import RotateGizmo from "./Rotate/RotateGizmo";

export default function GizmoManager() {
  const selectedEntity = useEngineStore((state) => state.editor.selectedEntity);

  const { camera } = useThree();

  const [mode, setMode] = useState(() => GizmoModeController.getMode());

  // ============================================================
  // SELECTION CHANGE
  // ============================================================

  useEffect(() => {
    console.log(
      "[GizmoManager] Selection changed:",
      selectedEntity?.name ?? null,
    );

    if (GizmoDragController.isDragging()) {
      GizmoDragController.cancel();
    }

    if (GizmoRotateController.isRotating()) {
      GizmoRotateController.cancel();
    }

    if (!selectedEntity) {
      GizmoController.clear();
      GizmoHoverController.clear();

      return;
    }

    GizmoController.select(selectedEntity);
  }, [selectedEntity]);

  // ============================================================
  // MODE SHORTCUTS
  // ============================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      // --------------------------------------------------------
      // W = MOVE
      // --------------------------------------------------------

      if (key === "w") {
        if (GizmoDragController.isDragging()) {
          GizmoDragController.cancel();
        }

        if (GizmoRotateController.isRotating()) {
          GizmoRotateController.cancel();
        }

        GizmoModeController.move();

        setMode(GizmoModeController.getMode());

        console.log("[GizmoManager] Mode: MOVE");

        return;
      }

      // --------------------------------------------------------
      // E = ROTATE
      // --------------------------------------------------------

      if (key === "e") {
        if (GizmoDragController.isDragging()) {
          GizmoDragController.cancel();
        }

        if (GizmoRotateController.isRotating()) {
          GizmoRotateController.cancel();
        }

        GizmoModeController.rotate();

        setMode(GizmoModeController.getMode());

        console.log("[GizmoManager] Mode: ROTATE");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ============================================================
  // GLOBAL POINTER EVENTS
  // ============================================================

  useEffect(() => {
    const handlePointerUp = (event) => {
      if (GizmoDragController.isDragging()) {
        GizmoDragController.end(event.pointerId);
      }

      if (GizmoRotateController.isRotating()) {
        GizmoRotateController.end();
      }
    };

    const handlePointerCancel = (event) => {
      if (GizmoDragController.isDragging()) {
        GizmoDragController.cancel(event.pointerId);
      }

      if (GizmoRotateController.isRotating()) {
        GizmoRotateController.cancel();
      }
    };

    const handleWindowBlur = () => {
      if (GizmoDragController.isDragging()) {
        GizmoDragController.cancel();
      }

      if (GizmoRotateController.isRotating()) {
        GizmoRotateController.cancel();
      }
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
  // MOVE POINTER DOWN
  // ============================================================

  const handleMovePointerDown = (event, axis) => {
    event.stopPropagation();
    event.nativeEvent?.stopPropagation();

    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    if (
      GizmoDragController.isDragging() ||
      GizmoRotateController.isRotating()
    ) {
      return;
    }

    const object = selectedEntity?.getObject?.();

    if (!object) {
      console.warn("[GizmoManager] Selected entity has no render object");

      return;
    }

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

    const startPoint = GizmoRaycaster.intersectPlane(
      camera,
      event.pointer,
      plane,
    );

    if (!startPoint) {
      console.warn("[GizmoManager] Pointer does not intersect drag plane");

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

    console.log("[GizmoManager] Move drag started", {
      entity: selectedEntity.name,
      axis,
      pointerId,
    });
  };

  // ============================================================
  // ROTATE POINTER DOWN
  // ============================================================

  const handleRotatePointerDown = (event, axis) => {
    event.stopPropagation();
    event.nativeEvent?.stopPropagation();

    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    if (
      GizmoDragController.isDragging() ||
      GizmoRotateController.isRotating()
    ) {
      return;
    }

    const object = selectedEntity?.getObject?.();

    if (!object) {
      console.warn("[GizmoManager] Selected entity has no render object");

      return;
    }

    const center = object.position.clone();

    const rotationPlane = GizmoRotateController.buildRotationPlane(
      axis,
      center,
    );

    if (!rotationPlane) {
      return;
    }

    const startPoint = GizmoRaycaster.intersectPlane(
      camera,
      event.pointer,
      rotationPlane,
    );

    if (!startPoint) {
      console.warn(
        "[GizmoManager] Rotation ring does not intersect rotation plane",
      );

      return;
    }

    const started = GizmoRotateController.begin(
      selectedEntity,
      axis,
      startPoint,
      center,
    );

    if (!started) {
      return;
    }

    console.log("[GizmoManager] Rotate drag started", {
      entity: selectedEntity.name,
      axis,
    });
  };

  // ============================================================
  // POINTER OVER
  // ============================================================

  const handlePointerOver = (event, axis) => {
    event.stopPropagation();

    if (
      GizmoDragController.isDragging() ||
      GizmoRotateController.isRotating()
    ) {
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

    if (
      GizmoDragController.isDragging() ||
      GizmoRotateController.isRotating()
    ) {
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

      {mode === "move" && (
        <MoveGizmo
          entity={selectedEntity}
          onPointerDown={handleMovePointerDown}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      )}

      {mode === "rotate" && (
        <RotateGizmo
          entity={selectedEntity}
          onPointerDown={handleRotatePointerDown}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      )}
    </>
  );
}
