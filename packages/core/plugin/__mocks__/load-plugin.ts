import { jest } from "@jest/globals";
import { CraftswainPlugin } from "..";
import simplePlugin from "./simple-plugin";
import pluginWithCleanup from "./plugin-with-cleanup";

const testPluginResolver: CraftswainPlugin = (set, config, dependencies) => {
  switch (config.type) {
    case "@craftswain/simple-plugin":
      return simplePlugin(set, config as any, dependencies);
    case "@craftswain/plugin-with-cleanup":
      return pluginWithCleanup(set, config as any, dependencies);
  }
};

export const loadPlugin = jest.fn(() => testPluginResolver);
