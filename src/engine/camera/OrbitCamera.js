import * as THREE from "three";

const target = new THREE.Vector3(0, 0, 0);

let yaw = 0;
let pitch = 0;
let distance = 8;

export function updateOrbitCamera(
    camera,
    mouse,
    editor
) {

    if (mouse.left) {

        yaw -= mouse.deltaX * editor.mouseSensitivity;

        pitch -= mouse.deltaY * editor.mouseSensitivity;

    }

    const limit = Math.PI / 2 - 0.01;

    pitch = Math.max(
        -limit,
        Math.min(limit, pitch)
    );

    distance += mouse.wheel * 0.01;

    distance = THREE.MathUtils.clamp(
        distance,
        2,
        50
    );

    camera.position.set(

        target.x +
            Math.cos(pitch) *
            Math.sin(yaw) *
            distance,

        target.y +
            Math.sin(pitch) *
            distance,

        target.z +
            Math.cos(pitch) *
            Math.cos(yaw) *
            distance

    );

    camera.lookAt(target);

}