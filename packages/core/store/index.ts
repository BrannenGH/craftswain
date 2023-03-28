import { CraftswainConfig, TestObjectConfig } from "../config";
import { TestObject } from "./test-object";

export * from "./test-object";
export * from "./test-store";
export * from "./use-store";

// Public facing API

/**
 * The type for the default export for a plugin.
 */
export type CraftswainPlugin = (
  set: setToStore,
  config: TestObjectConfig,
  dependencies: { [key: string]: () => unknown }
) => void;

/**
 * Configure how craftswain manages the test object.
 */
export type StoreConfiguration<T> = {
  /**
   * Add a function to be ran on object cleanup.
   * @param object The test object
   */
  onCleanup: (cleanupFunction: (object: T) => Promise<void> | void) => void;
};

/**
 * Get an object from the store.
 */
type getFromStore = <T>(key: string) => T;

/**
 * Set an object to the store.
 */
type setToStore = <T>(
  name: string,
  obj: T,
  configure?: (configure: StoreConfiguration<T>) => void
) => void;

export type StoreAccess = [
  /**
   * Grabs a reference to a test object with the following name.
   *
   * @param name The name of the test object.
   * @returns A promise for the test object
   */
  get: getFromStore,

  /**
   * Registers an object to be used in the test environment.
   *
   * @param registerHandle Registers an object to be used in the test environment.
   * @param cleanupHandle Registers a method to cleanup the object.
   */
  set: setToStore
];

/**
 * Handle used to register a test object.
 *
 * Each test object is assumed to have it's own unique key.
 */
export type TestObjects<T> = { [key: string]: TestObject<T> };
