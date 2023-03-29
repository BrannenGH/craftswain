import { setToStore, TestObject } from "../store";
import { TestObjectConfig } from "../config";

export * from "./load-plugin";

/**
 * The type for the default export for a plugin.
 */
export type CraftswainPlugin<T extends TestObjectConfig = TestObjectConfig> = (
  set: setToStore,
  config: T,
  dependencies: { [key: string]: () => unknown }
) => void;
