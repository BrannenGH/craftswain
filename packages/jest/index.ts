import { CraftswainEnvironment } from "./craftswain-environment";

declare const global: any;

/**
 * Retrieve a test object from the store.
 * @param name The test object to get.
 * @returns The test object.
 */
export const get = global.get as <T>(name: string) => PromiseLike<T>; 

export default CraftswainEnvironment;
