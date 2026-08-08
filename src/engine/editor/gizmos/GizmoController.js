import useEngineStore from "../../../store/engineStore";

import GizmoState from "./GizmoState";

class GizmoController {
  // ============================================================
  // SELECTION
  // ============================================================

  select(entity) {
    /*
     * Never allow the active transform to switch entities.
     */
    if (
      GizmoState.transforming &&
      GizmoState.entity &&
      entity !== GizmoState.entity
    ) {
      return false;
    }

    GizmoState.entity = entity;

    return true;
  }

  clear() {
    /*
     * Never clear the selected entity in the middle of
     * a transform operation.
     */
    if (GizmoState.transforming) {
      return false;
    }

    GizmoState.entity = null;
    GizmoState.axis = null;
    GizmoState.hoveredAxis = null;
    GizmoState.dragging = false;

    return true;
  }

  getSelectedEntity() {
    return GizmoState.entity;
  }

  // ============================================================
  // MODE
  // ============================================================

  setMode(mode) {
    /*
     * W / E / R are tool selectors.
     *
     * They cannot switch tools while an actual transform
     * is being performed.
     */
    if (GizmoState.transforming) {
      return false;
    }

    GizmoState.mode = mode;
    GizmoState.hoveredAxis = null;

    useEngineStore.getState().setEditor({
      gizmoMode: mode,
    });

    return true;
  }

  getMode() {
    return GizmoState.mode;
  }

  // ============================================================
  // HOVER
  // ============================================================

  setHovered(axis) {
    if (GizmoState.transforming) {
      return;
    }

    GizmoState.hoveredAxis = axis;
  }

  clearHover() {
    if (GizmoState.transforming) {
      return;
    }

    GizmoState.hoveredAxis = null;
  }

  getHoveredAxis() {
    return GizmoState.hoveredAxis;
  }

  // ============================================================
  // TRANSFORM
  // ============================================================

  beginTransform() {
    GizmoState.transforming = true;

    return true;
  }

  endTransform() {
    GizmoState.transforming = false;
    GizmoState.axis = null;
    GizmoState.dragging = false;
    GizmoState.hoveredAxis = null;
  }

  isTransforming() {
    return GizmoState.transforming;
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
