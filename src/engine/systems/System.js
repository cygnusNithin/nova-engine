export default class System {

    constructor(name = "System") {

        this.name = name;

        this.enabled = true;

        this.started = false;

        this.world = null;

    }

    //--------------------------------------------------
    // World
    //--------------------------------------------------

    initialize(world) {

        this.world = world;

    }

    destroy() {}

    //--------------------------------------------------
    // Lifecycle
    //--------------------------------------------------

    start() {}

    update(delta) {}

    lateUpdate(delta) {}

    fixedUpdate(delta) {}

}