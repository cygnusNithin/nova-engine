import { useEffect } from "react";

export default function PointerLock() {

    useEffect(() => {

        const canvas = document.querySelector("canvas");

        if (!canvas)
            return;

        const handleMouseDown = (event) => {

            // Left Mouse Button enters Pointer Lock
            if (event.button === 0) {

                if (document.pointerLockElement !== canvas) {

                    canvas.requestPointerLock();

                }

            }

        };

        canvas.addEventListener(
            "mousedown",
            handleMouseDown
        );

        return () => {

            canvas.removeEventListener(
                "mousedown",
                handleMouseDown
            );

        };

    }, []);

    return null;

}