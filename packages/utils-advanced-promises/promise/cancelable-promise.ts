/**
 * CancelablePromise is a wrapper around Promise that adds cancel functionality.
 * If canceled, the promise will not call the fulfillment or rejection callbacks.
 * NOTE: It does not stop the base promise from resolving.
 */
class CancelablePromise<T> implements PromiseLike<T> {
  private canceled = false;

  /**
   * @param basePromise - The base promise to be wrapped with cancel functionality.
   */
  constructor(private basePromise: PromiseLike<T>) {}

  /**
   * Cancels the promise, preventing the fulfillment or rejection callbacks from being called.
   */
  public cancel() {
    this.canceled = true;
  }

  /**
   * Attaches callbacks for the resolution or rejection of the Promise.
   * If the promise is canceled, the callbacks won't be called.
   * @param onfulfilled - Callback to be called when the promise is fulfilled
   * @param onrejected - Callback to be called when the promise is rejected
   * @returns The base promise with modified fulfillment or rejection behavior based on the provided callbacks
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
    // eslint-disable-next-line @typescript-eslint/ban-types
    const cancelable =
      (func: Function | undefined | null) =>
      (...args: unknown[]) => {
        if (!this.canceled && func) {
          return func(...args);
        }

        return undefined;
      };

    return this.basePromise.then(
      cancelable(onfulfilled),
      cancelable(onrejected)
    );
  }
}

export default CancelablePromise;
