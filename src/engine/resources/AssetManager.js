import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class AssetManager {

    constructor() {

        this.loader = new GLTFLoader();

        this.models = new Map();

    }

    async loadModel(path) {

        if (this.models.has(path)) {

            return this.models.get(path);

        }

        return new Promise((resolve, reject) => {

            this.loader.load(

                path,

                (gltf) => {

                    this.models.set(path, gltf);

                    resolve(gltf);

                },

                undefined,

                reject

            );

        });

    }

}

export default new AssetManager();