import { useMemo } from "react";
import * as THREE from "three";

export default function AxesHelper() {
  const helper = useMemo(() => new THREE.AxesHelper(5), []);

  return <primitive object={helper} />;
}