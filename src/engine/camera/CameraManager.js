import CameraModes from "./CameraModes";

import { updateEditorCamera } from "./CameraEditor";
import { updateOrbitCamera } from "./OrbitCamera";
import updateFirstPersonCamera from "./FirstPersonCamera";
import updateThirdPersonCamera from "./ThirdPersonCamera";

export default function CameraManager(

    camera,

    keyboard,

    mouse,

    editor,

    delta

) {

    switch (editor.mode) {

        case CameraModes.EDITOR:

            updateEditorCamera(

                camera,

                keyboard,

                mouse,

                editor,

                delta

            );

            break;

        case CameraModes.ORBIT:

            updateOrbitCamera(

                camera,

                mouse,

                editor

            );

            break;

        case CameraModes.FIRST_PERSON:

            updateFirstPersonCamera(

                camera,

                keyboard,

                mouse,

                editor,

                delta

            );

            break;

        case CameraModes.THIRD_PERSON:

            updateThirdPersonCamera(

                camera

            );

            break;

        case CameraModes.CINEMATIC:

            // Coming Later

            break;

        default:

            updateEditorCamera(

                camera,

                keyboard,

                mouse,

                editor,

                delta

            );

            break;

    }

}