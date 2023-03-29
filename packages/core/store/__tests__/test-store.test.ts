import { describe, expect, it } from "@jest/globals";
import { StoreConfiguration, TestObject } from "..";
import { CraftswainConfig } from "../../config";
import { TestStore } from "../test-store";

jest.mock("../../plugin/load-plugin");

it("should set and get an object", () => {
  const testStore = new TestStore();

  const obj = { foo: "bar" };
  testStore.set("testObj", obj);
  expect(testStore.get("testObj")).toBe(obj);
});

it("should set and get an object with configuration", () => {
  const testStore = new TestStore();
  const obj = { foo: "bar" };
  const configure = (config: StoreConfiguration<typeof obj>) => {
    config.onCleanup(() => Promise.resolve<any>(""));
  };
  testStore.set("testObj", obj, configure);

  expect(testStore.get("testObj")).toBe(obj);
});

it.only("should build the test store from the configuration", () => {
  const testObj = { foo: "bar" };

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

  expect(testStore.get("test")).toStrictEqual(testObj);
});
