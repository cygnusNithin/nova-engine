import OutlineRenderer from "./OutlineRenderer";
import BoundingBoxRenderer from "./BoundingBoxRenderer";
import PhysicsRenderer from "./PhysicsRenderer";

import { GizmoManager } from "../gizmos";

import ViewGizmo from "../view/ViewGizmo";

export default function EditorVisualManager() {
  return (
    <>
      <OutlineRenderer />

      <BoundingBoxRenderer />

      <PhysicsRenderer />

      <GizmoManager />

      <ViewGizmo />
    </>
  );
}
