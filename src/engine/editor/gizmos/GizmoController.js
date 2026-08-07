import GizmoState from "./GizmoState";

class GizmoController {
  select(entity) {
    console.log("========== GIZMO CONTROLLER SELECT ==========");
    console.log("Entity:", entity);

    GizmoState.entity = entity;

    console.log("GizmoState.entity:", GizmoState.entity);
  }

  clear() {
    console.log("========== GIZMO CONTROLLER CLEAR ==========");

    GizmoState.entity = null;
    GizmoState.axis = null;
    GizmoState.hoveredAxis = null;
    GizmoState.dragging = false;
  }

  getSelectedEntity() {
    return GizmoState.entity;
  }

  beginDrag(axis) {
    console.log("========== GIZMO CONTROLLER BEGIN DRAG ==========");
    console.log("Axis:", axis);

    GizmoState.axis = axis;
    GizmoState.dragging = true;
  }

  updateDrag(pointer) {
    if (!GizmoState.dragging) {
      return;
    }

    GizmoState.pointer = pointer;
  }

  endDrag() {
    console.log("========== GIZMO CONTROLLER END DRAG ==========");

    GizmoState.dragging = false;
    GizmoState.axis = null;
  }

  setMode(mode) {
    console.log("========== GIZMO MODE ==========");
    console.log("Mode:", mode);

    GizmoState.mode = mode;
  }

  setHovered(axis) {
    console.log("========== GIZMO HOVER STATE ==========");
    console.log("Axis:", axis);

    GizmoState.hoveredAxis = axis;
  }
}

export default new GizmoController();
