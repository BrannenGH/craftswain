export class TestStore {
  cleanupHandles: (() => PromiseLike<void>)[] = [];
  testObjects: { [key: string]: PromiseLike<any> } = {};
  testEventHandles: ((event: any, state: any) => PromiseLike<void>)[] = [];
}
