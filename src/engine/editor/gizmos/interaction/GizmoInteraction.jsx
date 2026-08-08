import { useFrame, useThree } from "@react-three/fiber";

import GizmoState from "../GizmoState";

import GizmoRaycaster from "./GizmoRaycaster";
import GizmoDragPlane from "./GizmoDragPlane";
import GizmoDragController from "./GizmoDragController";
import GizmoMoveController from "./GizmoMoveController";
import GizmoRotateController from "./GizmoRotateController";

export default function GizmoInteraction() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    // ============================================================
    // ROTATION
    // ============================================================

    if (GizmoRotateController.isRotating()) {
      const entity = GizmoRotateController.getEntity();

      if (!entity) {
        GizmoRotateController.cancel();
        return;
      }

      const axis = GizmoRotateController.getAxis();

      if (!axis) {
        return;
      }

      const rotationPlane = GizmoRotateController.getRotationPlane();

      if (!rotationPlane) {
        return;
      }

      const point = GizmoRaycaster.intersectPlane(
        camera,
        pointer,
        rotationPlane,
      );

      if (!point) {
        return;
      }

      GizmoRotateController.update(entity, axis, point);

      return;
    }

    // ============================================================
    // MOVE
    // ============================================================

    if (!GizmoDragController.isDragging()) {
      return;
    }

    const plane = GizmoDragPlane.get();

    if (!plane) {
      console.warn("[GizmoInteraction] No drag plane");
      return;
    }

    const point = GizmoRaycaster.intersectPlane(camera, pointer, plane);

    if (!point) {
      return;
    }

    const delta = GizmoDragController.update(
      point,
      GizmoDragController.getPointerId(),
    );

    if (!delta) {
      return;
    }

    GizmoMoveController.move(GizmoState.entity, GizmoState.axis, delta);
  });

  return null;
}
