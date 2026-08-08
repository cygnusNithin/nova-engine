import GizmoState from "./GizmoState";

class GizmoController {
  // ============================================================
  // SELECTION
  // ============================================================

  select(entity) {
    GizmoState.entity = entity;
  }

  clear() {
    GizmoState.entity = null;
    GizmoState.axis = null;
    GizmoState.hoveredAxis = null;
    GizmoState.dragging = false;
  }

  getSelectedEntity() {
    return GizmoState.entity;
  }

  // ============================================================
  // MODE
  // ============================================================

  setMode(mode) {
    GizmoState.mode = mode;
  }

  getMode() {
    return GizmoState.mode;
  }

  // ============================================================
  // HOVER
  // ============================================================

  setHovered(axis) {
    if (GizmoState.dragging) {
      return;
    }

    GizmoState.hoveredAxis = axis;
  }

  clearHover() {
    GizmoState.hoveredAxis = null;
  }

  getHoveredAxis() {
    return GizmoState.hoveredAxis;
  }

  // ============================================================
  // STATE
  // ============================================================

  isDragging() {
    return GizmoState.dragging;
  }

  getAxis() {
    return GizmoState.axis;
  }
}

export default new GizmoController();
