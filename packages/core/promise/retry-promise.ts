export class RetryPromise<T> implements PromiseLike<T> {
  private wrappedPromise: PromiseLike<T>;
  private snooze = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  private tries = 0;

  constructor(
    public promiseConstructor: () => PromiseLike<T>,
    private maxTries: number,
    private timeout: number
  ) {
    this.wrappedPromise = promiseConstructor();
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined
  ): PromiseLike<TResult1 | TResult2> {
    if (this.tries < this.maxTries) {
      return this.wrappedPromise.then(onfulfilled, () =>
        this.tryAgain(onfulfilled, onrejected)
      );
    } else {
      return this.wrappedPromise.then(onfulfilled, onrejected);
    }
  }

  private tryAgain<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined
  ): PromiseLike<TResult1 | TResult2> {
    return this.snooze(this.timeout).then(() => {
      this.tries++;
      this.wrappedPromise = this.promiseConstructor();
      return this.then(onfulfilled, onrejected);
    });
  }
}
