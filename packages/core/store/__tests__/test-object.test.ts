import { describe, expect, test } from "@jest/globals";
import { TestObject } from "../test-object";

const testObj = {};

it("should properly handles non-promise objects", () => {
  const testObject = new TestObject(testObj);

  expect(testObject.object).toBe(testObj);
});

it("should properly handles promise objects", async () => {
  const testObjPromise = Promise.resolve(testObj);

  const testObject = new TestObject(testObjPromise);

  await expect(testObject.object).resolves.toBe(testObj);
});

it("should not run cleanup functions if the object has not been accessed", async () => {
  const testObject = new TestObject(testObj);
  const cleanupFunction = jest.fn();
  testObject.onCleanup(cleanupFunction);

  await testObject.runCleanup();

  expect(cleanupFunction).not.toHaveBeenCalled();
});

it("should run cleanup functions if the object has been accessed", async () => {
  const testObject = new TestObject(testObj);
  const cleanupFunction = jest.fn();
  testObject.onCleanup(cleanupFunction);
  const object = testObject.object;

  await testObject.runCleanup();

  expect(cleanupFunction).toHaveBeenCalledWith(object);
});

it("should run all cleanup functions if the object has been accessed", async () => {
  const testObject = new TestObject(testObj);
  const cleanupFunction1 = jest.fn();
  const cleanupFunction2 = jest.fn();
  testObject.onCleanup(cleanupFunction1);
  testObject.onCleanup(cleanupFunction2);
  const object = testObject.object;

  await testObject.runCleanup();

  expect(cleanupFunction1).toHaveBeenCalledWith(object);
  expect(cleanupFunction2).toHaveBeenCalledWith(object);
});
