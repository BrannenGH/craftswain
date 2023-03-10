import { readFile } from "fs/promises";
import { load as parseYaml } from "js-yaml";

export type TestObjectConfig = {
  name: string;
  type: string;
  [key: string | number]: unknown;
};

export type CraftswainConfig = {
  testObjects: TestObjectConfig[];
};

export const loadConfig = async (filepath: string) => {
  const file = await readFile(filepath, { encoding: "utf-8" });
  return parseYaml(file) as CraftswainConfig;
};
