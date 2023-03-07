import { loadConfig } from "./config/load-config";
import { useCleanup } from "./hooks/useCleanup";
import { useRegister } from "./hooks/useRegister";
import { useTestEvent } from "./hooks/useTestEvent";

const CraftswainStore = {
    cleanupHandles: [] as (() => Promise<void>)[],
    testObjects: {} as  ({ [key: string]: Promise<any> }),
    testEventHandles: [] as ((event: any, state: any) => Promise<void>)[]
};

export {
    loadConfig,
    useCleanup,
    useRegister,
    useTestEvent
}

export default CraftswainStore;
