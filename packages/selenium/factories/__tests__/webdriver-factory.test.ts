import { jest, expect } from "@jest/globals";
// Mocks
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
let mockSetPath = jest.fn();

jest.mock("selenium-webdriver", () => {
  return {
    WebDriver: jest.fn().mockImplementation(() => {
      return {};
    }),
    Builder: jest.fn().mockImplementation(() => {
      return {
        setChromeService: jest.fn().mockReturnThis(),
        forBrowser: jest.fn().mockReturnThis(),
        build: jest.fn().mockReturnValue({}),
      };
    }),
    Browser: {
      CHROME: undefined,
    },
  };
});

jest.mock("selenium-webdriver/chrome", () => {
  return {
    ServiceBuilder: jest.fn().mockImplementation(() => {
      return { setPath: mockSetPath };
    }),
  };
});

/*beforeEach(() => {
    (WebDriver as any).MockClear();
    (Remote as any).MockClear();
    (Chrome as any).MockClear();
})*/

/* eslint-enable prefer-const */
/* eslint-enable @typescript-eslint/no-unused-vars */
import { buildWebdriver } from "../webdriver-factory";

test("Local WebDriver should have appropriate path", () => {
  const config = {
    type: "@craftswain/selenium",
    name: "Test",
    uri: "https://google.com/",
    local: {
      webdriverPath: "/test/",
    },
  };

  buildWebdriver(config);

  expect(mockSetPath).toBeCalledWith(config.local.webdriverPath);
});
