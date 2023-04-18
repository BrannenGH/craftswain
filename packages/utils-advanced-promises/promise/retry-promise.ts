// Inspired by https://github.com/sindresorhus/p-retry

import retry, { RetryOperation, WrapOptions } from "retry";
import debug from "../debug";
import { AbortError, RetryError } from "../error";

export type RetryOptions = WrapOptions & {
  onFailedAttempt?: (error: RetryError) => void;
};

/**
 * A Promise-like class that retries a given operation.
 */
export class RetryPromise<T> implements PromiseLike<T> {
  private operation: RetryOperation;

 /**
   * Creates a new RetryPromise instance.
   * @param {function(number): PromiseLike<T>} promiseConstructor - A function that returns a Promise to be retried.
   * @param {RetryOptions} options - Configuration options for retries.
   */
  constructor(
    private promiseConstructor: (attemptNumber: number) => PromiseLike<T>,
    private options: RetryOptions
  ) {
    options = {
      onFailedAttempt: undefined,
      retries: 10,
      ...options,
    };

    this.operation = retry.operation(options);
  }

 /**
   * Attaches callbacks for the resolution and/or rejection of the RetryPromise
   * @param {function(T): (TResult1 | PromiseLike<TResult1>)} [onfulfilled] - A callback for when the promise is fulfilled
   * @param {function(any): (TResult2 | PromiseLike<TResult2>)} [onrejected] - A callback for when the promise is rejected
   * @returns {PromiseLike<TResult1 | TResult2>} A Promise that will be fulfilled with the return value of either `onfulfilled` or `onrejected` callback
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined
  ): PromiseLike<TResult1 | TResult2> {
    return new Promise<T>((resolve, reject) =>
      this.operation.attempt((currentAttempt: number) => {
        this.promiseConstructor(currentAttempt).then(
          (value) => resolve(value),
          (error: Error | unknown) => {
            if (error instanceof AbortError) {
              this.operation.stop();
              reject(error);
            } else {
              let retryError: RetryError;
              if (error instanceof Error) {
                retryError = new RetryError(
                  error.message,
                  currentAttempt,
                  this.options.retries! - (currentAttempt - 1),
                  error
                );
              } else {
                retryError = new RetryError(
                  error as string,
                  currentAttempt,
                  this.options.retries! - (currentAttempt - 1)
                );
              }
              try {
                if (this.options.onFailedAttempt) {
                  this.options.onFailedAttempt(retryError);
                }
              } catch (error) {
                debug("onFailed threw error");
                reject(error);
              }
              if (!this.operation.retry(retryError)) {
                reject(this.operation.mainError());
              }
            }
          }
        );
      })
    ).then(onfulfilled, onrejected);
  }
}
