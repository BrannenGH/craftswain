import type { TestObjectConfig } from "@craftswain/core";
import { DockerOptions } from "dockerode";

export type DockerTestObjectConfig = TestObjectConfig & {
  dockerOptions?: DockerOptions;
};
