import Component from "./Component";
import SceneService from "../scene/SceneService";

export default class LightComponent extends Component {

    constructor(light = null) {

        super("Light");

        this.light = light;

    }

    onAttach(entity) {

        super.onAttach(entity);

        if (this.light)
            SceneService.add(this.light);

    }

    onDetach() {

        if (this.light)
            SceneService.remove(this.light);

        super.onDetach();

    }

    setLight(light) {

        this.light = light;

    }

    getLight() {

        return this.light;

    }

}