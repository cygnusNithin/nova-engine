import { createPortal } from "react-dom";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

import useEngineStore from "../../../store/engineStore";

export default function ViewGizmo() {
  const { camera, set, size } = useThree();

  const getTarget = () => {
    const selected = useEngineStore.getState().editor.selectedEntity;

    if (selected?.transform?.position) {
      return selected.transform.position.clone();
    }

    return new THREE.Vector3(0, 0, 0);
  };

  // ============================================================
  // SNAP VIEW
  // ============================================================

  const snapView = (direction, up) => {
    const target = getTarget();

    const currentDistance = camera.position.distanceTo(target);

    const distance = Math.max(currentDistance, 8);

    const position = target
      .clone()
      .add(direction.clone().normalize().multiplyScalar(distance));

    camera.position.copy(position);

    camera.up.copy(up);

    camera.lookAt(target);

    camera.updateProjectionMatrix();

    camera.updateMatrixWorld(true);
  };

  // ============================================================
  // PROJECTION
  // ============================================================

  const toggleProjection = () => {
    const target = getTarget();

    const position = camera.position.clone();

    const quaternion = camera.quaternion.clone();

    const up = camera.up.clone();

    const distance = Math.max(camera.position.distanceTo(target), 8);

    // ==========================================================
    // PERSPECTIVE -> ORTHOGRAPHIC
    // ==========================================================

    if (camera.isPerspectiveCamera) {
      const aspect = size.width / Math.max(size.height, 1);

      const halfHeight = Math.max(distance * 0.35, 4);

      const halfWidth = halfHeight * aspect;

      const nextCamera = new THREE.OrthographicCamera(
        -halfWidth,
        halfWidth,
        halfHeight,
        -halfHeight,
        0.1,
        2000,
      );

      nextCamera.position.copy(position);

      nextCamera.quaternion.copy(quaternion);

      nextCamera.up.copy(up);

      nextCamera.lookAt(target);

      nextCamera.zoom = 1;

      nextCamera.updateProjectionMatrix();

      nextCamera.updateMatrixWorld(true);

      set({
        camera: nextCamera,
      });

      return;
    }

    // ==========================================================
    // ORTHOGRAPHIC -> PERSPECTIVE
    // ==========================================================

    const nextCamera = new THREE.PerspectiveCamera(
      60,
      size.width / Math.max(size.height, 1),
      0.1,
      2000,
    );

    nextCamera.position.copy(position);

    nextCamera.quaternion.copy(quaternion);

    nextCamera.up.copy(up);

    nextCamera.lookAt(target);

    nextCamera.updateProjectionMatrix();

    nextCamera.updateMatrixWorld(true);

    set({
      camera: nextCamera,
    });
  };

  // ============================================================
  // BUTTON STYLE
  // ============================================================

  const buttonStyle = {
    width: 74,
    height: 28,

    border: "1px solid rgba(255,255,255,0.2)",

    background: "rgba(25,25,25,0.92)",

    color: "#ffffff",

    borderRadius: 4,

    cursor: "pointer",

    fontSize: 11,

    fontWeight: 600,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    padding: 0,

    boxSizing: "border-box",

    userSelect: "none",
  };

  // ============================================================
  // AXIS BUTTON
  // ============================================================

  const axisButton = (label, direction, up) => (
    <button
      type="button"
      style={buttonStyle}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();

        snapView(direction, up);
      }}
    >
      {label}
    </button>
  );

  // ============================================================
  // SCREEN SPACE UI
  // ============================================================

  const viewControls = (
    <div
      style={{
        position: "fixed",

        top: 128,
        right: 10,

        width: 160,

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        gap: 6,

        padding: 8,

        boxSizing: "border-box",

        background: "rgba(20,20,20,0.88)",

        border: "1px solid rgba(255,255,255,0.15)",

        borderRadius: 6,

        zIndex: 1100,

        pointerEvents: "auto",

        userSelect: "none",
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
    >
      {/* TOP / BOTTOM */}

      <div
        style={{
          display: "flex",

          gap: 4,
        }}
      >
        {axisButton(
          "TOP",
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(0, 0, -1),
        )}

        {axisButton(
          "BOTTOM",
          new THREE.Vector3(0, -1, 0),
          new THREE.Vector3(0, 0, 1),
        )}
      </div>

      {/* FRONT / BACK */}

      <div
        style={{
          display: "flex",

          gap: 4,
        }}
      >
        {axisButton(
          "FRONT",
          new THREE.Vector3(0, 0, 1),
          new THREE.Vector3(0, 1, 0),
        )}

        {axisButton(
          "BACK",
          new THREE.Vector3(0, 0, -1),
          new THREE.Vector3(0, 1, 0),
        )}
      </div>

      {/* LEFT / RIGHT */}

      <div
        style={{
          display: "flex",

          gap: 4,
        }}
      >
        {axisButton(
          "LEFT",
          new THREE.Vector3(-1, 0, 0),
          new THREE.Vector3(0, 1, 0),
        )}

        {axisButton(
          "RIGHT",
          new THREE.Vector3(1, 0, 0),
          new THREE.Vector3(0, 1, 0),
        )}
      </div>

      {/* PERSPECTIVE / ORTHOGRAPHIC */}

      <button
        type="button"
        style={{
          ...buttonStyle,

          width: 74,
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.stopPropagation();

          toggleProjection();
        }}
      >
        {camera.isOrthographicCamera ? "ORTHO" : "PERSP"}
      </button>
    </div>
  );

  /*
   * Render outside the R3F canvas.
   *
   * This is intentional:
   *
   * View controls are editor UI, not scene objects.
   *
   * createPortal keeps the React/R3F context while placing
   * the actual DOM element directly in document.body.
   */

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(viewControls, document.body);
}
