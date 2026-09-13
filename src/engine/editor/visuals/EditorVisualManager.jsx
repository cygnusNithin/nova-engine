import OutlineRenderer from "./OutlineRenderer";
import BoundingBoxRenderer from "./BoundingBoxRenderer";
import PhysicsRenderer from "./PhysicsRenderer";

import { GizmoManager } from "../gizmos";

export default function EditorVisualManager() {
  return (
    <>
      <OutlineRenderer />

      <BoundingBoxRenderer />

      <PhysicsRenderer />

      <GizmoManager />
    </>
  );
}
