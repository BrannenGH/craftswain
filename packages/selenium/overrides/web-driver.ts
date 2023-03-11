import { Locator, WebDriver, WebElementPromise } from "selenium-webdriver";
import { ProxyBuilder, RetryPromise } from "@craftswain/core";
import debug from "../debug";

export const proxyWebDriver = (webDriver: WebDriver) =>
  new ProxyBuilder(webDriver)
    // If find element executed on target
    .whenGetProperty("findElement", (target, receiver, resolve) => {
      return proxyFindElement(
        resolve() as InstanceType<typeof WebDriver>["findElement"]
      );
    })
    .build();

export const proxyFindElement = (
  findElement: InstanceType<typeof WebDriver>["findElement"]
) => new ProxyBuilder(findElement).wrapReturnLazy(proxyWebElementPromise);

export const proxyWebElementPromise = (
  webElementPromise: () => WebElementPromise
) => new RetryPromise(webElementPromise, 10, 8000);
