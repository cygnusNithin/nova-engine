import { updateCameraRotation } from "./CameraRotation";
import { updateCameraMovement } from "./CameraMovement";

export default function updateFirstPersonCamera(
    camera,
    keyboard,
    mouse,
    editor,
    delta
) {

    updateCameraRotation(
        camera,
        mouse,
        editor.mouseSensitivity
    );

    updateCameraMovement(
        camera,
        keyboard,
        editor.cameraSpeed * 0.6,
        delta
    );

}