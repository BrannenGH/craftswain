import { PageModel } from "./page-model";
import { By, ThenableWebDriver, WebDriver } from "selenium-webdriver";
import { buildWebdriver } from "./factories/webdriver-factory";
import type { CraftswainPlugin } from "@craftswain/core";
import { PLazy, PRetry } from "@craftswain/utils-advanced-promises";
import debug from "./debug";
import delay from "delay";
import { SeleniumConfig } from "./config/selenium-config";

export { PageModel };

const SeleniumPlugin: CraftswainPlugin = (set, config: SeleniumConfig) => {
  debug("Building webdriver %s with config: %j", config.name, config);
  const driverPromise = new PLazy(() => {
    return PRetry(
      async () => {
        const driver = buildWebdriver(config);
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
        onFailedAttempt: () => delay(2000),
        retries: 5,
      }
    );
  });

  set(config.name, driverPromise, (config) =>
    config.onCleanup(async (driver) => (await driver).quit())
  );
};

export default SeleniumPlugin;
