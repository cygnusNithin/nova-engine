import * as THREE from "three";

export function createRoadMaterial() {
  return new THREE.MeshStandardMaterial({
    color: "#3a3a3a",
    roughness: 0.95,
    metalness: 0.05,
  });
}

export function createGrassMaterial() {
  return new THREE.MeshStandardMaterial({
    color: "#4d8b31",
    roughness: 1,
    metalness: 0,
  });
}

export function createBuildingMaterial() {
  return new THREE.MeshStandardMaterial({
    color: "#c8c8c8",
    roughness: 0.7,
    metalness: 0.1,
  });
}

export function createGlassMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: "#dff5ff",
    transparent: true,
    transmission: 0.95,
    roughness: 0,
    metalness: 0,
  });
}