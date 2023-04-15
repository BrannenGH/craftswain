import { CraftswainPlugin } from "@craftswain/core";
import { PLazy } from "@craftswain/utils-advanced-promises";
import { DockerConfig } from "./config";
import { cleanupTestContainer, startTestContainer } from "./container/test-container";

const dockerPlugin: CraftswainPlugin = (
  set,
  config: DockerConfig
) => {
  set(config.name, new PLazy(() => startTestContainer(config)), configuration => {
    configuration.onCleanup(() => cleanupTestContainer(config))
  });
};

export default dockerPlugin;
