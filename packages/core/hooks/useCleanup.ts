import CraftswainStore from "../index";

export const useCleanup = (cleanupHandle: () => Promise<void>) => {
    CraftswainStore.cleanupHandles.push(cleanupHandle);
}
