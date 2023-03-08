/**
 * @jest-environment @craftswain/core
 */
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { Homepage } from "../page_models/homepage";
import type Docker from "dockerode";

declare const global: any;
declare const docker: Docker;

test("Open browser and go to webpage", async () => {
  const container = await docker.createContainer({
    Image: "selenium/standalone-chrome:110.0",
    ExposedPorts: {
      "4444": "4444",
      "7900": "7900",
    },
  });

  container.start();

  const homepage = new Homepage();

  expect(await (await homepage.lnkAbTesting).isDisplayed()).toBe(true);
});
