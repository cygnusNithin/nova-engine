import { useFrame, useThree } from "@react-three/fiber";

import GizmoRaycaster from "./GizmoRaycaster";
import GizmoDragPlane from "./GizmoDragPlane";
import GizmoDragController from "./GizmoDragController";
import GizmoMoveController from "./GizmoMoveController";
import GizmoRotateController from "./GizmoRotateController";
import GizmoScaleController from "./GizmoScaleController";

import GizmoState from "../GizmoState";

export default function GizmoInteraction() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    /*
     * ============================================================
     * ROTATE
     * ============================================================
     */

    if (GizmoRotateController.isRotating()) {
      const entity = GizmoRotateController.getEntity();

      if (!entity) {
        GizmoRotateController.cancel();
        return;
      }

      const axis = GizmoRotateController.getAxis();
      const plane = GizmoRotateController.getRotationPlane();
      const center = GizmoRotateController.getRotationCenter();

      if (!axis || !plane || !center) {
        return;
      }

      const point = GizmoRaycaster.intersectPlane(camera, pointer, plane);

      if (!point) {
        return;
      }

      GizmoRotateController.update(
        entity,
        axis,
        point,
        GizmoRotateController.getPointerId(),
      );

      return;
    }

    /*
     * ============================================================
     * SCALE
     * ============================================================
     */

    if (GizmoScaleController.isScaling()) {
      const entity = GizmoScaleController.getEntity();

      if (!entity) {
        GizmoScaleController.cancel();
        return;
      }

      const axis = GizmoScaleController.getAxis();

      /*
       * Scale owns the drag plane through GizmoState.
       */
      const plane = GizmoState.dragPlane;

      if (!plane || !axis) {
        return;
      }

      const point = GizmoRaycaster.intersectPlane(camera, pointer, plane);

      if (!point) {
        return;
      }

      GizmoScaleController.update(
        entity,
        axis,
        point,
        GizmoScaleController.getPointerId(),
      );

      return;
    }

    /*
     * ============================================================
     * MOVE
     * ============================================================
     */

    if (!GizmoDragController.isDragging()) {
      return;
    }

    const plane = GizmoDragPlane.get();

    if (!plane) {
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

    GizmoMoveController.move(
      GizmoDragController.getEntity(),
      GizmoDragController.getAxis(),
      delta,
    );
  });

  return null;
}
