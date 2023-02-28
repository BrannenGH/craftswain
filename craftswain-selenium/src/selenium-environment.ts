import TestEnvironment from 'jest-environment-node';
import { Builder, Browser, By, Key, until, WebDriver, WebElement, Locator } from 'selenium-webdriver';
import { Logger } from 'winston';
import CraftswainEnvironment from 'craftswain';
import { CraftswainGlobal } from 'craftswain/out/global';

// my-custom-environment

const WebElementOverrides: (logger?: Logger) => ProxyHandler<WebElement> = (logger?: Logger) => ({
  get(target, p, reciever) {
    logger?.log("info", `Executing ${(p as symbol)?.description ?? String(p)}`);
    
    return Reflect.get(target, p, reciever);
  }
});

const WebDriverOverrides: (logger?: Logger) => ProxyHandler<WebDriver> = (logger?: Logger) => ({
  get(target, p, reciever) {
    // If find element executed on target
    if (p === 'findElement') {
      // Setup a new proxy for findElement
      return new Proxy(
        Reflect.get(target, p, reciever), 
        {
          apply: (target, caller, args) => {

            return target
              .apply(caller, args as [locator: Locator])
              .then((element) => new Proxy(element, WebElementOverrides(logger)));
          }
        });
    }
     
    return Reflect.get(target, p, reciever);
  }
});

export class SeleniumEnvironment extends CraftswainEnvironment {
  declare global: Global & CraftswainGlobal & { webDriver: WebDriver };

  constructor(config: any, context: any) {
    super(config, context);
  }

  async setup() {
    await super.setup();
    const driver = (await new Builder().forBrowser(Browser.CHROME).build());
    const driverProxy = new Proxy(driver, WebDriverOverrides(this.global.logger));
    this.global.webDriver = driverProxy;
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