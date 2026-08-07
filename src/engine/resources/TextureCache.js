class TextureCache {

    constructor() {

        this.cache = new Map();

    }

    add(key, texture) {

        this.cache.set(key, texture);

    }

    get(key) {

        return this.cache.get(key);

    }

    has(key) {

        return this.cache.has(key);

    }

}

export default new TextureCache();