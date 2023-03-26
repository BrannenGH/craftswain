export type CleanupTestObject<T> = (testObject: T) => PromiseLike<void>;

export class TestObject<T> {
  private cleanedUp = false;
  private _cleanup;

  constructor(public object: PromiseLike<T>, cleanup?: CleanupTestObject<T>) {
    this._cleanup = cleanup;
  }

  public async cleanup() {
    if (this.needsCleanUp && this._cleanup) {
      this.cleanedUp = true;
      return this._cleanup(await this.object);
    }
    return Promise.resolve();
  }

  get needsCleanUp(): boolean {
    let needsCleanUp = !this.cleanedUp;

    // If hasn't executed, don't need cleanup
    if (
      "executed" in this.object &&
      !(this.object as { executed: boolean }).executed
    ) {
      needsCleanUp = false;
    }

    return needsCleanUp;
  }
}

/**
 * Handle used to register a test object.
 *
 * Each test object is assumed to have it's own unique key.
 */
export type TestObjects<T> = { [key: string]: TestObject<T> };

export class TestStore {
  cleanupHandles: (() => PromiseLike<void>)[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testObjects: TestObjects<any> = {};
}
