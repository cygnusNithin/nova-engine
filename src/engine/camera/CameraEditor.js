import { updateCameraRotation } from "./CameraRotation";
import { updateCameraMovement } from "./CameraMovement";

export function updateEditorCamera(camera, keyboard, mouse, editor, delta) {
  const speed = keyboard.ShiftLeft
    ? editor.cameraSpeed * 2
    : editor.cameraSpeed;

  // ------------------------------------------------------------
  // ROTATION
  // ------------------------------------------------------------

  updateCameraRotation(camera, mouse, editor.mouseSensitivity);

  // ------------------------------------------------------------
  // MOVEMENT
  // ------------------------------------------------------------

  updateCameraMovement(camera, keyboard, speed, delta, true);
}
