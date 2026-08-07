import GridHelper from "./GridHelper";
import AxesHelper from "./AxesHelper";
import DebugEntity from "./DebugEntity";
import DebugSettings from "./DebugSettings";

export default function DebugWorld() {

    return (

        <>

            {DebugSettings.showGrid && <GridHelper />}

            {DebugSettings.showAxis && <AxesHelper />}

            {DebugSettings.spawnTestObjects && <DebugEntity />}

        </>

    );

}