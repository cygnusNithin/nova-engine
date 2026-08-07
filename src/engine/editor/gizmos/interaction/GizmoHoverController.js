class GizmoHoverController {
  constructor() {
    this.axis = null;
  }

  enter(axis) {
    this.axis = axis;
  }

  leave() {
    this.axis = null;
  }

  getAxis() {
    return this.axis;
  }

  clear() {
    this.axis = null;
  }
}

export default new GizmoHoverController();
