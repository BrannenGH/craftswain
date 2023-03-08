import { readFile } from "fs/promises";
import { load as parseYaml } from "js-yaml";

export const loadConfig = async (filepath: string) => {
  let file = await readFile(filepath, { encoding: "utf-8" });
  return parseYaml(file) as any;
};
