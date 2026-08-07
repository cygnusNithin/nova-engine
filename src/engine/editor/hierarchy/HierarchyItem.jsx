import EditorSelection from "../selection/EditorSelection";

export default function HierarchyItem({ entity }) {
  return (
    <div onClick={() => EditorSelection.selectEntity(entity)}>
      {entity.name}
    </div>
  );
}
