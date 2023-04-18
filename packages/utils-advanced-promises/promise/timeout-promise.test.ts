import { it } from "@jest/globals";
import TimeoutPromise from "./timeout-promise";

const asyncOperation = (timeout: number) =>
  new Promise((resolve) => setTimeout(() => resolve("Success"), timeout));

it("should resolve before timeout", async () => {
  const timeoutPromise = new TimeoutPromise(asyncOperation(100), 200);
  await expect(timeoutPromise).resolves.toBe("Success");
});

it("should reject on timeout if reject is set to true", async () => {
  const timeoutPromise = new TimeoutPromise(asyncOperation(200), 100, true);

  try {
    await timeoutPromise;
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe("Operation timed out after 100ms");
  }
});

it("should resolve with undefined on timeout if reject is set to false", async () => {
  const timeoutPromise = new TimeoutPromise(asyncOperation(200), 100, false);
  await expect(timeoutPromise).resolves.toBeUndefined();
});

it("should call custom onrejected handler on timeout if reject is set to true", async () => {
  const onrejected = jest.fn();
  const timeoutPromise = new TimeoutPromise(asyncOperation(200), 100, true);

  try {
    await timeoutPromise.then(null, onrejected);
  } catch (error) {
    expect(onrejected).toHaveBeenCalledTimes(1);
    expect(onrejected).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Operation timed out after 100ms" })
    );
  }
});
