export class LazyPromise<T> implements PromiseLike<T> {
  private wrappedPromise?: Promise<T>;

  get executed(): boolean {
    return !!this.wrappedPromise;
  }

  constructor(public promiseConstructor: () => Promise<T>) {}

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
    if (!this.wrappedPromise) {
      this.wrappedPromise = this.promiseConstructor();
    }

    return this.wrappedPromise.then(onfulfilled, onrejected);
  }
}
