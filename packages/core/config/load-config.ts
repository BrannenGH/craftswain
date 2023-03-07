import { readFile } from "fs/promises";
import { load as parseYaml } from "js-yaml";
import { CraftswainConfig } from "./craftswain-config";

export const loadConfig = async () => {
    let file = await readFile(process.cwd() + "/craftswain.config.yaml", {encoding: "utf-8"});
    return parseYaml(file) as CraftswainConfig;
}
