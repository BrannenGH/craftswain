import type { CraftswainConfig } from "@craftswain/core";

const config: CraftswainConfig = {
  rootDirectory: ".",
  testObjects: [
    {
      name: "playwrightDocker",
      type: "@craftswain/docker",
      image: "mcr.microsoft.com/playwright:v1.12.3-focal",
    },
    {
      name: "localPlaywright",
      type: "@craftswain/playwright",
    },
  ],
};

export default config;
