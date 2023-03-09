/**
 * @jest-environment @craftswain/core
 */
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { Homepage } from "../page_models/homepage";
import type Docker from "dockerode";

declare const global: {
  docker: Promise<Docker>;
};

test("Open browser and go to webpage", async () => {
  console.log("Start");
  const docker = await global.docker;

  console.log(await docker.listImages());

  var response = await docker.pull("selenium/standalone-chrome:110.0");

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

  container.start();

  const homepage = new Homepage();

  expect(await (await homepage.lnkAbTesting).isDisplayed()).toBe(true);
}, 604800000);
