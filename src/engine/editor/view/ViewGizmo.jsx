import useEngineStore from "../../../store/engineStore";

const VIEW_BUTTON_STYLE = {
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

export default function ViewGizmo() {
  const requestCameraView = useEngineStore((state) => state.requestCameraView);

  const cameraProjection = useEngineStore((state) => state.cameraProjection);

  // ============================================================
  // SNAP
  // ============================================================

  const snapView = (direction, up) => {
    requestCameraView({
      type: "snap",
      direction,
      up,
    });
  };

  // ============================================================
  // PROJECTION
  // ============================================================

  const toggleProjection = () => {
    requestCameraView({
      type: "projection",
    });
  };

  // ============================================================
  // BUTTON
  // ============================================================

  const axisButton = (label, direction, up) => (
    <button
      type="button"
      style={VIEW_BUTTON_STYLE}
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
  // UI
  // ============================================================

  return (
    <div
      style={{
        position: "fixed",

        top: 10,
        right: 10,

        width: 160,

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        gap: 6,

        padding: 8,

        boxSizing: "border-box",

        background: "rgba(20,20,20,0.92)",

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
      {/* ======================================================
          TOP / BOTTOM
      ====================================================== */}

      <div
        style={{
          display: "flex",
          gap: 4,
        }}
      >
        {axisButton("TOP", [0, 1, 0], [0, 0, -1])}

        {axisButton("BOTTOM", [0, -1, 0], [0, 0, 1])}
      </div>

      {/* ======================================================
          FRONT / BACK
      ====================================================== */}

      <div
        style={{
          display: "flex",
          gap: 4,
        }}
      >
        {axisButton("FRONT", [0, 0, 1], [0, 1, 0])}

        {axisButton("BACK", [0, 0, -1], [0, 1, 0])}
      </div>

      {/* ======================================================
          LEFT / RIGHT
      ====================================================== */}

      <div
        style={{
          display: "flex",
          gap: 4,
        }}
      >
        {axisButton("LEFT", [-1, 0, 0], [0, 1, 0])}

        {axisButton("RIGHT", [1, 0, 0], [0, 1, 0])}
      </div>

      {/* ======================================================
          PROJECTION
      ====================================================== */}

      <button
        type="button"
        style={{
          ...VIEW_BUTTON_STYLE,

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
        {cameraProjection === "orthographic" ? "ORTHO" : "PERSP"}
      </button>
    </div>
  );
}
