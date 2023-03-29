import { createRequire } from "module";
import { CraftswainPlugin } from ".";

/**
 * Load the default function for the appropriate module and root directory.
 * @param module The module to load.
 * @param rootDirectory The root directory to use to contextualize the load.
 * @returns A craftswain plugin.
 */
export const loadPlugin = (module: string, rootDirectory: string) => {
  const targetRequire = createRequire(rootDirectory);

  const resolved = targetRequire.resolve(module);
  const instance = targetRequire(resolved) as {
    default: CraftswainPlugin;
  };

  return instance.default;
};
