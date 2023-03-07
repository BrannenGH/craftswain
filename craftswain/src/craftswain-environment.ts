import TestEnvironment from 'jest-environment-node';
import Winston from 'winston';
import { CraftswainGlobal } from './global/craftswain-global';
import { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import { CraftswainConfig } from "./config/craftswain-config";
import { loadConfig } from './index';

export class CraftswainEnvironment<ChildConfig = {}, ChildGlobal = {}> extends TestEnvironment {
  declare global: ChildGlobal & CraftswainGlobal;
  config: ChildConfig & CraftswainConfig;
  testPath: any;
  docblockPragmas: any;
  modules: TestEnvironment[] = [];

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

    const modules = await Promise.all(
      this.config.modules.map(async module => {
        var moduleType = await import(module);
        return new moduleType(this.config, this.context);
      })
    );

    this.modules.concat(modules);

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

    await Promise.all(
      this.modules.map(module => module.setup())
    );
  }

  async teardown() {
    await Promise.all(
      this.modules.map(module => module.teardown())
    );

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
