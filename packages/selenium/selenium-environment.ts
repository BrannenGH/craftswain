import { WebDriver } from 'selenium-webdriver';
import CraftswainEnvironment from '@craftswain/core';
import { buildWebdriver } from './factories/webdriver-factory';
import { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import { SeleniumConfig } from './config/selenium-config';

export class SeleniumEnvironment<ExtendedConfig = {}> extends CraftswainEnvironment<{selenium: SeleniumConfig} & ExtendedConfig> {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
  }

  async setup() {
    await super.setup();
    this.global.logger?.log("info", "starting webdriver");

    var values = await Promise.all(this.config.selenium.webdrivers.map(async x => {
      const driver = await buildWebdriver(
          x,
          this.global.logger
      );

      if (!driver) {
        throw new Error("Could not create webdriver.");
      }
      
      const uri = x.uri ?? "https://google.com";
      this.global.logger?.log("info", `Going to URI ${uri}`);
      await driver?.get(uri);
      this.global.logger?.log("info", `Went to URI ${uri}`);

      return {name: x.name ?? "webDriver", driver: driver};
    }));

    this.global.logger?.log("info", values);

    values.forEach(value => {
      if (!!value && !this.global[value?.name]) {
        this.global.logger?.log("info", `Creating driver for ${value.name}`);
        this.global[value.name] = value.driver;
      }
    });

    // Will trigger if docblock contains @my-custom-pragma my-pragma-value
    /*if (this.docblockPragmas['my-custom-pragma'] === 'my-pragma-value') {
      // ...
    }*/
  }

  async teardown() {
    const webdrivers = this.config.selenium.webdrivers?.map(x => x.name ?? "webDriver");

    webdrivers.forEach(async x => {
      this.global.logger?.log("debug", "", this.global);
      await (this.global[x] as WebDriver)?.quit();
    });


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
