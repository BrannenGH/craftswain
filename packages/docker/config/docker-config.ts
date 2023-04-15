import type { TestObjectConfig } from "@craftswain/core";
import { DockerOptions, ContainerCreateOptions } from "dockerode";

export type DockerConfig = TestObjectConfig & ContainerCreateOptions & DockerOptions; 
