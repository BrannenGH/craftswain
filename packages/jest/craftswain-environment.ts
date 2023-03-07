import TestEnvironment from 'jest-environment-node';
import Winston from 'winston';
import { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import { CraftswainConfig } from "./config/craftswain-config";
import CraftswainGlobal, { loadConfig } from '@craftswain/core';
import { join } from 'node:path';
import { createRequire } from 'module';
import { Global } from '@jest/types';

export class CraftswainEnvironment<ChildConfig = {}, ChildGlobal = {}> extends TestEnvironment {
  declare global: Global.Global;
  config: ChildConfig & CraftswainConfig;
  testPath: any;
  docblockPragmas: any;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.config = config as ChildConfig & CraftswainConfig;
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

  async setup() {
    await super.setup();

    this.config = {...this.config, ...await loadConfig(
      join(this.config.projectConfig.rootDir, "craftswain.config.yaml")
    )};

    await Promise.all(this.config.modules.map(async module => {
        const targetRequire = createRequire(this.config.projectConfig.rootDir);

        const resolved = targetRequire.resolve(module);
        const instance = targetRequire(resolved);

        await instance.default(this);
      })
    );

    this.global.logger = Winston.createLogger({
      level: 'debug',
      format: Winston.format.simple(),
      transports: [
        new Winston.transports.Console()
      ],
    });

    Object.assign(this.global, CraftswainGlobal.testObjects);
  }

  async teardown() {
    await Promise.all(
      CraftswainGlobal.cleanupHandles.map(x => x())
    );

    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }

  async handleTestEvent(event: any, state: any) {
    if (event.name === 'test_start') {
      // ...
    }
  }
}

