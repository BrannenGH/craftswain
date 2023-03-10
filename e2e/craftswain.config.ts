import { CraftswainConfig } from "@craftswain/core";

const config: CraftswainConfig = {
  testObjects: [],
};

if (process.env.CI) {
  config.testObjects.push({
    name: "remoteWebDriver",
    type: "@craftswain/selenium",
    uri: "http://the-internet.herokuapp.com/",
    remote: {
      uri: "http://selenium:4444/",
    },
  });
} else {
  config.testObjects.push({
    name: "localWebDriver",
    type: "@craftswain/selenium",
    uri: "http://the-internet.herokuapp.com/",
    local: {
      webdriverPath: "/Users/brann/Source/repos/craftswain/chromedriver",
    },
  });
}

export default config;
