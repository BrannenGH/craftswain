import { RetryPromise, TimeoutPromise } from "@craftswain/utils-advanced-promises";
import delay from "delay";
import Docker from "dockerode";
import debug from "../debug";
import { waitForStream } from ".";

export class ExtendedDocker extends Docker {
  streams: NodeJS.ReadWriteStream[] = [];

  constructor(options?: Docker.DockerOptions | undefined) {
    super(options);
  }

  public async pullImage(image: string) {
    debug(`Pulling image ${image}`);
    const stream = await this.pull(image);
    await waitForStream(this)(stream);
  }

  public async createContainer(options: Docker.ContainerCreateOptions): Promise<any> {
    return new RetryPromise(() => this.createContainer(options), {
      onFailedAttempt: () => delay(500),
      retries: 5,
    });
  }

  public async getContainers(
    filter: (container: Docker.ContainerInfo) => boolean
  ): Promise<Docker.ContainerInfo[]> {
    const containers = await this.listContainers({ all: true });

    debug("Found containers %j", containers);

    return containers.filter(filter);
  }

  public async removeContainer(container: Docker.ContainerInfo) {
    debug("Removing container %j", container);

    const containerInstance = this.getContainer(container.Id);

    if (container.State == "running") {
      await containerInstance.stop();

      await this.waitForLastOperation(containerInstance);
    }

    containerInstance.remove();
    await this.waitForLastOperation(containerInstance);
  }

  public async removeContainers(
    filter: (container: Docker.ContainerInfo) => boolean
  ) {
    const containers = await this.getContainers(filter);

    await Promise.all(containers.map(this.removeContainer));
  }

  public async waitForLastOperation(
    container: Docker.Container,
    timeout = 10000
  ) {
    const stream = await new TimeoutPromise(container.wait(), timeout, false);

    if (stream) {
      waitForStream(this)(stream);
    }
  }

  public async streamContainer(
    container: Docker.Container,
    onStdOut: (message: string) => void,
    onStdErr: (message: string) => void
  ) {
    const stream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true,
    });

    this.streams.push(stream);

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
  }

  public cleanupStreams() {
    this.streams.forEach((x) => x.removeAllListeners());
  }
}
