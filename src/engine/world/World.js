import { SceneGraph, EntityManager } from "../entity";

import {
  SystemManager,
  InputSystem,
  PhysicsSystem,
  RenderSystem,
} from "../systems";

import { TransformSystem } from "../transform";

import useEngineStore from "../../store/engineStore";

import { EventBus, EngineEvents } from "../events";

import SceneService from "../scene/SceneService";

class World {
  constructor() {
    this.sceneGraph = new SceneGraph();

    this.running = false;
    this.paused = false;

    this.time = {
      delta: 0,
      elapsed: 0,
      frame: 0,
    };
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------

  initialize() {
    if (this.running) {
      console.warn("[World] Already initialized");
      return;
    }

    console.log("[World] Initializing...");

    this.running = true;

    SystemManager.add(new InputSystem());
    SystemManager.add(new PhysicsSystem());
    SystemManager.add(new TransformSystem());
    SystemManager.add(new RenderSystem());

    SystemManager.initialize(this);

    console.log("[World] Initialized");
  }

  destroy() {
    console.log("[World] Destroying...");

    EntityManager.getAll().forEach((entity) => {
      this.despawn(entity);
    });

    SystemManager.destroy();

    EntityManager.clear();

    this.sceneGraph.clear();

    useEngineStore.getState().setEntities([]);

    this.running = false;
    this.paused = false;

    console.log("[World] Destroyed");
  }

  // --------------------------------------------------
  // Entity
  // --------------------------------------------------

  spawn(entity) {
    if (!entity) {
      console.error("[World] Cannot spawn null entity");
      return null;
    }

    if (!entity.uuid) {
      console.error("[World] Entity has no UUID:", entity);
      return null;
    }

    if (EntityManager.getByUUID(entity.uuid)) {
      console.warn("[World] Entity already exists:", entity.name);
      return entity;
    }

    console.log("[World] Spawning:", {
      id: entity.id,
      uuid: entity.uuid,
      name: entity.name,
      type: entity.type,
    });

    EntityManager.add(entity);

    if (!entity.parent) {
      this.sceneGraph.add(entity);
    }

    const object = entity.getObject();

    if (object && !entity.parent) {
      SceneService.add(object);
    }

    useEngineStore.getState().addEntity(entity);

    EventBus.emit(EngineEvents.ENTITY_CREATED, entity);

    return entity;
  }

  despawn(entity) {
    if (!entity) {
      return false;
    }

    if (!EntityManager.getByUUID(entity.uuid)) {
      return false;
    }

    console.log("[World] Despawning:", entity.name);

    const object = entity.getObject();

    if (useEngineStore.getState().editor.selectedEntity === entity) {
      useEngineStore.getState().clearSelection();
      EventBus.emit(EngineEvents.ENTITY_DESELECTED);
    }

    if (entity.parent) {
      entity.parent.remove(entity);
    } else if (object) {
      SceneService.remove(object);
    }

    entity.destroy();

    EntityManager.remove(entity);

    this.sceneGraph.remove(entity);

    useEngineStore.getState().removeEntity(entity);

    EventBus.emit(EngineEvents.ENTITY_DESTROYED, entity);

    return true;
  }

  // --------------------------------------------------
  // Compatibility
  // --------------------------------------------------

  add(entity) {
    return this.spawn(entity);
  }

  remove(entity) {
    return this.despawn(entity);
  }

  // --------------------------------------------------
  // Update
  // --------------------------------------------------

  update(delta) {
    if (!this.running || this.paused) {
      return;
    }

    this.time.delta = delta;
    this.time.elapsed += delta;
    this.time.frame++;

    SystemManager.update(delta);

    this.sceneGraph.update(delta);
  }

  lateUpdate(delta) {
    if (!this.running || this.paused) {
      return;
    }

    SystemManager.lateUpdate(delta);

    this.sceneGraph.lateUpdate(delta);
  }

  fixedUpdate(delta) {
    if (!this.running || this.paused) {
      return;
    }

    SystemManager.fixedUpdate(delta);

    this.sceneGraph.fixedUpdate(delta);
  }

  // --------------------------------------------------
  // Controls
  // --------------------------------------------------

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------

  getTime() {
    return this.time;
  }
}

export default new World();
