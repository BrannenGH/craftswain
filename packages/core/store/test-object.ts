import { StoreConfiguration } from ".";

/**
 * A wrapper around a test object to be used by tests to interact with the
 * software under test.
 */
export class TestObject<T> implements StoreConfiguration<T> {
  private cleanupFunctions: ((object: T) => Promise<void> | void)[] = [];
  private accessed = false;

  public get object() {
    this.accessed = true;
    return this.wrappedObject;
  }

  constructor(
    private wrappedObject: T,
    private config?: (configuration: StoreConfiguration<T>) => void
  ) {
    if (config) {
      config(this);
    }
  }

  public onCleanup(cleanupFunction: (object: T) => Promise<void> | void) {
    this.cleanupFunctions.push(cleanupFunction);
  }

  public async runCleanup() {
    if (this.accessed) {
      await Promise.all(
        this.cleanupFunctions.map((fn) => fn(this.wrappedObject))
      );
    }
  }
}
