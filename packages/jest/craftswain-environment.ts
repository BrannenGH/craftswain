import TestEnvironment from "jest-environment-node";
import Winston from "winston";
import { EnvironmentContext, JestEnvironmentConfig } from "@jest/environment";
import { CraftswainConfig } from "./config/craftswain-config";
import { loadConfig, Store, useStore } from "@craftswain/core";
import { join } from "node:path";
import { createRequire } from "module";
import { Global } from "@jest/types";

export class CraftswainEnvironment extends TestEnvironment {
  declare global: Global.Global;
  config: CraftswainConfig;
  testPath: any;
  docblockPragmas: any;
  private testStore?: Store;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.config = config as CraftswainConfig;
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

  async setup() {
    await super.setup();

    const testStore = useStore();
    this.testStore = testStore;
    this.global.testStore = testStore;

    const craftswainConfig = await loadConfig(
      join(this.config.projectConfig.rootDir, "craftswain.config.yaml")
    );

    craftswainConfig.testObjects.forEach((config) => {
      const targetRequire = createRequire(this.config.projectConfig.rootDir);

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

  async handleTestEvent(event: any, state: any) {
    if (event.name === "test_start") {
      // ...
    }
  }
}
