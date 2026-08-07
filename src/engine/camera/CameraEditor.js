import { updateCameraRotation } from "./CameraRotation";
import { updateCameraMovement } from "./CameraMovement";

export function updateEditorCamera(
    camera,
    keyboard,
    mouse,
    editor,
    delta
) {

    const speed = keyboard.ShiftLeft
        ? editor.cameraSpeed * 2
        : editor.cameraSpeed;

    updateCameraRotation(
        camera,
        mouse,
        editor.mouseSensitivity
    );

    updateCameraMovement(
        camera,
        keyboard,
        speed,
        delta
    );

}