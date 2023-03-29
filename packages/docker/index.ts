import { CraftswainPlugin } from "@craftswain/core";
import { PLazy } from "@craftswain/utils-advanced-promises";
import Docker from "dockerode";
import { dockerApi } from "./container/container-lifecycle";
import { DockerTestObjectConfig } from "./docker-test-object-config";
export * from "./container/index";

const dockerPlugin: CraftswainPlugin = (
  set,
  config: DockerTestObjectConfig
) => {
  set(
    config.name,
    new PLazy(() =>
      Promise.resolve(dockerApi(new Docker(config.dockerOptions)))
    ),
    (config) => {
      config.onCleanup(async (docker) => (await docker).cleanupStreams());
    }
  );
};

export default dockerPlugin;
