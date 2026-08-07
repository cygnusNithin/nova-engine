import Component from "./Component";

export default class CameraComponent extends Component {

    constructor(camera = null) {

        super("Camera");

        this.camera = camera;

    }

    setCamera(camera) {

        this.camera = camera;

    }

    getCamera() {

        return this.camera;

    }

}