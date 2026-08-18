import EditorCursorProbe from "./debug/EditorCursorProbe";
import EditorRaycaster from "./selection/EditorRaycaster";
import EditorShortcuts from "./shortcuts/EditorShortcuts";

import { EditorVisualManager } from "./visuals";

export default function EditorScene() {
  return (
    <>
      <EditorRaycaster />

      <EditorCursorProbe />

      <EditorVisualManager />

      <EditorShortcuts />
    </>
  );
}
