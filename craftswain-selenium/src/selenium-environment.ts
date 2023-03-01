import { Builder, Browser, WebDriver, Capabilities } from 'selenium-webdriver';
import { FileDetector } from 'selenium-webdriver/remote';
import CraftswainEnvironment from 'craftswain';
import { webDriverOverrides } from './overrides/web-driver';

// my-custom-environment

export type SeleniumEnvironmentConfig = {webDriver: WebDriver};

export class SeleniumEnvironment extends CraftswainEnvironment<SeleniumEnvironmentConfig> {
  constructor(config: any, context: any) {
    super(config, context);
  }

  async setup() {
    await super.setup();
    this.global.logger?.log("info", "starting webdriver");
    const driver = (await new Builder()
      .usingServer("http://selenium:4444/")
      .withCapabilities(Capabilities.chrome)
      .forBrowser(Browser.CHROME)
      .build());
    driver.setFileDetector(new FileDetector);  

    const driverProxy = new Proxy(driver, webDriverOverrides(this.global.logger));
    this.global.webDriver = driverProxy;
    await driver.get('http://the-internet.herokuapp.com/');

    // Will trigger if docblock contains @my-custom-pragma my-pragma-value
    /*if (this.docblockPragmas['my-custom-pragma'] === 'my-pragma-value') {
      // ...
    }*/
  }

  async teardown() {
    this.global.webDriver?.quit();
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