export default function Sidewalk({ x = 0 }) {
  return (
    <mesh
      name="Road_Sidewalk"
      position={[x, 0.05, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      userData={{
        ignoreRaycast: false,
      }}
    >
      <planeGeometry args={[20, 1]} />

      <meshStandardMaterial color="#bdbdbd" />
    </mesh>
  );
}
