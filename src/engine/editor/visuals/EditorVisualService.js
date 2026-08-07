import SceneService from "../../scene/SceneService";

class EditorVisualService {
  constructor() {
    this.helpers = new Map();
  }

  //--------------------------------------------------
  // Add
  //--------------------------------------------------

  add(name, helper) {
    this.remove(name);

    this.helpers.set(
      name,

      helper,
    );

    SceneService.add(helper);
  }

  //--------------------------------------------------
  // Remove
  //--------------------------------------------------

  remove(name) {
    const helper = this.helpers.get(name);

    if (!helper) return;

    SceneService.remove(helper);

    if (helper.dispose) helper.dispose();

    this.helpers.delete(name);
  }

  //--------------------------------------------------
  // Get
  //--------------------------------------------------

  get(name) {
    return this.helpers.get(name);
  }

  //--------------------------------------------------
  // Clear
  //--------------------------------------------------

  clear() {
    this.helpers.forEach((helper) => {
      SceneService.remove(helper);

      if (helper.dispose) helper.dispose();
    });

    this.helpers.clear();
  }
}

export default new EditorVisualService();
