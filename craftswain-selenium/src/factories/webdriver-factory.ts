import { Builder, Browser, WebDriver, Capabilities } from 'selenium-webdriver';
import { FileDetector } from 'selenium-webdriver/remote';
import { ServiceBuilder } from 'selenium-webdriver/chrome';
import { Logger } from 'winston';
import { WebDriverConfig } from '../config/selenium-config';
import { webDriverOverrides } from '../overrides/web-driver';

export const buildWebdriver = async (config: WebDriverConfig, logger?: Logger) => {
  if (config.local) {
    const service = new ServiceBuilder()

    if (config.local?.webdriverPath) {
      service.setPath(config.local.webdriverPath);
    }

    const driver = (await new Builder()
      .setChromeService(service)
      .forBrowser(Browser.CHROME)
      .build());

    return driver;
  } else if (config.remote) {
     const driver = (await new Builder()
      .usingServer(config.remote.uri ?? "")
      .withCapabilities(Capabilities.chrome)
      .forBrowser(Browser.CHROME)
      .build());
    driver.setFileDetector(new FileDetector);  

    const driverProxy = new Proxy(driver, webDriverOverrides(logger));
    return driverProxy;   
  }
}