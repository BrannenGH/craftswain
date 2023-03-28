import debug from "../debug";
import { StoreAccess, TestStore } from ".";
import { CraftswainConfig } from "../config";

export const useStore = (config?: CraftswainConfig) => {
  const store = new TestStore(config);

  return [
    (...args) => store.get(...args),
    (...args) => store.set(...args),
  ] as StoreAccess;
};
