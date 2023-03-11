/**
 * @jest-environment @craftswain/core
 */
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { Homepage } from "../page_models/homepage";
import type Docker from "dockerode";
import type { Container } from "dockerode";
import { IncomingMessage } from "http";

declare const global: any;

test("Local browser: Open browser and go to webpage", async () => {
  const homepage = new Homepage(global.localWebDriver);

  expect(await (await homepage.lnkAbTesting).isDisplayed()).toBe(true);
}, 604800000);

describe("Remote Selenium", () => {
  let docker: Docker;
  let container: Container;

  beforeAll(async () => {
    docker = await global.docker;
    const running = await docker.listContainers();
    await Promise.all(
      running.map(
        async (container: { Id: string; Image: string; State: string }) => {
          if (container.Image == "selenium/standalone-chrome:110.0") {
            const contInstance = docker.getContainer(container.Id);

            if (container.State == "running") {
              await contInstance.stop();
            }

            const stream = await contInstance.wait();
            if (stream.on) {
              await new Promise((resolve, reject) => {
                docker.modem.followProgress(stream, (err: any, res: any) =>
                  err ? reject(err) : resolve(res)
                );
              });
            }

            await contInstance.remove();
          }
        }
      )
    );

    const response: IncomingMessage = await docker.pull(
      "selenium/standalone-chrome:110.0"
    );

    await new Promise((resolve, reject) => {
      docker.modem.followProgress(response, (err: any, res: any) =>
        err ? reject(err) : resolve(res)
      );
    });

    container = await docker.createContainer({
      Image: "selenium/standalone-chrome:110.0",
      HostConfig: {
        PortBindings: {
          "4444/tcp": [{ HostPort: "4444" }],
          "7900/tcp": [{ HostPort: "7900" }],
        },
      },
      ExposedPorts: {
        "4444/tcp": {},
        "7900/tcp": {},
      },
    });

    await container.start();

    const snooze = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    while (!(await container.inspect()).State.Running) {
      await snooze(500);
    }
  }, 604800000);

  afterAll(async () => {
    await container?.stop();

    const stream = await container?.wait();
    await new Promise((resolve, reject) => {
      docker.modem.followProgress(stream, (err: any, res: any) =>
        err ? reject(err) : resolve(res)
      );
    });
  }, 604800000);

  test.only("Remote browser: Open browser and go to webpage", async () => {
    const homepage = new Homepage(global.remoteWebDriver);

    expect(await (await homepage.lnkAbTesting).isDisplayed()).toBe(true);
  }, 604800000);
});
