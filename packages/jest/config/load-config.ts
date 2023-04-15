import { readFile } from "fs/promises";
import { load as parseYaml } from "js-yaml";
import { join } from "path";
import { createRequire } from "module";
import { CraftswainConfig } from "@craftswain/core";

export const loadJSConfig = async (rootPath: string, configFileName = "craftswain.config.js") => {
  const targetRequire = createRequire(rootPath);

  const resolved = targetRequire.resolve(join(rootPath, configFileName));
  const instance = targetRequire(resolved);

  return instance.default as CraftswainConfig;
};

export const loadYamlConfig = async (rootPath: string) => {
  const file = await readFile(join(rootPath, "craftswain.config.yaml"), {
    encoding: "utf-8",
  });
  return parseYaml(file) as CraftswainConfig;
};
