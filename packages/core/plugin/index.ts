import { setToStore } from "../store";
import { TestObjectConfig } from "../config";

export * from "./load-plugin";

/**
 * The type for the default export for a plugin.
 */
export type CraftswainPlugin = (
  set: setToStore,
  config: TestObjectConfig,
  dependencies: { [key: string]: () => unknown }
) => void;
