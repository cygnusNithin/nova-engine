import WorldManager from "../world/WorldManager";
import { DebugWorld } from "../debug";
import { InputManager } from "../input";
import { EditorScene } from "../editor";
import SceneInitializer from "./SceneInitializer";

export default function SceneManager() {
  return (
    <>
      <SceneInitializer />

      <InputManager />

      <WorldManager />

      <EditorScene />

      <DebugWorld />
    </>
  );
}
