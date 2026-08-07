import { useEffect, useState } from "react";

import { EventBus, EngineEvents } from "../../events";

import EditorTransform from "../transform/EditorTransform";

function VectorRow({ label, value, onChange }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "30px 1fr 1fr 1fr",
        gap: 4,
        marginBottom: 6,
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "#aaa",
        }}
      >
        {label}
      </span>

      <input
        type="number"
        value={value.x}
        onChange={(event) => onChange("x", Number(event.target.value))}
        style={inputStyle}
      />

      <input
        type="number"
        value={value.y}
        onChange={(event) => onChange("y", Number(event.target.value))}
        style={inputStyle}
      />

      <input
        type="number"
        value={value.z}
        onChange={(event) => onChange("z", Number(event.target.value))}
        style={inputStyle}
      />
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",

  background: "#151515",
  color: "#fff",

  border: "1px solid #3d3d3d",
  borderRadius: 3,

  padding: "4px 5px",

  fontSize: 11,

  outline: "none",
};

export default function InspectorTransform({ entity }) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    function onTransformChanged(changedEntity) {
      if (!changedEntity) {
        forceUpdate((value) => value + 1);
        return;
      }

      if (changedEntity === entity) {
        forceUpdate((value) => value + 1);
      }
    }

    EventBus.on(EngineEvents.TRANSFORM_CHANGED, onTransformChanged);

    return () => {
      EventBus.off(EngineEvents.TRANSFORM_CHANGED, onTransformChanged);
    };
  }, [entity]);

  if (!entity?.transform) {
    return null;
  }

  const transform = entity.transform;

  return (
    <div
      style={{
        marginTop: 12,
        paddingTop: 12,
        borderTop: "1px solid #444",
      }}
    >
      <h4
        style={{
          margin: "0 0 10px",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        Transform
      </h4>

      {/* POSITION */}

      <VectorRow
        label="P"
        value={transform.position}
        onChange={(axis, value) => {
          const position = transform.position.clone();

          position[axis] = value;

          EditorTransform.setEntityPosition(
            entity,
            position.x,
            position.y,
            position.z,
          );
        }}
      />

      {/* ROTATION */}

      <VectorRow
        label="R"
        value={{
          x: transform.rotation.x,
          y: transform.rotation.y,
          z: transform.rotation.z,
        }}
        onChange={(axis, value) => {
          const rotation = transform.rotation.clone();

          rotation[axis] = value;

          EditorTransform.setEntityRotation(
            entity,
            rotation.x,
            rotation.y,
            rotation.z,
          );
        }}
      />

      {/* SCALE */}

      <VectorRow
        label="S"
        value={transform.scale}
        onChange={(axis, value) => {
          const scale = transform.scale.clone();

          scale[axis] = value;

          EditorTransform.setEntityScale(entity, scale.x, scale.y, scale.z);
        }}
      />
    </div>
  );
}
