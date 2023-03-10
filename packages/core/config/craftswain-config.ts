export type TestObjectConfig = {
  name: string;
  type: string;
  [key: string | number]: unknown;
};

export type CraftswainConfig = {
  testObjects: TestObjectConfig[];
};
