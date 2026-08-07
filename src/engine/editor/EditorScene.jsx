import EditorRaycaster from "./selection/EditorRaycaster";
import EditorShortcuts from "./shortcuts/EditorShortcuts";

import { EditorVisualManager } from "./visuals";

export default function EditorScene() {
  return (
    <>
      <EditorRaycaster />

      <EditorVisualManager />

      <EditorShortcuts />
    </>
  );
}
