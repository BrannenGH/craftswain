export class TestStore {
  cleanupHandles: (() => PromiseLike<void>)[] = [];
  testObjects: { [key: string]: PromiseLike<unknown> } = {};
}
