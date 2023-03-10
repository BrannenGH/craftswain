import TestEnvironment from "jest-environment-node";
import Winston from "winston";
import { EnvironmentContext, JestEnvironmentConfig } from "@jest/environment";
import { loadJSConfig, Store, useStore } from "@craftswain/core";
import { createRequire } from "module";
import { Global } from "@jest/types";

export class CraftswainEnvironment extends TestEnvironment {
  declare global: Global.Global;
  jestConfig: JestEnvironmentConfig;
  private testStore?: Store;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.jestConfig = config;
  }

  async setup() {
    await super.setup();

    const testStore = useStore();
    this.testStore = testStore;
    this.global.testStore = testStore;

    const craftswainConfig = await loadJSConfig(
      this.jestConfig.projectConfig.rootDir
    );

    craftswainConfig.testObjects.forEach((config) => {
      const targetRequire = createRequire(
        this.jestConfig.projectConfig.rootDir
      );

      const resolved = targetRequire.resolve(config.type);
      const instance = targetRequire(resolved);

      instance.default(testStore, config);
    });

    this.global.logger = Winston.createLogger({
      level: "debug",
      format: Winston.format.simple(),
      transports: [new Winston.transports.Console()],
    });

    testStore.allKeys().forEach((item) => {
      Object.defineProperty(this.global, item, {
        get: () => testStore.get(item),
      });
    });
  }

  async teardown() {
    await Promise.all(
      this.testStore
        ?.allKeys()
        .map((key) => this.testStore?.cleanup(key) ?? Promise.resolve()) ?? []
    );

    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }

  async handleTestEvent(/*event: unknown, state: unknown*/) {
    return;
  }
}
