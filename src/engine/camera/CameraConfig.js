import CameraModes from "./CameraModes";

const CameraConfig = {

    mode: CameraModes.EDITOR,

    moveSpeed: 0.15,

    fastMoveSpeed: 0.35,

    mouseSensitivity: 0.002,

    maxPitch: Math.PI / 2 - 0.01,

    defaultFOV: 60,

    zoomSpeed: 2,

    smoothness: 0.15,

    near: 0.1,

    far: 5000,

};

export default CameraConfig;