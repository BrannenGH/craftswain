import debug from "../debug";
import { TestObject, TestStore } from "./test-store";
import type { CleanupTestObject } from "./test-store";

const setTestObject =
  (store: TestStore) =>
  <T>(
    name: string,
    testObject: PromiseLike<T>,
    cleanupHandle?: (testObj: T) => PromiseLike<void>
  ) => {
    debug("Registering %s with value %j", name, testObject);
    store.testObjects[name] = new TestObject<T>(testObject, cleanupHandle);
  };

const getTestObject =
  <T>(store: TestStore) =>
  (name: string) =>
    store.testObjects[name].object as T;

const allKeys = (store: TestStore) => () => Object.keys(store.testObjects);

const cleanupTestObject: (
  store: TestStore
) => (name: string) => Promise<void> = (store: TestStore) => (name: string) =>
  store.testObjects[name].cleanup();

export type Store = {
  /**
   * Grabs a reference to a test object with the following name.
   *
   * @param name The name of the test object.
   * @returns A promise for the test object
   */
  get: <T>(key: string) => PromiseLike<T>;

  /**
   * Registers an object to be used in the test environment.
   *
   * @param registerHandle Registers an object to be used in the test environment.
   * @param cleanupHandle Registers a method to cleanup the object.
   */
  set: <T>(
    name: string,
    testObject: PromiseLike<T>,
    cleanupHandle?: CleanupTestObject<T>
  ) => void;
  cleanup: (name: string) => Promise<void>;
  allKeys: () => string[];
};

export const useStore: () => Store = () => {
  const store = new TestStore();

  return {
    get: getTestObject(store),
    set: setTestObject(store),
    cleanup: cleanupTestObject(store),
    allKeys: allKeys(store),
  };
};
