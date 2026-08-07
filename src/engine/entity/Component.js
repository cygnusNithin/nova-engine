export default class Component {

    constructor(type = "Component") {

        this.type = type;

        this.enabled = true;

        this.started = false;

        this.entity = null;

    }

    onAttach(entity) {

        this.entity = entity;

    }

    onDetach() {

        this.entity = null;

    }

    start() {}

    update() {}

    lateUpdate() {}

    fixedUpdate() {}

    destroy() {}

}