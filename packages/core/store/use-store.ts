import debug from "../debug";
import { TestStore } from "./test-store";

/**
 * Handle used to register a test object.
 *
 * Each test object is assumed to have it's own unique key.
 */
type TestObjects<T> = { [key: string]: PromiseLike<T> };

/**
 * Registers an object to be used in the test environment.
 *
 * @param registerHandle Registers an object to be used in the test environment.
 * @param cleanupHandle Registers a method to cleanup the object.
 */
type SetTestObject<T> = (
  registerHandle: TestObjects<T>,
  cleanupHandle?: CleanupHandle<T>
) => void;

/**
 * Grabs a reference to a test object with the following name.
 *
 * @param name The name of the test object.
 * @returns A promise for the test object
 */
type GetTestObject = (key: string) => PromiseLike<any>;

/**
 * Handle used to cleanup a test object.
 *
 * @param testObj Test object to clean up.
 */
type CleanupHandle<T> = (testObj: PromiseLike<T>) => PromiseLike<void>;

const setTestObject =
  (store: TestStore) =>
  <T>(
    testObjects: TestObjects<T>,
    // use LazyPromise
    cleanupHandle?: CleanupHandle<T>
  ) => {
    debug("Registering test objects %j", testObjects);

    Object.assign(store.testObjects, testObjects);
  };

const getTestObject = (store: TestStore) => (name: string) =>
  store.testObjects[name];

export const useTestStore: () => [
  get: GetTestObject,
  set: SetTestObject<any>
] = () => {
  const store = new TestStore();

  return [getTestObject(store), setTestObject(store)];
};
