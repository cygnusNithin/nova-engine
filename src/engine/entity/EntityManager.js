class EntityManager {
  constructor() {
    this.entities = [];
  }

  //--------------------------------------------------
  // CRUD
  //--------------------------------------------------

  add(entity) {
    this.entities.push(entity);
  }

  remove(entity) {
    this.entities = this.entities.filter((e) => e !== entity);
  }

  clear() {
    this.entities = [];
  }

  //--------------------------------------------------
  // Update Loop
  //--------------------------------------------------

  update(delta) {
    this.entities.forEach((entity) => {
      if (!entity.enabled) return;

      entity.update(delta);
    });
  }

  lateUpdate(delta) {
    this.entities.forEach((entity) => {
      if (!entity.enabled) return;

      entity.lateUpdate(delta);
    });
  }

  fixedUpdate(delta) {
    this.entities.forEach((entity) => {
      if (!entity.enabled) return;

      entity.fixedUpdate(delta);
    });
  }

  //--------------------------------------------------
  // Search
  //--------------------------------------------------

  getAll() {
    return [...this.entities];
  }

  count() {
    return this.entities.length;
  }

  getByUUID(uuid) {
    return this.entities.find((entity) => entity.uuid === uuid);
  }

  getById(id) {
    return this.entities.find((entity) => entity.id === id);
  }

  getByName(name) {
    return this.entities.find((entity) => entity.name === name);
  }
}

export default new EntityManager();
