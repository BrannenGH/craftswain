import TestEnvironment from 'jest-environment-node';
import { Builder, Browser, By, Key, until } from 'selenium-webdriver';
import Winston from 'winston';
import CraftswainEnvironment from 'craftswain';

// my-custom-environment

export class SeleniumEnvironment extends CraftswainEnvironment {
  constructor(config: any, context: any) {
    super(config, context);
  }

  async setup() {
    await super.setup();
    const driver = (await new Builder().forBrowser(Browser.CHROME).build());
    (this.global as any).webDriver = driver;
    await driver.get('http://the-internet.herokuapp.com/');

    // Will trigger if docblock contains @my-custom-pragma my-pragma-value
    /*if (this.docblockPragmas['my-custom-pragma'] === 'my-pragma-value') {
      // ...
    }*/
  }

  async teardown() {
    (this.global as any).webDriver.quit();
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