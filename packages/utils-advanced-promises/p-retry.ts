// Borrowed from https://github.com/sindresorhus/p-retry
// I have taken file directly due to above being published only as module

import retry from "retry";
import debug from "./debug";

const networkErrorMsgs = new Set([
  "Failed to fetch", // Chrome
  "NetworkError when attempting to fetch resource.", // Firefox
  "The Internet connection appears to be offline.", // Safari
  "Network request failed", // `cross-fetch`
  "fetch failed", // Undici (Node.js)
]);

export class AbortError extends Error {
  public originalError?: Error;

  constructor(message: any) {
    super();

    if (message instanceof Error) {
      this.originalError = message;
      ({ message } = message);
    } else {
      this.originalError = new Error(message);
      this.originalError.stack = this.stack;
    }

    this.name = "AbortError";
    this.message = message;
  }
}

const decorateErrorWithCounts = (
  error: Error & { attemptNumber: number; retriesLeft: number },
  attemptNumber: number,
  options: any
) => {
  // Minus 1 from attemptNumber because the first attempt does not count as a retry
  const retriesLeft = options.retries - (attemptNumber - 1);

  error.attemptNumber = attemptNumber;
  error.retriesLeft = retriesLeft;
  return error;
};

const isNetworkError = (errorMessage: string) =>
  networkErrorMsgs.has(errorMessage);

const getDOMException = (errorMessage: string) =>
  globalThis.DOMException === undefined
    ? new Error(errorMessage)
    : new DOMException(errorMessage);

export default async function pRetry<T>(
  input: (attempt?: number) => Promise<T>,
  options?: {
    retries?: number;
    onFailedAttempt?: (error: Error) => Promise<void>;
    signal?: any;
  }
): Promise<T> {
  return new Promise((resolve, reject) => {
    options = {
      onFailedAttempt: undefined,
      retries: 10,
      ...options,
    };

    const operation = retry.operation(options);

    operation.attempt(async (attemptNumber: number) => {
      try {
        debug("Attemping to resolve.");
        resolve(await input(attemptNumber));
      } catch (error) {
        debug("Threw error.");
        if (!(error instanceof Error)) {
          debug("Non error thrown");
          reject(
            new TypeError(
              `Non-error was thrown: "${error}". You should only throw errors.`
            )
          );
          return;
        }

        if (error instanceof AbortError) {
          debug("Got an abort, ending");
          operation.stop();
          reject(error.originalError);
        } else if (
          error instanceof TypeError &&
          !isNetworkError(error.message)
        ) {
          debug("Got a type error, ending");
          operation.stop();
          reject(error);
        } else {
          debug("Retrying");
          decorateErrorWithCounts(error as any, attemptNumber, options);

          try {
            debug("executing onFailed attempt");
            if (options?.onFailedAttempt) {
              await options.onFailedAttempt(error);
            }
          } catch (error) {
            debug("onFailed threw error");
            reject(error);
            return;
          }

          if (!operation.retry(error)) {
            reject(operation.mainError());
          }
        }
      }
    });

    if (options.signal && !options.signal.aborted) {
      options.signal.addEventListener(
        "abort",
        () => {
          operation.stop();
          const reason =
            options?.signal.reason === undefined
              ? getDOMException("The operation was aborted.")
              : options.signal.reason;
          reject(reason instanceof Error ? reason : getDOMException(reason));
        },
        {
          once: true,
        }
      );
    }
  });
}
