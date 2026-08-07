import { useEffect } from "react";

import EngineProvider from "./EngineProvider";
import EngineCanvas from "../renderer/EngineCanvas";

import KeyboardDebugger from "../../game/ui/KeyboardDebugger";

import initializeKeyboardInput from "../input/KeyboardInput";
import initializeMouseInput from "../input/MouseInput";
import initializeCameraShortcuts from "../camera/CameraShortcuts";

import EditorManager from "../editor/EditorManager";
import PerformanceManager from "../performance/PerformanceManager";

export default function Engine() {
  //--------------------------------------------------
  // Initialize Input
  //--------------------------------------------------

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

  //--------------------------------------------------
  // Disable Browser Context Menu
  //--------------------------------------------------

  useEffect(() => {
    const preventMenu = (event) => {
      event.preventDefault();
    };

    window.addEventListener("contextmenu", preventMenu);

    return () => {
      window.removeEventListener("contextmenu", preventMenu);
    };
  }, []);

  //--------------------------------------------------
  // Prevent Browser Drag
  //--------------------------------------------------

  useEffect(() => {
    const preventDrag = (event) => {
      event.preventDefault();
    };

    window.addEventListener("dragstart", preventDrag);

    return () => {
      window.removeEventListener("dragstart", preventDrag);
    };
  }, []);

  //--------------------------------------------------
  // Render
  //--------------------------------------------------

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
        {/* ================================================
            3D ENGINE
        ================================================= */}

        <EngineCanvas />

        {/* ================================================
            EDITOR UI
            Must stay OUTSIDE the R3F Canvas
        ================================================= */}

        <EditorManager />

        {/* ================================================
            PERFORMANCE UI
            Must stay OUTSIDE the R3F Canvas
        ================================================= */}

        <PerformanceManager />

        {/* ================================================
            DEBUG UI
        ================================================= */}

        <KeyboardDebugger />
      </div>
    </EngineProvider>
  );
}
