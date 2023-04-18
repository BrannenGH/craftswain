import { CraftswainPlugin } from "@craftswain/core";
import { LazyPromise } from "@craftswain/utils-advanced-promises";
import { DockerConfig } from "./config";
import {
  cleanupTestContainer,
  startTestContainer,
} from "./container/test-container";

const dockerPlugin: CraftswainPlugin = (set, config: DockerConfig) => {
  set(
    config.name,
    new LazyPromise(() => startTestContainer(config)),
    (configuration) => {
      configuration.onCleanup(() => cleanupTestContainer(config));
    }
  );
};

export default dockerPlugin;
