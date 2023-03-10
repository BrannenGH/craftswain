import fs from "fs/promises";
import { loadConfig } from "../load-config";
import { expect, jest, test } from "@jest/globals";

const exampleConfig = `testObjects:
  - name: "test1"
    type: "@craftswain/test"
  - name: "test2"
    type: "@craftswain/test"
    example: "value"
`;

test("YAML configuration loads correctly", async () => {
  fs.readFile = jest
    .fn()
    .mockResolvedValue(Promise.resolve(exampleConfig) as never) as any;

  const config = await loadConfig("/test");

  expect(config).toBeDefined();
  expect(config.testObjects).toBeDefined();
  expect(config.testObjects).toHaveLength(2);
  expect(config.testObjects[0].name).toBe("test1");
  expect(config.testObjects[1].name).toBe("test2");
  expect(config.testObjects[0].type).toBe("@craftswain/test");
  expect(config.testObjects[1].type).toBe("@craftswain/test");
  expect(config.testObjects[1]).toHaveProperty("example");
  expect(config.testObjects[1].example).toBe("value");
});
