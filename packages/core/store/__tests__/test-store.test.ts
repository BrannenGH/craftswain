import { describe, expect, it } from "@jest/globals";
import { StoreConfiguration, TestObject } from "..";
import { CraftswainConfig } from "../../config";
import { CraftswainPlugin } from "../../plugin";
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

it("should build the test store from the configuration", () => {
  const testObj = { foo: "bar" };

  const craftswainConfig: CraftswainConfig = {
    rootDirectory: ".",
    testObjects: [
      {
        name: "test",
        type: "@craftswain/simple-plugin",
        return: testObj,
      },
      {
        name: "foo",
        dependencies: ["test"],
        type: "@craftswain/simple-plugin",
        return: testObj,
      },
      {
        name: "bar",
        type: "@craftswain/simple-plugin",
        return: testObj,
      },
    ],
  };

  const testStore = new TestStore(craftswainConfig);

  expect(testStore.get("test")).toStrictEqual(testObj);
  expect(testStore.get("foo")).toStrictEqual(testObj);
  expect(testStore.get("bar")).toStrictEqual(testObj);
});

it("should cleanup the test store when built from the configuration", async () => {
  const testObj = { foo: "bar" };

  const craftswainConfig: CraftswainConfig = {
    rootDirectory: ".",
    testObjects: [
      {
        name: "test",
        type: "@craftswain/plugin-with-cleanup",
        return: testObj,
        cleanupFunction: jest.fn(),
      },
      {
        name: "foo",
        dependencies: ["test"],
        type: "@craftswain/plugin-with-cleanup",
        return: testObj,
        cleanupFunction: jest.fn(),
      },
      {
        name: "bar",
        type: "@craftswain/plugin-with-cleanup",
        return: testObj,
        cleanupFunction: jest.fn(),
      },
    ],
  };

  const testStore = new TestStore(craftswainConfig);

  console.log(testStore);

  expect(testStore.get("test")).toStrictEqual(testObj);
  expect(testStore.get("foo")).toStrictEqual(testObj);
  await testStore.cleanup();

  craftswainConfig.testObjects.forEach((obj) => {
    expect(obj.cleanupFunction).toBeCalledTimes(obj.name != "bar" ? 1 : 0);
  });
});

it("should cleanup when cleanup is called", async () => {
  const testStore = new TestStore();
  const obj = { foo: "bar" };
  const cleanupFunction1 = jest.fn();
  const cleanupFunction2 = jest.fn();
  const configure = (config: StoreConfiguration<typeof obj>) => {
    config.onCleanup(cleanupFunction1);
  };

  testStore.set("testObj", obj, configure);

  expect(testStore.get("testObj")).toBe(obj);

  await testStore.cleanup();

  expect(cleanupFunction1).toBeCalled();
});
