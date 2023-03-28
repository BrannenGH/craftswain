// TO BE MOVED OUT OF CORE

/*import { readFile } from "fs/promises";
import { load as parseYaml } from "js-yaml";
import { join } from "path";
import { createRequire } from "module";

export const loadJSConfig = async (rootPath: string) => {
  const targetRequire = createRequire(rootPath);

  const resolved = targetRequire.resolve("./out/craftswain.config.js");
  const instance = targetRequire(resolved);

  return instance.default as CraftswainConfig;
};

export const loadYamlConfig = async (rootPath: string) => {
  const file = await readFile(join(rootPath, "craftswain.config.yaml"), {
    encoding: "utf-8",
  });
  return parseYaml(file) as CraftswainConfig;
};
*/
