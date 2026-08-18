import * as THREE from "three";
import { useMemo } from "react";
import { Html } from "@react-three/drei";

const AXIS_LENGTH = 1.5;
const AXIS_RADIUS = 0.018;
const ORIGIN_RADIUS = 0.06;

const COLORS = {
  x: "#ff4d4d",
  y: "#4dff88",
  z: "#4d8dff",
  origin: "#ffffff",
  guide: "#ffffff",
};

function AxisLine({ direction, color, length = AXIS_LENGTH }) {
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();

    const up = new THREE.Vector3(0, 1, 0);
    const target = new THREE.Vector3(...direction).normalize();

    q.setFromUnitVectors(up, target);

    return q;
  }, [direction]);

  return (
    <mesh
      position={[
        direction[0] * length * 0.5,
        direction[1] * length * 0.5,
        direction[2] * length * 0.5,
      ]}
      quaternion={quaternion}
      raycast={() => null}
      userData={{
        editorVisual: true,
        transformPositionGuide: true,
      }}
    >
      <cylinderGeometry args={[AXIS_RADIUS, AXIS_RADIUS, length, 8]} />

      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.9}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

function AxisLabel({ axis, color, position }) {
  return (
    <Html
      position={position}
      center
      distanceFactor={8}
      style={{
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
        color,
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textShadow: "0 1px 2px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.8)",
      }}
    >
      {axis}
    </Html>
  );
}

function PositionLabel({ position }) {
  const [x, y, z] = position;

  return (
    <Html
      position={[0, 0.25, 0]}
      center
      distanceFactor={8}
      style={{
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
        padding: "6px 8px",
        borderRadius: "5px",
        background: "rgba(15, 15, 18, 0.88)",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
        color: "#ffffff",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: "11px",
        lineHeight: 1.35,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 3 }}>Position</div>

      <div>
        <span style={{ color: COLORS.x }}>X</span> {formatValue(x)}
      </div>

      <div>
        <span style={{ color: COLORS.y }}>Y</span> {formatValue(y)}
      </div>

      <div>
        <span style={{ color: COLORS.z }}>Z</span> {formatValue(z)}
      </div>
    </Html>
  );
}

function formatValue(value) {
  if (!Number.isFinite(value)) {
    return "0.00";
  }

  return Number(value).toFixed(2);
}

export default function TransformPositionGuide({
  position = [0, 0, 0],
  visible = true,
  showLabels = true,
  showPosition = true,
  size = 1,
}) {
  if (!visible) {
    return null;
  }

  const axisLength = AXIS_LENGTH * size;

  return (
    <group
      position={position}
      userData={{
        editorVisual: true,
        transformPositionGuide: true,
      }}
    >
      {/* ====================================================== */}
      {/* ORIGIN                                                 */}
      {/* ====================================================== */}

      <mesh
        raycast={() => null}
        userData={{
          editorVisual: true,
          transformPositionGuide: true,
        }}
      >
        <sphereGeometry args={[ORIGIN_RADIUS * size, 12, 12]} />

        <meshBasicMaterial
          color={COLORS.origin}
          transparent
          opacity={0.95}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>

      {/* ====================================================== */}
      {/* X AXIS                                                 */}
      {/* ====================================================== */}

      <AxisLine direction={[1, 0, 0]} color={COLORS.x} length={axisLength} />

      {/* ====================================================== */}
      {/* Y AXIS                                                 */}
      {/* ====================================================== */}

      <AxisLine direction={[0, 1, 0]} color={COLORS.y} length={axisLength} />

      {/* ====================================================== */}
      {/* Z AXIS                                                 */}
      {/* ====================================================== */}

      <AxisLine direction={[0, 0, 1]} color={COLORS.z} length={axisLength} />

      {/* ====================================================== */}
      {/* AXIS LABELS                                             */}
      {/* ====================================================== */}

      {showLabels && (
        <>
          <AxisLabel
            axis="X"
            color={COLORS.x}
            position={[axisLength + 0.12, 0, 0]}
          />

          <AxisLabel
            axis="Y"
            color={COLORS.y}
            position={[0, axisLength + 0.12, 0]}
          />

          <AxisLabel
            axis="Z"
            color={COLORS.z}
            position={[0, 0, axisLength + 0.12]}
          />
        </>
      )}

      {/* ====================================================== */}
      {/* NUMERIC POSITION                                       */}
      {/* ====================================================== */}

      {showPosition && <PositionLabel position={position} />}
    </group>
  );
}
