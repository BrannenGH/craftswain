/**
 * @jest-environment @craftswain/core
 */
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { Homepage } from "../page_models/homepage";

declare const global: any;

test.only("Local browser: Open browser and go to webpage", async () => {
  const homepage = new Homepage(global.localWebDriver);

  expect(await (await homepage.lnkAbTesting).isDisplayed()).toBe(true);
});

test("Remote browser: Open browser and go to webpage", async () => {
  const homepage = new Homepage(global.remoteWebDriver);

  expect(await (await homepage.lnkAbTesting).isDisplayed()).toBe(true);
});
