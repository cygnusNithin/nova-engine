import useEngineStore from "../../../store/engineStore";

import { EventBus, EngineEvents } from "../../events";

function selectEntity(entity) {
  const selected = useEngineStore.getState().editor.selectedEntity;

  if (selected === entity) return;

  useEngineStore.getState().setSelectedEntity(entity);

  EventBus.emit(EngineEvents.ENTITY_SELECTED, entity);
}

function clearSelection() {
  useEngineStore.getState().clearSelection();

  EventBus.emit(EngineEvents.ENTITY_DESELECTED);
}

function toggleSelection(entity) {
  if (isSelected(entity)) {
    clearSelection();

    return;
  }

  selectEntity(entity);
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
