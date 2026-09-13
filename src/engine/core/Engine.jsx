import { useEffect } from "react";

import EngineProvider from "./EngineProvider";
import EngineCanvas from "../renderer/EngineCanvas";

import KeyboardDebugger from "../../game/ui/KeyboardDebugger";

import initializeKeyboardInput from "../input/KeyboardInput";
import initializeMouseInput from "../input/MouseInput";
import initializeCameraShortcuts from "../camera/CameraShortcuts";

import EditorManager from "../editor/EditorManager";
import ViewGizmo from "../editor/view/ViewGizmo";

import PerformanceManager from "../performance/PerformanceManager";

export default function Engine() {
  // ============================================================
  // INITIALIZE INPUT
  // ============================================================

  useEffect(() => {
    const disposeKeyboard = initializeKeyboardInput();

    const disposeMouse = initializeMouseInput();

    const disposeCameraShortcuts = initializeCameraShortcuts();

    return () => {
      disposeKeyboard();
      disposeMouse();
      disposeCameraShortcuts();
    };
  }, []);

  // ============================================================
  // DISABLE BROWSER CONTEXT MENU
  // ============================================================

  useEffect(() => {
    const preventMenu = (event) => {
      event.preventDefault();
    };

    window.addEventListener("contextmenu", preventMenu);

    return () => {
      window.removeEventListener("contextmenu", preventMenu);
    };
  }, []);

  // ============================================================
  // PREVENT BROWSER DRAG
  // ============================================================

  useEffect(() => {
    const preventDrag = (event) => {
      event.preventDefault();
    };

    window.addEventListener("dragstart", preventDrag);

    return () => {
      window.removeEventListener("dragstart", preventDrag);
    };
  }, []);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <EngineProvider>
      <div
        className="nova-engine"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* ======================================================
            3D ENGINE
        ====================================================== */}

        <EngineCanvas />

        {/* ======================================================
            EDITOR UI
            OUTSIDE R3F CANVAS
        ====================================================== */}

        <EditorManager />

        {/* ======================================================
            CAMERA VIEW UI
            OUTSIDE R3F CANVAS
        ====================================================== */}

        <ViewGizmo />

        {/* ======================================================
            PERFORMANCE UI
        ====================================================== */}

        <PerformanceManager />

        {/* ======================================================
            DEBUG UI
        ====================================================== */}

        <KeyboardDebugger />
      </div>
    </EngineProvider>
  );
}
