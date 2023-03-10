import { useStore } from "../use-store";

test("Able to use store", () => {
  const testStore = useStore();

  expect(testStore.get).toBeTruthy();
  expect(testStore.set).toBeTruthy();
});

test("Registered test object is avaliable", async () => {
  const testStore = useStore();

  const testObj = {};

  testStore.set("test", Promise.resolve(testObj));

  const test = await testStore.get("test");

  expect(test).toBe(testObj);
});

test("All registered objects are returned", async () => {
  const testStore = useStore();

  const testObj = { abc: 123 };
  const testObj2 = { 456: "xyz" };

  testStore.set("test1", Promise.resolve(testObj));
  testStore.set("test2", Promise.resolve(testObj2));

  const all = testStore.allKeys();

  expect(all).toContain("test1");
  expect(all).toContain("test2");
  expect(await testStore.get("test1")).toBe(testObj);
  expect(await testStore.get("test2")).toBe(testObj2);
});
