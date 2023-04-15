import type { CraftswainConfig } from "@craftswain/core";

const config: CraftswainConfig = {
  rootDirectory: ".",
  testObjects: [
    {
        name: "helloWorldDocker",
        type: "@craftswain/docker",
        Image: "hello-world",
    }
  ],
};

export default config;