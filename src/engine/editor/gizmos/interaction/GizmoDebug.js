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

  hover({ mode, axis, source, event, selectedEntity }) {
    if (!this.enabled) {
      return;
    }

    const hoverKey = `${mode}:${axis}:${source}`;

    if (this.lastHoverKey === hoverKey) {
      return;
    }

    this.lastHoverKey = hoverKey;

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
      gizmoAxis: object?.userData?.gizmoAxis ?? null,
      selectedEntity:
        selectedEntity?.name ??
        selectedEntity?.id ??
        selectedEntity?.uuid ??
        null,
    });

    console.log("Pointer", {
      ndcX: pointer?.x ?? null,
      ndcY: pointer?.y ?? null,
    });

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

  observeCamera(camera, mode, transforming = false) {
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
    });
  }
}

export default new GizmoDebug();
