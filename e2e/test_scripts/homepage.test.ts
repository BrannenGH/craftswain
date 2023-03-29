import { describe, expect, test } from "@jest/globals";
import { Homepage } from "../page_models/homepage";
import type { Container } from "dockerode";
import debug from "debug";
import { By, WebDriver } from "selenium-webdriver";
import { dockerApi } from "@craftswain/docker";

declare const global: any;

test("Local browser: Open browser and go to webpage", async () => {
  const homepage = new Homepage(global.localWebDriver);

  expect(await (await homepage.lnkAbTesting).isDisplayed()).toBe(true);
}, 604800000);

describe("Remote Selenium", () => {
  let container: Container;
  let docker: ReturnType<typeof dockerApi>;

  beforeAll(async () => {
    const image = "selenium/standalone-chrome:110.0";
    const name = "RemoteSelenium";
    docker = await global.get("docker");

    await docker.pullImage(image);

    await docker.removeContainers((container) =>
      container.Names.includes("/" + name)
    );

    const container = await docker.createContainer({
      Image: "selenium/standalone-chrome:110.0",
      name: name,
      HostConfig: {
        PortBindings: {
          "4444/tcp": [{ HostPort: "4444" }],
          "7900/tcp": [{ HostPort: "7900" }],
        },
        ShmSize: 2147483648,
      },
      //Env: ["SE_OPTS=--log-level FINE"],
      ExposedPorts: {
        "4444/tcp": {},
        "7900/tcp": {},
      },
    });

    await container.start();

    await docker.streamContainer(
      container,
      debug(`craftswain:docker:${name}:Out`),
      debug(`craftswain:docker:${name}:Error`)
    );
  }, 604800000);

  afterAll(async () => {
    await container?.stop();

    const stream = await container?.wait();
  }, 604800000);

  test.only("Remote browser: Open browser and go to webpage", async () => {
    const driver: WebDriver = await global.remoteWebDriver;

    const t = driver.findElement(By.css("ul li:nth-of-type(1) a"));

    const is = await t.isDisplayed();

    expect(is).toBe(true);

    /*const homepage = new Homepage();

    expect(await (await homepage.lnkAbTesting).isDisplayed()).toBe(true);*/
  }, 604800000);
});
