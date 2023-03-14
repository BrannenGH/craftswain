import type Docker from "dockerode";

export const initApi = (docker: Docker) => {
  const dockerApi = {
    pullImage: async (image: string) => {
      const stream = await docker.pull(image);
      await dockerApi.waitForStream(stream);
    },
    createContainer: async (options: Docker.ContainerCreateOptions) =>
      await docker.createContainer(options),
    getContainers: async (
      filter: (container: Docker.ContainerInfo) => boolean
    ): Promise<Docker.ContainerInfo[]> => {
      const containers = await docker.listContainers();

      return containers.filter(filter);
    },
    removeContainer: async (container: Docker.ContainerInfo) => {
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

      dockerApi.waitForStream(stream);
    },
    waitForStream: async (stream: any) => {
      if (stream.on) {
        await new Promise((resolve, reject) => {
          docker.modem.followProgress(stream, (err: any, res: any) =>
            err ? reject(err) : resolve(res)
          );
        });
      }
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
