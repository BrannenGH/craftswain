import { jest } from "@jest/globals";
import { createRequire } from "module";

export const module = jest.createMockFromModule("module") as {
  createRequire: typeof createRequire;
};

const mockNodeRequire: any = jest.fn<any>((id: string) => id);
mockNodeRequire.resolve = jest.fn();

(module.createRequire as jest.Mock).mockImplementation(
  (path) => mockNodeRequire
);

export default module;
