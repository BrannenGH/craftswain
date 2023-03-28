export type TestObjectConfig = {
  name: string;
  type: string;
  dependencies?: string[];
  [key: string | number]: unknown;
};

/**
 * Craftswain configuration
 */
export type CraftswainConfig = Partial<{
  /**
   * Root directory used for resolving plugins.
   */
  rootDirectory: string;

  /**
   * A collection of test objects.
   */
  testObjects: TestObjectConfig[];
}>;
