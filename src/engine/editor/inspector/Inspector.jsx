import useEngineStore from "../../../store/engineStore";

import InspectorTransform from "./InspectorTransform";

export default function Inspector() {
  const entity = useEngineStore((state) => state.editor.selectedEntity);

  if (!entity) {
    return (
      <div
        style={{
          color: "#999",
          fontSize: 13,
        }}
      >
        No Entity Selected
      </div>
    );
  }

  return (
    <div>
      {/* ============================================================
          ENTITY
      ============================================================ */}

      <div
        style={{
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          {entity.name}
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#999",
          }}
        >
          Type: {entity.type}
        </div>

        <div
          style={{
            fontSize: 11,
            color: "#777",
            marginTop: 3,
            wordBreak: "break-all",
          }}
        >
          UUID: {entity.uuid}
        </div>
      </div>

      {/* ============================================================
          TRANSFORM
      ============================================================ */}

      <InspectorTransform entity={entity} />
    </div>
  );
}
