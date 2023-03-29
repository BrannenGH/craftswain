import TestEnvironment from "jest-environment-node";
import Winston from "winston";
import { EnvironmentContext, JestEnvironmentConfig } from "@jest/environment";
import { useStore } from "@craftswain/core";
import { Global } from "@jest/types";
import { loadJSConfig } from "./config/load-config";

export class CraftswainEnvironment extends TestEnvironment {
  declare global: Global.Global;
  jestConfig: JestEnvironmentConfig;
  cleanup?: () => Promise<void>;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.jestConfig = config;
  }

  async setup() {
    await super.setup();

    const craftswainConfig = await loadJSConfig(
      this.jestConfig.projectConfig.rootDir
    );

    const [get, set, cleanup] = useStore(craftswainConfig);
    this.global.set = set;
    this.global.get = get;
    this.cleanup = cleanup;

    this.global.logger = Winston.createLogger({
      level: "debug",
      format: Winston.format.simple(),
      transports: [new Winston.transports.Console()],
    });
  }

  async teardown() {
    if (this.cleanup) {
      await this.cleanup();
    }

    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }

  async handleTestEvent(/*event: unknown, state: unknown*/) {
    return;
  }
}
