import * as THREE from "three";

const offset = new THREE.Vector3(0, 2, 6);
const target = new THREE.Vector3();

export default function updateThirdPersonCamera(
    camera
) {

    target.set(0, 0, 0);

    camera.position.lerp(

        offset,

        0.1

    );

    camera.lookAt(target);

}