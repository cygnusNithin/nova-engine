import * as THREE from "three";

const states = new WeakMap();

function getState(camera) {
    let state = states.get(camera);

    if (state) {
        return state;
    }

    const direction = new THREE.Vector3();

    camera.getWorldDirection(direction);

    state = {
        yaw: Math.atan2(direction.x, direction.z),
        pitch: Math.asin(direction.y),
        target: new THREE.Vector3(),
    };

    states.set(camera, state);

    return state;
}

export function updateCameraRotation(
    camera,
    mouse,
    sensitivity
) {

    const state = getState(camera);

    // Left drag is reserved for selection and gizmo manipulation.
    if (!mouse.right)
        return;

    state.yaw -= mouse.deltaX * sensitivity;

    state.pitch -= mouse.deltaY * sensitivity;

    const limit = Math.PI / 2 - 0.01;

    state.pitch = Math.max(
        -limit,
        Math.min(limit, state.pitch)
    );

    state.target.set(

        Math.cos(state.pitch) * Math.sin(state.yaw),

        Math.sin(state.pitch),

        Math.cos(state.pitch) * Math.cos(state.yaw)

    );

    state.target.add(camera.position);

    camera.lookAt(state.target);

}
