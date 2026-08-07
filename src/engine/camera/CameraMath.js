import * as THREE from "three";

const forward = new THREE.Vector3();
const right = new THREE.Vector3();

export function getForward(camera) {

    camera.getWorldDirection(forward);

    forward.y = 0;

    return forward.normalize();

}

export function getRight(camera) {

    camera.getWorldDirection(forward);

    forward.y = 0;

    forward.normalize();

    right.crossVectors(forward, camera.up);

    return right.normalize();

}