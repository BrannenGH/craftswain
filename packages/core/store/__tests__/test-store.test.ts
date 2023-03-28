import { describe, expect, it } from "@jest/globals";
import { CraftswainConfig } from "../../config";
import { TestStore } from "../test-store";

jest.mock("module");

it("returns the appropriate set when get", () => {
  const testStore = new TestStore();
  const key = "test";
  const testObject = {};

  testStore.set(key, testObject);

  expect(testStore.get(key)).toBe(testObject);
});

it("builds the test store from the configuration", () => {
  const testObj = {};

  const craftswainConfig: CraftswainConfig = {
    rootDirectory: ".",
    testObjects: [
      {
        name: "test",
        type: "@craftswain/default",
        return: testObj,
      },
      {
        name: "foo",
        dependencies: ["test"],
        type: "@craftswain/default",
        return: testObj,
      },
      {
        name: "bar",
        type: "@craftswain/default",
        return: testObj,
      },
    ],
  };

  const testStore = new TestStore(craftswainConfig);

  expect(testStore.get("test")).toBe(testObj);
});
