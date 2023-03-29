import { TestObject } from "./test-object";

export * from "./test-object";
export * from "./test-store";
export * from "./use-store";

// Public facing API

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
export type getFromStore = <T>(key: string) => T;

/**
 * Set an object to the store.
 */
export type setToStore = <T>(
  name: string,
  obj: T,
  configure?: (configure: StoreConfiguration<T>) => void
) => void;

/**
 * Handle used to register a test object.
 *
 * Each test object is assumed to have it's own unique key.
 */
export type TestObjects<T> = { [key: string]: TestObject<T> };
