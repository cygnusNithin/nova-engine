class MaterialManager {

    constructor() {

        this.materials = new Map();

    }

    add(name, material) {

        this.materials.set(name, material);

    }

    get(name) {

        return this.materials.get(name);

    }

    has(name) {

        return this.materials.has(name);

    }

}

export default new MaterialManager();