import { describe, expect, test } from "@jest/globals";
import { TestObject } from "../test-object";

const testObj = {};

it("properly handles non-promise objects", () => {
  const testObject = new TestObject(testObj);

  expect(testObject.object).toBe(testObj);
});

it("properly handles promise objects", async () => {
  const testObjPromise = Promise.resolve(testObj);

  const testObject = new TestObject(testObjPromise);

  await expect(testObject.object).resolves.toBe(testObj);
});
