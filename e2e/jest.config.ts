import type {Config} from 'jest';

const config: Config = {
  testEnvironment: "craftswain",
  clearMocks: true,
  coverageProvider: "v8",
  verbose: true,
  testMatch: [
    "**/?(*.)+(spec|test).[j]s?(x)"
  ],
};

export default config;
