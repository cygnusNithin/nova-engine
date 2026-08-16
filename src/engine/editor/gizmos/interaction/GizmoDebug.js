import * as THREE from "three";


class GizmoDebug {
  constructor() {
    this.enabled = true;

    this.lastHoverKey = null;

    this.lastCameraPosition = new THREE.Vector3();

    this.lastCameraQuaternion = new THREE.Quaternion();

    this.cameraInitialized = false;

    this.lastTransformState = false;

    this.lastMode = null;

    this.lastPointerState = null;

    this.lastHoverTime = 0;

    this.hoverLogInterval = 100;

    this.cameraLogInterval = 150;

    this.lastCameraLogTime = 0;
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
  }

  modeChanged(mode) {
    if (!this.enabled) {
      return;
    }

    if (this.lastMode === mode) {
      return;
    }

    this.lastMode = mode;

    console.log("[GizmoDebug] MODE", {
      mode,
    });
  }

  hover({ mode, axis, source, event, selectedEntity, camera = null }) {
    if (!this.enabled) {
      return;
    }

    const now = performance.now();

    const hoverKey = `${mode}:${axis}:${source}`;

    /*
     * Don't spam DevTools if the pointer remains
     * over the same gizmo object.
     */
    if (
      this.lastHoverKey === hoverKey &&
      now - this.lastHoverTime < this.hoverLogInterval
    ) {
      return;
    }

    this.lastHoverKey = hoverKey;
    this.lastHoverTime = now;

    const pointer = event?.pointer;
    const ray = event?.ray;
    const point = event?.point;
    const object = event?.object;

    console.groupCollapsed(`[GizmoDebug] HOVER ${mode} ${axis ?? "none"}`);

    console.log("Target", {
      mode,
      axis,
      source,

      object: object?.name ?? null,

      objectType: object?.type ?? null,

      gizmo: object?.userData?.gizmo ?? false,

      gizmoHit: object?.userData?.gizmoHit ?? false,

      gizmoVisual: object?.userData?.gizmoVisual ?? false,

      gizmoAxis: object?.userData?.gizmoAxis ?? null,

      gizmoType: object?.userData?.gizmoType ?? null,

      selectedEntity:
        selectedEntity?.name ??
        selectedEntity?.id ??
        selectedEntity?.uuid ??
        null,
    });

    console.log("Pointer", {
      ndcX: pointer?.x ?? null,

      ndcY: pointer?.y ?? null,

      clientX: event?.nativeEvent?.clientX ?? null,

      clientY: event?.nativeEvent?.clientY ?? null,
    });

    this.logCameraAndEntity(camera ?? event?.camera, selectedEntity);

    console.log("Ray", {
      origin: ray?.origin
        ? {
            x: Number(ray.origin.x.toFixed(4)),
            y: Number(ray.origin.y.toFixed(4)),
            z: Number(ray.origin.z.toFixed(4)),
          }
        : null,

      direction: ray?.direction
        ? {
            x: Number(ray.direction.x.toFixed(4)),
            y: Number(ray.direction.y.toFixed(4)),
            z: Number(ray.direction.z.toFixed(4)),
          }
        : null,
    });

    console.log("Intersection", {
      distance: Number.isFinite(event?.distance)
        ? Number(event.distance.toFixed(4))
        : null,

      worldPoint: point
        ? {
            x: Number(point.x.toFixed(4)),
            y: Number(point.y.toFixed(4)),
            z: Number(point.z.toFixed(4)),
          }
        : null,
    });

    console.groupEnd();
  }

  hoverClear() {
    if (!this.enabled) {
      return;
    }

    if (this.lastHoverKey === null) {
      return;
    }

    this.lastHoverKey = null;

    console.log("[GizmoDebug] HOVER CLEAR");
  }

  pointerDown({
    mode,
    axis,
    event,
    selectedEntity,
    object,
    pointerId,
    camera = null,
    ray = null,
  }) {
    if (!this.enabled) {
      return;
    }

    console.groupCollapsed(`[GizmoDebug] POINTER DOWN ${mode}:${axis}`);

    console.log("Selection", {
      selectedEntity:
        selectedEntity?.name ??
        selectedEntity?.id ??
        selectedEntity?.uuid ??
        null,

      gizmoObject: object?.name ?? null,

      gizmo: object?.userData?.gizmo ?? false,

      gizmoHit: object?.userData?.gizmoHit ?? false,

      gizmoAxis: object?.userData?.gizmoAxis ?? null,
    });

    console.log("Pointer", {
      pointerId,

      ndcX: event?.pointer?.x ?? null,

      ndcY: event?.pointer?.y ?? null,

      clientX: event?.nativeEvent?.clientX ?? null,

      clientY: event?.nativeEvent?.clientY ?? null,
    });

    console.log("Live ray", {
      origin: this.toVectorRecord(ray?.origin),
      direction: this.toVectorRecord(ray?.direction),
    });

    this.logCameraAndEntity(camera ?? event?.camera, selectedEntity);

    console.groupEnd();
  }

