import { readFile } from "fs/promises";
import { load as parseYaml } from "js-yaml";
import type { CraftswainConfig } from "./craftswain-config";

export const loadConfig = async (filepath: string) => {
  const file = await readFile(filepath, { encoding: "utf-8" });
  return parseYaml(file) as CraftswainConfig;
};
