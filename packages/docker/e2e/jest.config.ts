import type { Config } from "jest";

process.env["DEBUG"] = "craftswain:* Docker docker -Babel -winston";
process.env["NODE_OPTIONS"] =
  process.env["NODE_OPTIONS"] + " --unhandled-rejections=warn --trace-warnings";

const config: Config = {
  testEnvironment: "@craftswain/jest",
  clearMocks: true,
  coverageProvider: "v8",
  verbose: true,
  testMatch: ["**/?(*.)+(e2e).[j]s?(x)"],
};

export default config;