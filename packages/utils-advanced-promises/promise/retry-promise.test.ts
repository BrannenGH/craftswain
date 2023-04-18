import { RetryPromise } from "./retry-promise";
import { AbortError } from "../error";

// Mock a function that succeeds on the third attempt
const succeedOnThirdAttempt = (() => {
  let counter = 0;
  return async () => {
    counter += 1;
    if (counter === 3) {
      return "Success";
    }
    throw new Error("Failed attempt");
  };
})();

it("should succeed on the third attempt", async () => {
  const promise = new RetryPromise(succeedOnThirdAttempt, { retries: 5 });
  await expect(promise).resolves.toBe("Success");
});

// Mock a function that always fails
const alwaysFail = async () => {
  throw new Error("Always fail");
};

it("should fail after retries are exhausted", async () => {
  const promise = new RetryPromise(alwaysFail, { retries: 2 });

  await expect(promise).rejects.toMatchObject({
    message: "Received 'Always fail' on attempt 3, with 0 retries left.",
    retriesLeft: 0,
  });
});

// Mock a function that aborts
const abortOperation = async () => {
  throw new AbortError("Aborted");
};

it("should handle AbortError and stop retrying", async () => {
  const promise = new RetryPromise(abortOperation, { retries: 5 });

  await expect(promise).rejects.toMatchObject({
    message: "Aborted",
  });
});
