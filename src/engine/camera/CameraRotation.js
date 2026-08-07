import * as THREE from "three";

const target = new THREE.Vector3();

let yaw = 0;
let pitch = 0;

let initialized = false;

export function updateCameraRotation(
    camera,
    mouse,
    sensitivity
) {

    if (!initialized) {

    const direction = new THREE.Vector3();

    camera.getWorldDirection(direction);

    pitch = Math.asin(direction.y);

    yaw = Math.atan2(direction.x, direction.z);

    initialized = true;

}

    // Left drag is reserved for selection and gizmo manipulation.
    if (!mouse.right)
        return;

    yaw -= mouse.deltaX * sensitivity;

    pitch -= mouse.deltaY * sensitivity;

    const limit = Math.PI / 2 - 0.01;

    pitch = Math.max(
        -limit,
        Math.min(limit, pitch)
    );

    target.set(

        Math.cos(pitch) * Math.sin(yaw),

        Math.sin(pitch),

        Math.cos(pitch) * Math.cos(yaw)

    );

    target.add(camera.position);

    camera.lookAt(target);

}
