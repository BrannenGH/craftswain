import { CraftswainPlugin } from "../..";
import { TestObjectConfig } from "../../../config";

export type SimplePluginWithCleanupConfig = TestObjectConfig & {
  return: unknown;
  cleanupFunction: (obj: any) => any;
};

const simplePluginWithCleanup: CraftswainPlugin<
  SimplePluginWithCleanupConfig
> = (set, config) => {
  set(config.name, config.return, (configure) => {
    configure.onCleanup(config.cleanupFunction);
  });
};

export default simplePluginWithCleanup;
