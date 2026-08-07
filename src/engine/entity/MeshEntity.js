import * as THREE from "three";

import Entity from "./Entity";
import MeshComponent from "./MeshComponent";

export default class MeshEntity extends Entity {

    constructor(

        name = "Mesh",

        geometry,

        material

    ) {

        super(

            name,

            "Mesh"

        );

        const mesh = new THREE.Mesh(

            geometry,

            material

        );

        mesh.castShadow = true;

        mesh.receiveShadow = true;

        mesh.userData.entity = this;

        this.setObject(mesh);

        this.addComponent(

            new MeshComponent(mesh)

        );

    }

}