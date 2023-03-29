import { CraftswainPlugin } from "../..";
import { TestObjectConfig } from "../../../config";

export type SimplePluginConfig = TestObjectConfig & {
  return: unknown;
};

const simplePlugin: CraftswainPlugin<SimplePluginConfig> = (set, config) => {
  set(config.name, config.return);
};

export default simplePlugin;
