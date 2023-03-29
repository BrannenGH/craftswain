import debug from "../debug";
import { getFromStore, setToStore, TestStore } from ".";
import { CraftswainConfig } from "../config";

export const useStore = (config?: CraftswainConfig) => {
  const store = new TestStore(config);

  return [
    (...args) => store.get(...args),
    (...args) => store.set(...args),
    (...args) => store.cleanup(...args),
  ] as [getFromStore, setToStore, () => Promise<void>];
};
