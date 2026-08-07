import { useEffect } from "react";

import useEngineStore from "../../store/engineStore";

import Hierarchy from "./hierarchy/Hierarchy";
import Inspector from "./inspector/Inspector";

export default function EditorManager() {
  const editor = useEngineStore((state) => state.editor);

  useEffect(() => {
    if (!editor.enabled) return;

    console.log("Nova Editor Started");
  }, [editor.enabled]);

  if (!editor.enabled) {
    return null;
  }

  return (
    <div
      data-nova-editor="true"
      style={{
        position: "absolute",

        top: 10,
        left: 10,

        width: 240,

        maxHeight: "calc(100vh - 20px)",

        overflowY: "auto",

        background: "#202020",
        color: "#fff",

        border: "1px solid #444",
        borderRadius: 6,

        padding: 10,

        boxSizing: "border-box",

        fontFamily: "Arial, sans-serif",
        fontSize: 13,

        zIndex: 100,
      }}
    >
      {/* ============================================================
          HIERARCHY
      ============================================================ */}

      <Hierarchy />

      {/* ============================================================
          INSPECTOR
      ============================================================ */}

      <div
        style={{
          marginTop: 12,
          paddingTop: 12,

          borderTop: "1px solid #444",
        }}
      >
        <Inspector />
      </div>
    </div>
  );
}
