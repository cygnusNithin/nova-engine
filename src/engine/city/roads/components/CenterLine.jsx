export default function CenterLine() {
  return (
    <mesh
      name="Road_CenterLine"
      position={[0, 0.02, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      userData={{
        ignoreRaycast: false,
      }}
    >
      <planeGeometry args={[20, 0.15]} />

      <meshStandardMaterial color="#ffd400" />
    </mesh>
  );
}
