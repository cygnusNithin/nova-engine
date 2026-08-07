import * as THREE from "three";

const direction = new THREE.Vector3();
const forward = new THREE.Vector3();
const right = new THREE.Vector3();

export function updateCameraMovement(
    camera,
    keyboard,
    speed,
    delta
) {

    direction.set(0,0,0);

    camera.getWorldDirection(forward);

    forward.y = 0;

    forward.normalize();

    right.crossVectors(
        forward,
        camera.up
    ).normalize();

    if (keyboard.KeyW)
        direction.add(forward);

    if (keyboard.KeyS)
        direction.sub(forward);

    if (keyboard.KeyA)
        direction.sub(right);

    if (keyboard.KeyD)
        direction.add(right);

    if (keyboard.Space)
        direction.y += 1;

    if (keyboard.ControlLeft)
        direction.y -= 1;

    if (direction.lengthSq() > 0)
        direction.normalize();

    camera.position.addScaledVector(
        direction,
        speed * delta * 60
    );

}