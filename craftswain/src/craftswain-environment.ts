import TestEnvironment from 'jest-environment-node';
import Winston from 'winston';
import { CraftswainGlobal } from './global/craftswain-global';
import { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import { readFile } from "fs/promises";
import { load as parseYaml } from "js-yaml";
import { CraftswainConfig } from "./config/craftswain-config";
import { join } from "node:path";
import { loadConfig } from './index';

export class CraftswainEnvironment<ChildConfig = {}, ChildGlobal = {}> extends TestEnvironment {
  declare global: ChildGlobal & CraftswainGlobal;
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

    // Eventually support JS

    this.config = {
      ...this.config,
      ...await loadConfig()
    };

    this.global.logger = Winston.createLogger({
      level: 'debug',
      format: Winston.format.simple(),
      transports: [
        new Winston.transports.Console()
      ],
    });

    this.global.logger?.log("debug", JSON.stringify(this.config, undefined, 2));

    // Will trigger if docblock contains @my-custom-pragma my-pragma-value
    /*if (this.docblockPragmas['my-custom-pragma'] === 'my-pragma-value') {
      // ...
    }*/
  }

  async teardown() {
    this.global.logger?.close();
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
