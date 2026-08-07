class EventBus {

    constructor() {

        this.listeners = {};

    }

    //----------------------------------
    // Subscribe
    //----------------------------------

    on(event, callback) {

        if (!this.listeners[event]) {

            this.listeners[event] = [];

        }

        this.listeners[event].push(callback);

    }

    //----------------------------------
    // Remove Listener
    //----------------------------------

    off(event, callback) {

        if (!this.listeners[event])

            return;

        this.listeners[event] =

            this.listeners[event].filter(

                listener => listener !== callback

            );

    }

    //----------------------------------
    // Emit
    //----------------------------------

    emit(event, payload = null) {

        if (!this.listeners[event])

            return;

        this.listeners[event].forEach(listener =>

            listener(payload)

        );

    }

    //----------------------------------
    // Clear
    //----------------------------------

    clear() {

        this.listeners = {};

    }

}

export default new EventBus();