import SceneNode from "./SceneNode";

export default class SceneGraph {
  constructor() {
    this.root = new SceneNode("Root");
  }

  //--------------------------------------------------
  // Entity
  //--------------------------------------------------

  add(entity) {
    if (!entity) return;

    if (entity.parent) return;

    // Do not use root.add().
    //
    // The root is only the SceneGraph container.
    // Top-level entities should not receive the
    // artificial Root entity as their logical parent.
    if (this.root.children.includes(entity)) {
      return;
    }

    this.root.children.push(entity);
  }

  remove(entity) {
    if (!entity) return;

    const index = this.root.children.indexOf(entity);

    if (index === -1) return;

    this.root.children.splice(index, 1);
  }

  clear() {
    this.root.children = [];
  }

  //--------------------------------------------------
  // Traversal
  //--------------------------------------------------

  traverse(callback) {
    const visited = new Set();

    const walk = (node) => {
      if (visited.has(node)) {
        return;
      }

      visited.add(node);

      callback(node);

      node.children.forEach(walk);
    };

    walk(this.root);
  }

  //--------------------------------------------------
  // Lifecycle
  //--------------------------------------------------

  update(delta) {
    this.traverse((entity) => {
      if (entity.update) {
        entity.update(delta);
      }
    });
  }

  lateUpdate(delta) {
    this.traverse((entity) => {
      if (!entity.enabled) return;

      entity.lateUpdate(delta);
    });
  }

  fixedUpdate(delta) {
    this.traverse((entity) => {
      if (!entity.enabled) return;

      entity.fixedUpdate(delta);
    });
  }

  //--------------------------------------------------
  // Search
  //--------------------------------------------------

  findByID(id) {
    let result = null;

    this.traverse((entity) => {
      if (entity.id === id) {
        result = entity;
      }
    });

    return result;
  }

  findByName(name) {
    let result = null;

    this.traverse((entity) => {
      if (entity.name === name) {
        result = entity;
      }
    });

    return result;
  }
}
