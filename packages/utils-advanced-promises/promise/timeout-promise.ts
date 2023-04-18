import delay from "delay";
import CancelablePromise from "./cancelable-promise";

/**
 * TimeoutPromise is a wrapper around Promise that adds timeout functionality.
 * If the base promise doesn't resolve within the specified timeout, the promise will be canceled.
 * The user can choose whether to reject or resolve with undefined on timeout.
 */
class TimeoutPromise<T> implements PromiseLike<T> {
  private wrappedPromise: CancelablePromise<T>;
  private resolved = false;

  /**
   * @param basePromise - The base promise to be wrapped with timeout functionality
   * @param timeout - The number of milliseconds to wait before canceling the promise
   * @param reject - If true, the promise will be rejected on timeout, otherwise it resolves with undefined (default: true)
   */
  constructor(
    basePromise: PromiseLike<T>,
    private timeout: number,
    private reject: boolean = true
  ) {
    this.wrappedPromise = new CancelablePromise(basePromise);
  }

  /**
   * Attaches callbacks for the resolution or rejection of the Promise.
   * @param onfulfilled - Callback to be called when the promise is fulfilled
   * @param onrejected - Callback to be called when the promise is rejected
   * @returns A new Promise with modified fulfillment or rejection behavior based on the provided callbacks
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
    const onTimeout = this.reject
      ? () => {
          if (!this.resolved) {
            this.wrappedPromise.cancel();
            const error = new Error(
              `Operation timed out after ${this.timeout}ms`
            );
            if (onrejected) {
              onrejected(error);
            } else {
              throw error;
            }
          }
        }
      : () => {
          if (!this.resolved) {
            this.wrappedPromise.cancel();
            if (onfulfilled) {
              onfulfilled(undefined as T);
            }
          }
        };

    const timeoutPromise = delay(this.timeout).then(onTimeout);

    const resolveOnFulfil = (value: T) => {
      this.resolved = true;
      if (onfulfilled) {
        return onfulfilled(value);
      }

      return undefined as TResult1;
    };

    return Promise.race([
      this.wrappedPromise.then(resolveOnFulfil, onrejected),
      timeoutPromise.then(() => undefined as TResult2),
    ]);
  }
}

export default TimeoutPromise;
