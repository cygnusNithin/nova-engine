import useEngineStore from "../../store/engineStore";

export default function KeyboardDebugger() {
  const keyboard = useEngineStore((state) => state.keyboard);

  return (
    <div
      style={{
        position: "fixed",

        bottom: 10,
        left: 10,

        color: "white",
        background: "rgba(0,0,0,.6)",

        padding: 10,

        fontFamily: "monospace",
        fontSize: 12,

        borderRadius: 4,

        zIndex: 9999,

        pointerEvents: "none",
      }}
    >
      <pre
        style={{
          margin: 0,
        }}
      >
        {JSON.stringify(keyboard, null, 2)}
      </pre>
    </div>
  );
}
