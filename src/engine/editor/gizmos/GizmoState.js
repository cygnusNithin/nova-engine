import { GIZMO_MODES, GIZMO_SPACE } from "./shared/GizmoConstants";

class GizmoState {
  constructor() {
    this.reset();
  }

  reset() {
    // ============================================================
    // GIZMO
    // ============================================================

    this.mode = GIZMO_MODES.MOVE;

    this.space = GIZMO_SPACE.WORLD;

    // ============================================================
    // SELECTION
    // ============================================================

    this.entity = null;

    // ============================================================
    // HOVER
    // ============================================================

    this.hoveredAxis = null;

    // ============================================================
    // TRANSFORM OWNERSHIP
    // ============================================================

    /*
     * True while Move / Rotate / Scale owns the pointer.
     *
     * This is different from "hover".
     *
     * While transforming:
     *
     * - selection is locked
     * - W/E/R cannot change the tool
     * - scene raycasting is blocked
     * - camera transform input is blocked
     */
    this.transforming = false;

    // ============================================================
    // DRAG
    // ============================================================

    this.dragging = false;

    this.axis = null;

    this.dragOrigin = null;

    this.dragPlane = null;

    this.pointer = null;

    // ============================================================
    // POINTER OWNERSHIP
    // ============================================================

    this.pointerId = null;

    this.pointerTarget = null;
  }
}

export default new GizmoState();
