import { Builder, Browser, Capabilities } from "selenium-webdriver";
import { FileDetector } from "selenium-webdriver/remote";
import { ServiceBuilder } from "selenium-webdriver/chrome";
import { Logger } from "winston";
import { WebDriverConfig } from "../config/selenium-config";
import { webDriverOverrides } from "../overrides/web-driver";
import debug from "../debug";

export const buildWebdriver = async (
  config: WebDriverConfig,
  logger?: Logger
) => {
  if (config.local) {
    debug("Building local webdriver");
    const service = new ServiceBuilder();

    if (config.local?.webdriverPath) {
      debug('Using WebDriver path "%s" .', config.local.webdriverPath);
      service.setPath(config.local.webdriverPath);
    } else {
      debug("Using WebDriver default resolution rules.");
    }

    const driver = await new Builder()
      .setChromeService(service)
      .forBrowser(Browser.CHROME)
      .build();

    return driver;
  } else if (config.remote) {
    debug("Building remote webdriver");
    debug("Connecting to URI %s", config.remote.uri);

    const driver = await new Builder()
      .usingServer(config.remote.uri ?? "")
      .withCapabilities(Capabilities.chrome)
      .forBrowser(Browser.CHROME)
      .build();
    driver.setFileDetector(new FileDetector());

    const driverProxy = new Proxy(driver, webDriverOverrides(logger));
    return driverProxy;
  }
};
