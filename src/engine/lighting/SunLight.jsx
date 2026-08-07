export default function SunLight() {
  return (
    <directionalLight
      castShadow
      intensity={2}
      position={[20, 30, 10]}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
    />
  );
}