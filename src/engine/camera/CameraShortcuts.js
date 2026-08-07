import CameraModes from "./CameraModes";
import useEngineStore from "../../store/engineStore";

export default function initializeCameraShortcuts() {

    const onKeyDown = (event) => {

        const { setEditor } = useEngineStore.getState();

        switch (event.code) {

            case "Digit1":

                setEditor({
                    mode: CameraModes.EDITOR,
                });

                console.log("Editor Camera");

                break;

            case "Digit2":

                setEditor({
                    mode: CameraModes.ORBIT,
                });

                console.log("Orbit Camera");

                break;

            case "Digit3":

                setEditor({
                    mode: CameraModes.FIRST_PERSON,
                });

                console.log("First Person");

                break;

            case "Digit4":

                setEditor({
                    mode: CameraModes.THIRD_PERSON,
                });

                console.log("Third Person");

                break;

            case "Digit5":

                setEditor({
                    mode: CameraModes.CINEMATIC,
                });

                console.log("Cinematic Camera (Coming Soon)");

                break;

            default:
                break;
        }

    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
        window.removeEventListener("keydown", onKeyDown);
    };

}
