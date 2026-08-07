import WorldManager from "../world/WorldManager";
import { DebugWorld, DebugEntity } from "../debug";
import { PerformanceManager } from "../performance";
import { InputManager, PointerLock } from "../input";
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

      {/* <PointerLock /> */}
    </>
  );
}
