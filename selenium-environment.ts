import TestEnvironment from 'jest-environment-node';
import { Builder, Browser, By, Key, until } from 'selenium-webdriver';
import { IWebDriver } from 'selenium-webdriver/lib/webdriver';

// my-custom-environment

class SeleniumEnvironment extends TestEnvironment {
  testPath: any;
  docblockPragmas: any;

  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

  async setup() {
    await super.setup();
    const driver = (await new Builder().forBrowser(Browser.CHROME).build()) as IWebDriver;
    (this.global as any).webdriver = driver;
    await driver.get('http://the-internet.herokuapp.com/');

    // Will trigger if docblock contains @my-custom-pragma my-pragma-value
    /*if (this.docblockPragmas['my-custom-pragma'] === 'my-pragma-value') {
      // ...
    }*/
  }

  async teardown() {
    (this.global as any).webdriver.quit();
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }

  async handleTestEvent(event, state) {
    if (event.name === 'test_start') {
      // ...
    }
  }
}

module.exports = SeleniumEnvironment;