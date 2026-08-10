import { Cone } from "@react-three/drei";

import GizmoMaterial from "../shared/GizmoMaterial";

export default function MoveArrow({ color, position, rotation }) {
  return (
    <Cone
      args={[0.07, 0.16, 16]}
      position={position}
      rotation={rotation}
      raycast={() => null}
      userData={{
        gizmo: true,
        gizmoVisual: true,
      }}
    >
      <primitive object={GizmoMaterial.get(color)} attach="material" />
    </Cone>
  );
}
