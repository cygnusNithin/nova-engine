import * as THREE from "three";

import { EventBus, EngineEvents } from "../events";

export default class Transform {
  constructor(entity = null) {
    this.entity = entity;

    this.position = new THREE.Vector3();

    this.rotation = new THREE.Euler();

    this.scale = new THREE.Vector3(1, 1, 1);

    this.matrix = new THREE.Matrix4();
    this.worldMatrix = new THREE.Matrix4();

    this.dirty = true;
  }

  // ============================================================
  // DIRTY
  // ============================================================

  markDirty() {
    this.dirty = true;

    if (this.entity) {
      EventBus.emit(EngineEvents.TRANSFORM_CHANGED, this.entity);
    }
  }

  clearDirty() {
    this.dirty = false;
  }

  isDirty() {
    return this.dirty;
  }

  // ============================================================
  // POSITION
  // ============================================================

  setPosition(x = 0, y = 0, z = 0) {
    this.position.set(x, y, z);

    this.markDirty();

    if (this.entity) {
      EventBus.emit(EngineEvents.POSITION_CHANGED, this.entity);
    }
  }

  translate(x = 0, y = 0, z = 0) {
    this.position.x += x;
    this.position.y += y;
    this.position.z += z;

    this.markDirty();

    if (this.entity) {
      EventBus.emit(EngineEvents.POSITION_CHANGED, this.entity);
    }
  }

  // ============================================================
  // ROTATION
  // ============================================================

  setRotation(x = 0, y = 0, z = 0) {
    this.rotation.set(x, y, z);

    this.markDirty();

    if (this.entity) {
      EventBus.emit(EngineEvents.ROTATION_CHANGED, this.entity);
    }
  }

  rotate(x = 0, y = 0, z = 0) {
    this.rotation.x += x;
    this.rotation.y += y;
    this.rotation.z += z;

    this.markDirty();

    if (this.entity) {
      EventBus.emit(EngineEvents.ROTATION_CHANGED, this.entity);
    }
  }

  // ============================================================
  // SCALE
  // ============================================================

  setScale(x = 1, y = 1, z = 1) {
    this.scale.set(x, y, z);

    this.markDirty();

    if (this.entity) {
      EventBus.emit(EngineEvents.SCALE_CHANGED, this.entity);
    }
  }

  scaleBy(x = 1, y = 1, z = 1) {
    this.scale.multiply(new THREE.Vector3(x, y, z));

    this.markDirty();

    if (this.entity) {
      EventBus.emit(EngineEvents.SCALE_CHANGED, this.entity);
    }
  }

  // ============================================================
  // MATRIX
  // ============================================================

  updateMatrix() {
    const quaternion = new THREE.Quaternion();

    quaternion.setFromEuler(this.rotation);

    this.matrix.compose(this.position, quaternion, this.scale);

    this.worldMatrix.copy(this.matrix);

    this.clearDirty();
  }
}
