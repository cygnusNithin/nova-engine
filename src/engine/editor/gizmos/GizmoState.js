import { GIZMO_MODES, GIZMO_SPACE } from "./shared/GizmoConstants";

class GizmoState {
  constructor() {
    this.reset();
  }

  reset() {
    this.mode = GIZMO_MODES.MOVE;

    this.space = GIZMO_SPACE.WORLD;

    this.entity = null;

    this.axis = null;

    this.hoveredAxis = null;

    this.dragging = false;

    this.dragOrigin = null;

    this.dragPlane = null;

    this.pointer = null;
  }
}

export default new GizmoState();
