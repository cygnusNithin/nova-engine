export default function Asphalt() {
  return (
    <mesh
      name="Road_Asphalt"
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      userData={{
        ignoreRaycast: false,
      }}
    >
      <planeGeometry args={[20, 6]} />

      <meshStandardMaterial color="#2d2d2d" />
    </mesh>
  );
}
