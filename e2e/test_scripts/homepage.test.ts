/**
 * @jest-environment @craftswain/core
 */
import { expect, test } from "@jest/globals";
import { Homepage } from "../page_models/homepage";
import type Docker from "dockerode";

declare const global: {
  docker: Promise<Docker>;
};

test("Launch Docker Container", async () => {
  const docker = await global.docker;

  const running = await docker.listContainers();
  await Promise.all(
    running.map(async (container) => {
      if (
        container.Image == "selenium/standalone-chrome:110.0" &&
        container.State == "running"
      ) {
        const contInstance = docker.getContainer(container.Id);

        if (container.State == "running") {
          const stopStream = await contInstance.stop();
        }

        const removeStream = await contInstance.remove();
      }
    })
  );

  const response = await docker.pull("selenium/standalone-chrome:110.0");

  await new Promise((resolve, reject) => {
    docker.modem.followProgress(response, (err: any, res: any) =>
      err ? reject(err) : resolve(res)
    );
  });

  const container = await docker.createContainer({
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
}, 604800000);

test.only("Open browser and go to webpage", async () => {
  const homepage = new Homepage();

  expect(await (await homepage.lnkAbTesting).isDisplayed()).toBe(true);
}, 604800000);
