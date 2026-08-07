class SystemManager {

    constructor() {

        this.systems = [];

    }

    //--------------------------------------------------
    // Register
    //--------------------------------------------------

    add(system) {

        this.systems.push(system);

    }

    remove(system) {

        this.systems = this.systems.filter(

            s => s !== system

        );

    }

    clear() {

        this.systems = [];

    }

    //--------------------------------------------------
    // Initialize
    //--------------------------------------------------

    initialize(world) {

        this.systems.forEach(system => {

            system.initialize(world);

        });

    }

    //--------------------------------------------------
    // Update
    //--------------------------------------------------

    update(delta) {

        this.systems.forEach(system => {

            if (!system.enabled)
                return;

            if (!system.started) {

                system.started = true;

                system.start();

            }

            system.update(delta);

        });

    }

    lateUpdate(delta) {

        this.systems.forEach(system => {

            if (system.enabled)

                system.lateUpdate(delta);

        });

    }

    fixedUpdate(delta) {

        this.systems.forEach(system => {

            if (system.enabled)

                system.fixedUpdate(delta);

        });

    }

    //--------------------------------------------------
    // Destroy
    //--------------------------------------------------

    destroy() {

        this.systems.forEach(system => {

            system.destroy();

        });

        this.clear();

    }

}

export default new SystemManager();