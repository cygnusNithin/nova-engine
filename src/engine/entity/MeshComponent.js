import Component from "./Component";

export default class MeshComponent extends Component {
  constructor(mesh = null) {
    super("Mesh");

    this.mesh = mesh;
  }

  onAttach(entity) {
    super.onAttach(entity);
  }

  onDetach() {
    super.onDetach();
  }

  setMesh(mesh) {
    this.mesh = mesh;
  }

  getMesh() {
    return this.mesh;
  }
}
