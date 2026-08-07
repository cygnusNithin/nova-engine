import EngineContext from "./EngineContext";
import EngineConfig from "./EngineConfig";

export default function EngineProvider({ children }) {
  const engine = {
    config: EngineConfig,
  };

  return (
    <EngineContext.Provider value={engine}>
      {children}
    </EngineContext.Provider>
  );
}