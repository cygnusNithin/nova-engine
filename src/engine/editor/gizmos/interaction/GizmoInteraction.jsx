import { useFrame, useThree } from "@react-three/fiber";

import GizmoState from "../GizmoState";

import GizmoRaycaster from "./GizmoRaycaster";
import GizmoDragPlane from "./GizmoDragPlane";
import GizmoDragController from "./GizmoDragController";
import GizmoMoveController from "./GizmoMoveController";

export default function GizmoInteraction() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    // ------------------------------------------------------------
    // Not dragging
    // ------------------------------------------------------------

    if (!GizmoDragController.isDragging()) {
      return;
    }

    // ------------------------------------------------------------
    // Get drag plane
    // ------------------------------------------------------------

    const plane = GizmoDragPlane.get();

    if (!plane) {
      console.warn("GIZMO INTERACTION: No drag plane");

      return;
    }

    // ------------------------------------------------------------
    // Ray -> Plane intersection
    // ------------------------------------------------------------

    const point = GizmoRaycaster.intersectPlane(camera, pointer, plane);

    if (!point) {
      return;
    }

    // ------------------------------------------------------------
    // Calculate drag delta
    // ------------------------------------------------------------

    const delta = GizmoDragController.update(point);

    if (!delta) {
      return;
    }

    // ------------------------------------------------------------
    // MOVE
    // ------------------------------------------------------------

    console.log("========== MOVE ==========");
    console.log("Entity:", GizmoState.entity);
    console.log("Axis:", GizmoState.axis);
    console.log("Delta:", delta);

    GizmoMoveController.move(GizmoState.entity, GizmoState.axis, delta);
  });

  return null;
}
