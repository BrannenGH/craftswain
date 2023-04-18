import { CancelablePromise } from "./cancelable-promise";

const asyncOperation = (timeout: number) =>
  new Promise((resolve) => setTimeout(() => resolve("Success"), timeout));

const asyncErrorOperation = (timeout: number) =>
  new Promise((_resolve, reject) =>
    setTimeout(() => reject(new Error("Failure")), timeout)
  );

it("should resolve if not canceled", async () => {
  const cancelablePromise = new CancelablePromise(asyncOperation(100));
  const result = await cancelablePromise;
  expect(result).toBe("Success");
});

it("should not call onfulfilled if canceled", async () => {
  const cancelablePromise = new CancelablePromise(asyncOperation(100));
  const onfulfilled = jest.fn();

  cancelablePromise.cancel();

  await cancelablePromise.then(onfulfilled);
  expect(onfulfilled).not.toHaveBeenCalled();
});

it("should not call onrejected if canceled", async () => {
  const cancelablePromise = new CancelablePromise(asyncErrorOperation(100));
  const onrejected = jest.fn();

  cancelablePromise.cancel();

  try {
    await cancelablePromise.then(null, onrejected);
  } catch (error) {
    // no-op
  }

  expect(onrejected).not.toHaveBeenCalled();
});

it("should call onrejected if not canceled", async () => {
  const cancelablePromise = new CancelablePromise(asyncErrorOperation(100));
  const onrejected = jest.fn();

  try {
    await cancelablePromise.then(null, onrejected);
  } catch (error) {
    // no-op
  }

  expect(onrejected).toHaveBeenCalled();
});
