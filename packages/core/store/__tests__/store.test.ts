import { useTestStore } from "../use-store";

test("Able to use store", () => {
  let [getTestObject, setTestObject] = useTestStore();

  expect(setTestObject).toBeTruthy();
  expect(getTestObject).toBeTruthy();
});

test("Registered test object is avaliable", async () => {
  let [getTestObject, setTestObject] = useTestStore();

  const testObj = {};

  setTestObject({ test: Promise.resolve(testObj) });

  const test = await getTestObject("test");

  expect(test).toBe(testObj);
});
