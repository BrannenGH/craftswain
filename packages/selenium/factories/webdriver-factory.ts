import {
  Builder,
  Browser,
  Capabilities,
  ThenableWebDriver,
} from "selenium-webdriver";
import { FileDetector } from "selenium-webdriver/remote";
import { ServiceBuilder } from "selenium-webdriver/chrome";
import debug from "../debug";
import { SeleniumConfig } from "../config/selenium-config";

const buildLocalDriver = (config: SeleniumConfig) => {
  debug("Building local webdriver");
  const service = new ServiceBuilder();

  if (config.local?.webdriverPath) {
    debug('Using WebDriver path "%s" .', config.local?.webdriverPath);
    service.setPath(config.local?.webdriverPath);
  } else {
    debug("Using WebDriver default resolution rules.");
  }

  return new Builder()
    .setChromeService(service)
    .forBrowser(Browser.CHROME)
    .build();
};

const buildRemoteDriver = (config: SeleniumConfig) => {
  debug("Building remote webdriver");
  debug("Connecting to URI %s", config.remote?.uri);

  const driver = new Builder()
    .usingServer(config.remote?.uri ?? "")
    .withCapabilities(Capabilities.chrome)
    .forBrowser(Browser.CHROME)
    .build();
  driver.setFileDetector(new FileDetector());

  return driver;
};

export const buildWebdriver = (config: SeleniumConfig) => {
  let driver: ThenableWebDriver;

  if (config.local) {
    driver = buildLocalDriver(config);
  } else if (config.remote) {
    driver = buildRemoteDriver(config);
  } else {
    debug(
      "Error: Couldn't parse configuration: config.local and config.remote were undefined."
    );
    throw new Error("Couldn't parse configuration");
  }

  const driverProxy = driver;

  return driverProxy;
};
