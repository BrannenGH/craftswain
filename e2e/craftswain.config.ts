import { CraftswainConfig } from "@craftswain/core";

const config: CraftswainConfig = {
  rootDirectory: ".",
  testObjects: [],
};

config.testObjects.push({
  name: "remoteWebDriver",
  type: "@craftswain/selenium",
  uri: "http://the-internet.herokuapp.com/",
  remote: {
    uri: "http://localhost:4444/",
  },
});

config.testObjects.push({
  name: "docker",
  type: "@craftswain/docker",
});

config.testObjects.push({
  name: "localWebDriver",
  type: "@craftswain/selenium",
  uri: "http://the-internet.herokuapp.com/",
  local: {
    webdriverPath: "/Users/brann/Source/repos/craftswain/chromedriver",
  },
});

export default config;
