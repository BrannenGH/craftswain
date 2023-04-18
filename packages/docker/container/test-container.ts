import debug from "debug";
import { DockerConfig } from "../config";
import { ExtendedDocker } from "../utils";

export const startTestContainer = async (config: DockerConfig) => {
  const docker = await getDocker(config);

  if (!config.Image) {
    throw new Error("Image is required");
  }

  await docker.pullImage(config.Image);

  if (!config.name) {
    throw new Error("Name is required");
  }

  await cleanupTestContainer(config);

  const container = await docker.createContainer(config);

  await container.start();

  await docker.streamContainer(
    container,
    debug(`craftswain:docker:${config.name}:stdout`),
    debug(`craftswain:docker:${config.name}:stderr`)
  );

  return container;
};

export const cleanupTestContainer = async (config: DockerConfig) => {
  const docker = await getDocker(config);

  await docker.removeContainers((container) =>
    container.Names.includes("/" + config.name)
  );
};

const dockerInstances = new Map<string, ExtendedDocker>();

async function getDocker(config: DockerConfig) {
  if (!dockerInstances.has(config.name)) {
    dockerInstances.set(config.name, new ExtendedDocker(config));
  }

  return dockerInstances.get(config.name) as ExtendedDocker;
}