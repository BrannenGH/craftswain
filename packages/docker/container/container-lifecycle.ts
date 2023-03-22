import { PRetry } from "@craftswain/core";
import delay from "delay";
import type Docker from "dockerode";
import internal from "stream";
import debug from "../debug";

export const waitForStream = async (
  docker: Docker,
  stream: internal.Stream | any
) => {
  debug("stream: %j", stream);
  if (stream.on) {
    await new Promise((resolve, reject) => {
      docker.modem.followProgress(
        stream,
        (err: any, res: any) => (err ? reject(err) : resolve(res)),
        (event: Buffer) => debug(event.toString("utf-8"))
      );
    });
  }
};

export const initApi = (docker: Docker) => {
  const dockerApi = {
    pullImage: async (image: string) => {
      debug(`Pulling image ${image}`);
      const stream = await docker.pull(image);
      await waitForStream(docker, stream);
    },
    createContainer: async (options: Docker.ContainerCreateOptions) =>
      PRetry(() => docker.createContainer(options), {
          onFailedAttempt: () => delay(500),
          retries: 5,
      }),
    getContainers: async (
      filter: (container: Docker.ContainerInfo) => boolean
    ): Promise<Docker.ContainerInfo[]> => {
      const containers = await docker.listContainers({ all: true });

      debug("Found containers %j", containers);

      return containers.filter(filter);
    },
    removeContainer: async (container: Docker.ContainerInfo) => {
      debug("Removing container $j", container);

      const containerInstance = docker.getContainer(container.Id);

      if (container.State == "running") {
        await containerInstance.stop();

        await dockerApi.waitForLastOperation(containerInstance);
      }

      containerInstance.remove();
      await dockerApi.waitForLastOperation(containerInstance);
    },
    removeContainers: async (
      filter: (container: Docker.ContainerInfo) => boolean
    ): Promise<void> => {
      const containers = await dockerApi.getContainers(filter);

      await Promise.all(containers.map(dockerApi.removeContainer));
    },
    waitForLastOperation: async (container: Docker.Container) => {
      const stream = await container.wait();

      waitForStream(docker, stream);
    },
    streamContainer: async (
      container: any,
      onStdOut: (message: string) => void,
      onStdErr: (message: string) => void
    ) => {
      const stream = await container.attach({
        stream: true,
        stdout: true,
        stderr: true,
      });

      const encode = (buff: Buffer) => buff.toString("utf-8");

      container.modem.demuxStream(
        stream,
        {
          write: (buff: Buffer) => onStdOut(encode(buff)),
        },
        {
          write: (buff: Buffer) => onStdErr(encode(buff)),
        }
      );
    },
  };
  return dockerApi;
};