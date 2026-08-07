import { useFrame, useThree } from "@react-three/fiber";

import useEngineStore from "../../store/engineStore";

import CameraManager from "./CameraManager";

export default function CameraController() {

    const { camera } = useThree();

    const keyboard = useEngineStore(state => state.keyboard);
    const mouse = useEngineStore(state => state.mouse);
    const editor = useEngineStore(state => state.editor);
    const consumeMouseMotion = useEngineStore(
        state => state.consumeMouseMotion
    );

    useFrame((_, delta) => {

        CameraManager(

            camera,

            keyboard,

            mouse,

            editor,

            delta

        );

        if (mouse.deltaX || mouse.deltaY || mouse.wheel) {
            consumeMouseMotion();
        }

    });

    return null;

}