  pointerBlocked(data) {
    if (!this.enabled) {
      return;
    }

    console.warn("[GizmoDebug] POINTER BLOCKED", data);
  }

  transformRejected(data) {
    if (!this.enabled) {
      return;
    }

    console.warn("[GizmoDebug] TRANSFORM REJECTED", data);
  }

  transformStart({ mode, axis, entity, pointerId }) {
    if (!this.enabled) {
      return;
    }

    this.lastTransformState = true;

    console.groupCollapsed(`[GizmoDebug] TRANSFORM START ${mode}:${axis}`);

    console.log({
      mode,
      axis,
      pointerId,

      entity: entity?.name ?? entity?.id ?? entity?.uuid ?? null,
    });

    console.groupEnd();
  }

  transformEnd(mode, axis = null) {
    if (!this.enabled) {
      return;
    }

    this.lastTransformState = false;

    console.log("[GizmoDebug] TRANSFORM END", {
      mode,
      axis,
    });
  }

  transformCancel(mode, axis = null) {
    if (!this.enabled) {
      return;
    }

    this.lastTransformState = false;

    console.warn("[GizmoDebug] TRANSFORM CANCEL", {
      mode,
      axis,
    });
  }

  observeCamera(camera, mode, transforming = false, pointer = null, entity = null) {
    if (!this.enabled || !camera) {
      return;
    }

    const positionChanged = this.cameraInitialized
      ? camera.position.distanceTo(this.lastCameraPosition) > 0.01
      : true;

    const quaternionChanged = this.cameraInitialized
      ? this.lastCameraQuaternion.angleTo(camera.quaternion) > 0.01
      : true;

    if (!positionChanged && !quaternionChanged) {
      return;
    }

    this.lastCameraPosition.copy(camera.position);

    this.lastCameraQuaternion.copy(camera.quaternion);

    this.cameraInitialized = true;

    const now = performance.now();

    if (now - this.lastCameraLogTime < this.cameraLogInterval) {
      return;
    }

    this.lastCameraLogTime = now;

    console.log("[GizmoDebug] CAMERA CHANGE", {
      mode,
      transforming,

      position: {
        x: Number(camera.position.x.toFixed(3)),
        y: Number(camera.position.y.toFixed(3)),
        z: Number(camera.position.z.toFixed(3)),
      },

      rotation: {
        x: Number(camera.rotation.x.toFixed(3)),
        y: Number(camera.rotation.y.toFixed(3)),
        z: Number(camera.rotation.z.toFixed(3)),
      },

      pointer: pointer
        ? {
            ndcX: Number(pointer.x.toFixed(4)),
            ndcY: Number(pointer.y.toFixed(4)),
          }
        : null,

      selectedEntity: entity
        ? {
            name: entity.name ?? entity.id ?? entity.uuid ?? null,
            position: this.toVectorRecord(entity.transform?.position),
          }
        : null,
    });
  }

  toVectorRecord(vector) {
    if (!vector) {
      return null;
    }

    return {
      x: Number(vector.x.toFixed(4)),
      y: Number(vector.y.toFixed(4)),
      z: Number(vector.z.toFixed(4)),
    };
  }

  logCameraAndEntity(camera, entity) {
    if (!camera || !entity?.transform) {
      return;
    }

    camera.updateMatrixWorld(true);

    const direction = new THREE.Vector3();
    const projectedOrigin = entity.transform.position.clone().project(camera);

    camera.getWorldDirection(direction);

    console.log("Camera/entity alignment", {
      cameraPosition: this.toVectorRecord(camera.position),
      cameraDirection: this.toVectorRecord(direction),
      entityPosition: this.toVectorRecord(entity.transform.position),
      entityOriginNdc: this.toVectorRecord(projectedOrigin),
    });
  }
}

export default new GizmoDebug();
