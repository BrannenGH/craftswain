import { CraftswainPlugin } from "@craftswain/core";
import { chromium } from "playwright";
import { PlaywrightConfig } from "./config/playwright-config";
import { LazyPromise } from "@craftswain/utils-advanced-promises";

/**
 * Bare bones playwright implementation.
 */
const PlaywrightPlugin: CraftswainPlugin = (set, config: PlaywrightConfig) => {
  const browser = new LazyPromise(chromium.launch);

  set(config.name, browser);
};

export default PlaywrightPlugin;
