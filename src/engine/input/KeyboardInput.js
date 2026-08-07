import useEngineStore from "../../store/engineStore";

export default function initializeKeyboardInput() {

    const { setKeyboard } = useEngineStore.getState();

    const keyboard = {};

    const onKeyDown = (event) => {

        keyboard[event.code] = true;

        setKeyboard({ ...keyboard });

    };

    const onKeyUp = (event) => {

        keyboard[event.code] = false;

        setKeyboard({ ...keyboard });

    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
    };

}
