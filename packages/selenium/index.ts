import { PageModel } from "./page-model";
import { By, WebDriver } from "selenium-webdriver";
import { buildWebdriver } from "./factories/webdriver-factory";
import type { Store, TestObjectConfig } from "@craftswain/core";
import { PLazy, PRetry } from "@craftswain/core";
import { WebDriverConfig } from "./config/selenium-config";
import debug from "./debug";
import delay from "delay";

export { PageModel };

export default (store: Store, config: TestObjectConfig & WebDriverConfig) => {
  debug("Building webdriver %s with config: %j", config.name, config);
  const driverPromise = new PLazy(() => {
    const driver = buildWebdriver(config);

    return PRetry(
      async () => {
        try {
          const uri = config.uri ?? "https://google.com";
          await driver?.get(uri);
          const t = await driver.findElement(By.css("ul li:nth-of-type(1) a"));

          const is = await t.isDisplayed();

          debug("T display status: %s", is);
        } catch (err) {
          debug("error %j", err);
        }

        if (!driver) {
          throw new Error("Could not create webdriver.");
        }

        return driver;
      },
      {
        onFailedAttempt: () => delay(500),
        retries: 5,
      }
    );
  });

  store.set<WebDriver>(config.name, driverPromise, async (driver) =>
    driver.quit()
  );
};
