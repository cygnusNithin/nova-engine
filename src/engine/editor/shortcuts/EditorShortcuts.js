import { useEffect } from "react";

import GizmoController from "../gizmos/GizmoController";

import GizmoDragController from "../gizmos/interaction/GizmoDragController";
import GizmoRotateController from "../gizmos/interaction/GizmoRotateController";
import GizmoScaleController from "../gizmos/interaction/GizmoScaleController";

import { GIZMO_MODES } from "../gizmos/shared/GizmoConstants";

function cancelActiveTransform() {
  if (GizmoDragController.isDragging()) {
    GizmoDragController.cancel();
    return true;
  }

  if (GizmoRotateController.isRotating()) {
    GizmoRotateController.cancel();
    return true;
  }

  if (GizmoScaleController.isScaling()) {
    GizmoScaleController.cancel();
    return true;
  }

  return false;
}

export default function EditorShortcuts() {
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

      if (event.code === "Escape") {
        if (GizmoController.isTransforming()) {
          event.preventDefault();
          cancelActiveTransform();
        }

        return;
      }

      // Transform tools own Q / E / R while dragging.
      if (GizmoController.isTransforming()) {
        if (
          event.code === "KeyQ" ||
          event.code === "KeyE" ||
          event.code === "KeyR"
        ) {
          event.preventDefault();
        }

        return;
      }

      if (event.repeat) {
        return;
      }

      // ----------------------------------------------------------
      // MOVE
      // ----------------------------------------------------------

      if (event.code === "KeyQ") {
        event.preventDefault();

        GizmoController.setMode(GIZMO_MODES.MOVE);

        return;
      }

      // ----------------------------------------------------------
      // ROTATE
      // ----------------------------------------------------------

      if (event.code === "KeyE") {
        event.preventDefault();

        GizmoController.setMode(GIZMO_MODES.ROTATE);

        return;
      }

      // ----------------------------------------------------------
      // SCALE
      // ----------------------------------------------------------

      if (event.code === "KeyR") {
        event.preventDefault();

        GizmoController.setMode(GIZMO_MODES.SCALE);

        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
