import { useCallback, useEffect, useRef, useState } from "react";

export default function Benchmark() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const frameTimesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const previousTimeRef = useRef(null);

  // ============================================================
  // START BENCHMARK
  // ============================================================

  const startBenchmark = useCallback(() => {
    frameTimesRef.current = [];
    previousTimeRef.current = null;

    setResult(null);
    setRunning(true);
  }, []);

  // ============================================================
  // BENCHMARK LOOP
  // ============================================================

  useEffect(() => {
    if (!running) {
      return;
    }

    let disposed = false;

    const measureFrame = (time) => {
      if (disposed) {
        return;
      }

      if (previousTimeRef.current !== null) {
        const delta = time - previousTimeRef.current;

        if (delta > 0 && delta < 1000) {
          frameTimesRef.current.push(delta);
        }
      }

      previousTimeRef.current = time;

      // --------------------------------------------------------
      // Finish after 120 measured frames
      // --------------------------------------------------------

      if (frameTimesRef.current.length >= 120) {
        const frameTimes = frameTimesRef.current;

        const totalTime = frameTimes.reduce(
          (sum, frameTime) => sum + frameTime,
          0,
        );

        const averageFrameTime =
          frameTimes.length > 0 ? totalTime / frameTimes.length : 0;

        const averageFPS = averageFrameTime > 0 ? 1000 / averageFrameTime : 0;

        const minFrameTime =
          frameTimes.length > 0 ? Math.min(...frameTimes) : 0;

        const maxFrameTime =
          frameTimes.length > 0 ? Math.max(...frameTimes) : 0;

        const minFPS = maxFrameTime > 0 ? 1000 / maxFrameTime : 0;

        const maxFPS = minFrameTime > 0 ? 1000 / minFrameTime : 0;

        setResult({
          frames: frameTimes.length,

          averageFPS,

          minFPS,

          maxFPS,

          averageFrameTime,

          minFrameTime,

          maxFrameTime,
        });

        setRunning(false);

        animationFrameRef.current = null;

        previousTimeRef.current = null;

        return;
      }

      animationFrameRef.current = requestAnimationFrame(measureFrame);
    };

    animationFrameRef.current = requestAnimationFrame(measureFrame);

    return () => {
      disposed = true;

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);

        animationFrameRef.current = null;
      }

      previousTimeRef.current = null;
    };
  }, [running]);

  // ============================================================
  // FINAL CLEANUP
  // ============================================================

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);

        animationFrameRef.current = null;
      }
    };
  }, []);

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      style={{
        position: "absolute",

        top: 10,
        right: 10,

        width: 260,

        padding: 12,

        background: "rgba(20, 20, 20, 0.92)",

        color: "#fff",

        border: "1px solid #444",

        borderRadius: 6,

        fontFamily: "Arial, sans-serif",

        fontSize: 13,

        zIndex: 1000,

        boxSizing: "border-box",
      }}
    >
      {/* ========================================================
          TITLE
      ======================================================== */}

      <div
        style={{
          fontSize: 14,

          fontWeight: 600,

          marginBottom: 10,
        }}
      >
        Performance Benchmark
      </div>

      {/* ========================================================
          START
      ======================================================== */}

      {!running && !result && (
        <button
          type="button"
          onClick={startBenchmark}
          style={{
            width: "100%",

            padding: "7px 10px",

            background: "#2b2b2b",

            color: "#fff",

            border: "1px solid #555",

            borderRadius: 4,

            cursor: "pointer",
          }}
        >
          Run Benchmark
        </button>
      )}

      {/* ========================================================
          RUNNING
      ======================================================== */}

      {running && (
        <div>
          <div
            style={{
              marginBottom: 8,
            }}
          >
            Running benchmark...
          </div>

          <div
            style={{
              height: 4,

              background: "#333",

              borderRadius: 2,

              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",

                height: "100%",

                background: "#4caf50",

                animation: "novaBenchmarkPulse 1s infinite",
              }}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          RESULTS
      ======================================================== */}

      {!running && result && (
        <>
          <div
            style={{
              display: "grid",

              gridTemplateColumns: "1fr 1fr",

              gap: 8,

              marginBottom: 12,
            }}
          >
            <Metric label="Average FPS" value={result.averageFPS} />

            <Metric label="Min FPS" value={result.minFPS} />

            <Metric label="Max FPS" value={result.maxFPS} />

            <Metric
              label="Avg Frame"
              value={`${result.averageFrameTime.toFixed(2)} ms`}
            />
          </div>

          <button
            type="button"
            onClick={startBenchmark}
            style={{
              width: "100%",

              padding: "7px 10px",

              background: "#2b2b2b",

              color: "#fff",

              border: "1px solid #555",

              borderRadius: 4,

              cursor: "pointer",
            }}
          >
            Run Again
          </button>
        </>
      )}

      {/* ========================================================
          ANIMATION
      ======================================================== */}

      <style>
        {`
          @keyframes novaBenchmarkPulse {
            0% {
              opacity: 0.35;
            }

            50% {
              opacity: 1;
            }

            100% {
              opacity: 0.35;
            }
          }
        `}
      </style>
    </div>
  );
}

// ============================================================
// METRIC
// ============================================================

function Metric({ label, value }) {
  return (
    <div
      style={{
        padding: 8,

        background: "#292929",

        border: "1px solid #3d3d3d",

        borderRadius: 4,
      }}
    >
      <div
        style={{
          color: "#999",

          fontSize: 11,

          marginBottom: 3,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 14,

          fontWeight: 600,
        }}
      >
        {typeof value === "number" ? value.toFixed(1) : value}
      </div>
    </div>
  );
}
