import { WebDriver, WebElementPromise } from "selenium-webdriver";
import { ProxyBuilder } from "@craftswain/utils-proxy-builder";
import { RetryPromise } from "@craftswain/utils-advanced-promises";
import debug from "../debug";
import delay from "delay";

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
) =>
  new RetryPromise(webElementPromise, {
    onFailedAttempt: () => delay(100),
    retries: 5,
  });
