import { PageModel } from "./page-model";
import { By, WebDriver } from "selenium-webdriver";
import { buildWebdriver } from "./factories/webdriver-factory";
import { LazyPromise, RetryPromise } from "@craftswain/core";
import type { Store, TestObjectConfig } from "@craftswain/core";
import { WebDriverConfig } from "./config/selenium-config";
import debug from "./debug";

export { PageModel };

export default (store: Store, config: TestObjectConfig & WebDriverConfig) => {
  debug("Building webdriver %s with config: %j", config.name, config);
  const driverPromise = new LazyPromise(
    () =>
      new RetryPromise(
        async () => {
          const driver = buildWebdriver(config);

          if (!driver) {
            throw new Error("Could not create webdriver.");
          }

          const uri = config.uri ?? "https://google.com";
          await driver?.get(uri);
          const t = await driver.findElement(By.css("ul li:nth-of-type(1) a"));

          const is = await t.isDisplayed();

          debug("T display status: %s", is);

          return driver;
        },
        10,
        5000
      )
  );

  store.set<WebDriver>(config.name, driverPromise, async (driver) =>
    driver.quit()
  );
};
