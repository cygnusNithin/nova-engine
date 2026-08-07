import AmbientLight from "./AmbientLight";
import SunLight from "./SunLight";

export default function LightingManager() {
  return (
    <>
      <AmbientLight />
      <SunLight />
    </>
  );
}