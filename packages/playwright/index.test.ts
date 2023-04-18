import { it } from "@jest/globals";
import playwrightPlugin from ".";

it("should add a driver", () => {
  const setFn = jest.fn();
  const objectName = "test";
  const testConfig = { name: objectName, type: "@craftswain/playwright" };

  playwrightPlugin(setFn, testConfig);

  expect(setFn).toBeCalledTimes(1);
});
