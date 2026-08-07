import Transform from "./Transform";

let nextID = 1;

export default class Entity {
  constructor(name = "Entity", type = "Entity") {
    this.id = nextID++;

    this.uuid = crypto.randomUUID();

    this.name = name;
    this.type = type;

    this.enabled = true;
    this.visible = true;

    this.transform = new Transform(this);

    this.parent = null;

    this.children = [];

    this.components = [];

    this.object3D = null;
  }

  // --------------------------------------------------
  // Hierarchy
  // --------------------------------------------------

  add(child) {
    if (!child || child === this) {
      return;
    }

    if (child.parent === this) {
      return;
    }

    if (child.parent) {
      child.parent.remove(child);
    }

    child.parent = this;

    this.children.push(child);

    const parentObject = this.getObject();
    const childObject = child.getObject();

    if (parentObject && childObject) {
      parentObject.add(childObject);
    }

    console.log("[Entity] Child added", {
      parent: this.name,
      child: child.name,
    });
  }

  remove(child) {
    if (!child) {
      return;
    }

    const index = this.children.indexOf(child);

    if (index === -1) {
      return;
    }

    this.children.splice(index, 1);

    const parentObject = this.getObject();
    const childObject = child.getObject();

    if (parentObject && childObject) {
      parentObject.remove(childObject);
    }

    child.parent = null;

    console.log("[Entity] Child removed", {
      parent: this.name,
      child: child.name,
    });
  }

  clear() {
    [...this.children].forEach((child) => {
      this.remove(child);
    });
  }

  // --------------------------------------------------
  // Components
  // --------------------------------------------------

  addComponent(component) {
    if (!component) {
      return;
    }

    component.onAttach(this);

    this.components.push(component);
  }

  removeComponent(type) {
    this.components = this.components.filter((component) => {
      if (component.type !== type) {
        return true;
      }

      component.onDetach?.();

      return false;
    });
  }

  getComponent(type) {
    return this.components.find((component) => component.type === type);
  }

  // --------------------------------------------------
  // Update
  // --------------------------------------------------

  update(delta) {
    if (!this.enabled) {
      return;
    }

    this.components.forEach((component) => {
      if (!component.enabled) {
        return;
      }

      if (!component.started) {
        component.started = true;

        component.start?.();
      }

      component.update?.(delta);
    });
  }

  lateUpdate(delta) {
    if (!this.enabled) {
      return;
    }

    this.components.forEach((component) => {
      if (component.enabled) {
        component.lateUpdate?.(delta);
      }
    });
  }

  fixedUpdate(delta) {
    if (!this.enabled) {
      return;
    }

    this.components.forEach((component) => {
      if (component.enabled) {
        component.fixedUpdate?.(delta);
      }
    });
  }

  // --------------------------------------------------
  // Three.js Object
  // --------------------------------------------------

  setObject(object) {
    this.object3D = object;

    if (object) {
      object.userData.entity = this;
      object.userData.entityId = this.id;
      object.userData.entityUUID = this.uuid;
    }
  }

  getObject() {
    return this.object3D;
  }

  // --------------------------------------------------
  // Transform Sync
  // --------------------------------------------------

  syncTransformToObject() {
    const object = this.getObject();

    if (!object) {
      return;
    }

    object.position.copy(this.transform.position);
    object.rotation.copy(this.transform.rotation);
    object.scale.copy(this.transform.scale);

    object.visible = this.visible;
  }

  syncTransformFromObject() {
    const object = this.getObject();

    if (!object) {
      return;
    }

    this.transform.position.copy(object.position);
    this.transform.rotation.copy(object.rotation);
    this.transform.scale.copy(object.scale);

    this.visible = object.visible;
  }

  // --------------------------------------------------
  // Destroy
  // --------------------------------------------------

  destroy() {
    this.components.forEach((component) => {
      component.enabled = false;

      component.onDetach?.();
      component.destroy?.();
    });

    this.components = [];

    this.clear();

    if (this.object3D) {
      this.object3D.userData.entity = null;
      this.object3D.userData.entityId = null;
      this.object3D.userData.entityUUID = null;
    }

    this.parent = null;
    this.object3D = null;
  }
}
