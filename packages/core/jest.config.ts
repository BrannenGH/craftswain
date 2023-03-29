import type { Config } from "jest";

process.env["DEBUG"] = "craftswain:core";

const config: Config = {
  clearMocks: true,
  coverageProvider: "v8",
  verbose: true,
  testMatch: ["**/?(*.)+(spec|test).[j]s?(x)"],
};

export default config;
