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
      const entity = GizmoState.entity;

      if (!entity) {
        GizmoRotateController.cancel(entity);
        return;
      }

      const axis = GizmoState.axis;

      if (!axis) {
        return;
      }

      const origin = GizmoState.rotationOrigin;

      if (!origin) {
        return;
      }

      const rotationPlane = GizmoState.rotationPlane;

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

      GizmoRotateController.update(entity, axis, point, origin);

      return;
    }

    // ============================================================
    // MOVE
    // ============================================================

    if (!GizmoDragController.isDragging()) {
      return;
    }

    // ------------------------------------------------------------
    // Get drag plane
    // ------------------------------------------------------------

    const plane = GizmoDragPlane.get();

    if (!plane) {
      console.warn("[GizmoInteraction] No drag plane");

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

    const delta = GizmoDragController.update(
      point,
      GizmoDragController.getPointerId(),
    );

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
