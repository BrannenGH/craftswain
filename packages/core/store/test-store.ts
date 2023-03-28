import { createRequire } from "module";
import {
  CraftswainPlugin,
  StoreConfiguration,
  TestObject,
  TestObjects,
} from ".";
import { CraftswainConfig } from "../config";
import debug from "../debug";

export class TestStore {
  private testObjects: TestObjects<unknown> = {};

  constructor(private config?: CraftswainConfig) {
    if (config) {
      this.buildStore(config);
    }
  }

  private buildStore(config: CraftswainConfig) {
    if (config.testObjects && config.rootDirectory) {
      config.testObjects?.forEach((testObjConfig) => {
        const targetRequire = createRequire(config.rootDirectory as string);

        const resolved = targetRequire.resolve(testObjConfig.type);
        const instance = targetRequire(resolved) as {
          default: CraftswainPlugin;
        };

        instance.default(
          (...args) => this.set(...args),
          testObjConfig,
          /* TODO: */ {}
        );
      });
    }
  }

  /**
   * Registers an object to be used in the test environment.
   *
   * @param registerHandle Registers an object to be used in the test environment.
   * @param cleanupHandle Registers a method to cleanup the object.
   */
  public set<T>(
    name: string,
    obj: T,
    configure?: (configure: StoreConfiguration<T>) => void
  ) {
    debug("Registering %s with value %j", name, obj);

    this.testObjects[name] = new TestObject(
      obj,
      configure
    ) as unknown as TestObject<unknown>;
  }

  /**
   * Grabs a reference to a test object with the following name.
   *
   * @param name The name of the test object.
   * @returns A promise for the test object
   */
  public get<T>(name: string) {
    return this.testObjects[name].object as T;
  }
}
