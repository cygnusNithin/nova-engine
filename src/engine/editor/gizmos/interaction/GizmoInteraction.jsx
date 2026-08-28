import { useFrame, useThree } from "@react-three/fiber";

import GizmoRaycaster from "./GizmoRaycaster";
import GizmoDragPlane from "./GizmoDragPlane";
import GizmoDragController from "./GizmoDragController";
import GizmoMoveController from "./GizmoMoveController";
import GizmoRotateController from "./GizmoRotateController";
import GizmoScaleController from "./GizmoScaleController";

import GizmoState from "../GizmoState";

const DEBUG_GIZMO_INTERACTION = true;

function logFailedIntersection(type, camera, pointer, plane) {
  if (!DEBUG_GIZMO_INTERACTION) {
    return;
  }

  console.groupCollapsed(
    `[NOVA GIZMO ${type}] Ray / plane intersection failed`,
  );

  console.log("Pointer NDC:", {
    x: Number(pointer.x.toFixed(6)),
    y: Number(pointer.y.toFixed(6)),
  });

  console.log("Camera position:", {
    x: Number(camera.position.x.toFixed(4)),
    y: Number(camera.position.y.toFixed(4)),
    z: Number(camera.position.z.toFixed(4)),
  });

  console.log("Ray:", GizmoRaycaster.getRayData());

  console.log("Plane normal:", {
    x: Number(plane.normal.x.toFixed(6)),
    y: Number(plane.normal.y.toFixed(6)),
    z: Number(plane.normal.z.toFixed(6)),
  });

  console.log(
    "Ray / plane alignment:",
    Number(plane.normal.dot(GizmoRaycaster.getRay().direction).toFixed(6)),
  );

  console.groupEnd();
}

export default function GizmoInteraction() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    /*
     * Make absolutely sure every gizmo operation starts from the
     * latest camera transform.
     */
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);

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
        logFailedIntersection("ROTATE", camera, pointer, plane);

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

      const plane = GizmoState.dragPlane;

      if (!plane || !axis) {
        return;
      }

      const point = GizmoRaycaster.intersectPlane(camera, pointer, plane);

      if (!point) {
        logFailedIntersection("SCALE", camera, pointer, plane);

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
      logFailedIntersection("MOVE", camera, pointer, plane);

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
