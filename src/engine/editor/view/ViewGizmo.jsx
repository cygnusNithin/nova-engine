import { Html } from "@react-three/drei";
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

  const toggleProjection = () => {
    const target = getTarget();
    const position = camera.position.clone();
    const up = camera.up.clone();
    const distance = Math.max(camera.position.distanceTo(target), 8);

    // ==========================================================
    // Perspective -> Orthographic
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
      nextCamera.up.copy(up);
      nextCamera.lookAt(target);
      nextCamera.zoom = 1;
      nextCamera.updateProjectionMatrix();
      nextCamera.updateMatrixWorld(true);

      set({ camera: nextCamera });

      return;
    }

    // ==========================================================
    // Orthographic -> Perspective
    // ==========================================================

    const nextCamera = new THREE.PerspectiveCamera(
      60,
      size.width / Math.max(size.height, 1),
      0.1,
      2000,
    );

    nextCamera.position.copy(position);
    nextCamera.up.copy(up);
    nextCamera.lookAt(target);
    nextCamera.updateProjectionMatrix();
    nextCamera.updateMatrixWorld(true);

    set({ camera: nextCamera });
  };

  const buttonStyle = {
    width: 36,
    height: 28,
    padding: 0,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(25,25,25,0.88)",
    color: "#ffffff",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 600,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  };

  const axisButton = (label, direction, up) => (
    <button
      type="button"
      aria-label={`View ${label.toLowerCase()}`}
      style={buttonStyle}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        snapView(direction, up);
      }}
    >
      {label}
    </button>
  );

  return (
    <Html fullscreen zIndexRange={[1000, 0]}>
      <div
        style={{
          position: "fixed",
          top: 14,
          right: 14,
          width: 124,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 6,
          pointerEvents: "auto",
          userSelect: "none",
          boxSizing: "border-box",
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
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

        <div
          style={{
            display: "flex",
            justifyContent: "center",
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

        <div
          style={{
            display: "flex",
            justifyContent: "center",
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

        <button
          type="button"
          aria-label="Toggle camera projection"
          style={{
            ...buttonStyle,
            width: "100%",
          }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            toggleProjection();
          }}
        >
          {camera.isOrthographicCamera ? "ORTHO" : "PERSP"}
        </button>
      </div>
    </Html>
  );
}
