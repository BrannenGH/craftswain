import { TestObjectConfig } from "@craftswain/core";

export type SeleniumConfig = TestObjectConfig & {
  name?: string;
  uri?: string;
  local?: {
    webdriverPath: string;
  };
  remote?: {
    uri: string;
  };
};
