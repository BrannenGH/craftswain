import { WebDriver } from "selenium-webdriver";
import CraftswainEnvironment from "@craftswain/jest";
import { buildWebdriver } from "./factories/webdriver-factory";
import { SeleniumConfig } from "./config/selenium-config";
import { useRegister, useCleanup } from "@craftswain/core";
import LazyPromise from "lazy-promise";

export const CraftswainSelenium = (
  environment: CraftswainEnvironment<{ selenium: SeleniumConfig }>
) => {
  (environment.global?.logger as any)?.log("info", "starting webdriver");

  environment.config.selenium.webdrivers.forEach((x) => {
    useRegister<WebDriver>(() => {
      const res = {} as { [key: string]: Promise<WebDriver> };

      res[x.name ?? "webDriver"] = new LazyPromise(async () => {
        const driver = await buildWebdriver(
          x,
          environment.global?.logger as any
        );

        if (!driver) {
          throw new Error("Could not create webdriver.");
        }

        const uri = x.uri ?? "https://google.com";
        (environment.global?.logger as any)?.log("info", `Going to URI ${uri}`);
        await driver?.get(uri);
        (environment.global?.logger as any)?.log("info", `Went to URI ${uri}`);

        useCleanup(() => driver.quit());

        return driver;
      });

      return res;
    });
  });
};
