import { it } from "@jest/globals";
import { get } from "@craftswain/jest";

it("should run a simple container", async () => {
  const helloWorldDocker = await get("helloWorldDocker");

  expect(helloWorldDocker).toBeDefined();
}, 900000);
