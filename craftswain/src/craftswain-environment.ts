import TestEnvironment from 'jest-environment-node';
import Winston from 'winston';
import type { Global } from '@jest/types';
import { CraftswainGlobal } from './global';

export class CraftswainEnvironment extends TestEnvironment {
  declare global: Global & CraftswainGlobal;
  testPath: any;
  docblockPragmas: any;

  constructor(config: any, context: any) {
    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

  async setup() {
    await super.setup();
    
    this.global.logger = Winston.createLogger({
      level: 'info',
      format: Winston.format.simple(),
      transports: [
        new Winston.transports.Console()
      ],
    });

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
