import { describe, expect, it } from "@jest/globals";
import { CraftswainConfig } from "../../config";
import { useStore } from "..";

it("returns a get and set array", () => {
  const [get, set] = useStore();

  expect(get).toBeTruthy();
  expect(set).toBeTruthy();
});

it("returns the set value when get is called", async () => {
  const [get, set] = useStore();

  const testObj = {};

  set("test", Promise.resolve(testObj));

  await expect(get("test")).resolves.toBe(testObj);
});

it("returns the set value when get is called, after doing multiple assignments", async () => {
  const [get, set] = useStore();

  const testObj = { abc: 123 };
  const testObj2 = { 456: "xyz" };

  set("test1", Promise.resolve(testObj));
  set("test2", Promise.resolve(testObj2));

  await expect(get("test1")).resolves.toBe(testObj);
  await expect(get("test2")).resolves.toBe(testObj2);
});
