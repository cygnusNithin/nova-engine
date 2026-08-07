import * as THREE from "three";

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {

    console.log("Loading Started");

};

loadingManager.onLoad = () => {

    console.log("Loading Complete");

};

loadingManager.onError = (url) => {

    console.error(url);

};

export default loadingManager;