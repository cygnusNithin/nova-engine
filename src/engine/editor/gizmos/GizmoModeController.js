import GizmoState from "./GizmoState";
import { GIZMO_MODES } from "./shared/GizmoConstants";

class GizmoModeController {
  // ============================================================
  // GET MODE
  // ============================================================

  getMode() {
    return GizmoState.mode;
  }

  // ============================================================
  // SET MODE
  // ============================================================

  setMode(mode) {
    if (!Object.values(GIZMO_MODES).includes(mode)) {
      console.warn("[GizmoModeController] Invalid gizmo mode:", mode);
      return false;
    }

    if (GizmoState.mode === mode) {
      return true;
    }

    // Never allow a transform drag to survive a mode change.
    GizmoState.dragging = false;
    GizmoState.axis = null;
    GizmoState.dragOrigin = null;
    GizmoState.dragPlane = null;
    GizmoState.pointer = null;
    GizmoState.pointerId = null;
    GizmoState.pointerTarget = null;

    GizmoState.mode = mode;

    console.log("[GizmoModeController] Mode changed:", mode);

    return true;
  }

  // ============================================================
  // SHORTCUT HELPERS
  // ============================================================

  move() {
    return this.setMode(GIZMO_MODES.MOVE);
  }

  rotate() {
    return this.setMode(GIZMO_MODES.ROTATE);
  }

  scale() {
    return this.setMode(GIZMO_MODES.SCALE);
  }

  // ============================================================
  // MODE CHECKS
  // ============================================================

  isMove() {
    return GizmoState.mode === GIZMO_MODES.MOVE;
  }

  isRotate() {
    return GizmoState.mode === GIZMO_MODES.ROTATE;
  }

  isScale() {
    return GizmoState.mode === GIZMO_MODES.SCALE;
  }
}

export default new GizmoModeController();
