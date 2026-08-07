import Component from "./Component";

export default class ScriptComponent extends Component {

    constructor(script = () => {}) {

        super("Script");

        this.script = script;

    }

    start() {

        if (this.script.start)
            this.script.start();

    }

    update(delta) {

        if (!this.enabled)
            return;

        if (this.script.update)
            this.script.update(delta);

    }

}