import { Sky } from "@react-three/drei";

export default function SkyComponent() {
  return (
    <Sky
      distance={450000}
      sunPosition={[5, 1, 8]}
      inclination={0.49}
      azimuth={0.25}
      onUpdate={(self) => {
        self.userData.ignoreRaycast = true;
      }}
    />
  );
}
