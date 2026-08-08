import useEngineStore from "../../../store/engineStore";

import { EventBus, EngineEvents } from "../../events";

import GizmoController from "../gizmos/GizmoController";

function selectEntity(entity) {
  /*
   * A transform operation owns the current selection.
   *
   * This protects:
   *
   * - viewport selection
   * - hierarchy selection
   * - inspector-driven selection
   */
  if (GizmoController.isTransforming()) {
    return false;
  }

  const selected = useEngineStore.getState().editor.selectedEntity;

  if (selected === entity) {
    return true;
  }

  useEngineStore.getState().setSelectedEntity(entity);

  EventBus.emit(EngineEvents.ENTITY_SELECTED, entity);

  return true;
}

function clearSelection() {
  if (GizmoController.isTransforming()) {
    return false;
  }

  useEngineStore.getState().clearSelection();

  EventBus.emit(EngineEvents.ENTITY_DESELECTED);

  return true;
}

function toggleSelection(entity) {
  if (GizmoController.isTransforming()) {
    return false;
  }

  if (isSelected(entity)) {
    clearSelection();

    return true;
  }

  selectEntity(entity);

  return true;
}

function getSelectedEntity() {
  return useEngineStore.getState().editor.selectedEntity;
}

function isSelected(entity) {
  return getSelectedEntity() === entity;
}

export default {
  selectEntity,
  clearSelection,
  toggleSelection,
  getSelectedEntity,
  isSelected,
};
