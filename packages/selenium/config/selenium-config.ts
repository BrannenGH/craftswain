export type SeleniumConfig = {
  webdrivers: WebDriverConfig[];
};

export type WebDriverConfig = {
  name?: string;
  uri?: string;
  local?: {
    webdriverPath: string;
  };
  remote?: {
    uri: string;
  };
};
