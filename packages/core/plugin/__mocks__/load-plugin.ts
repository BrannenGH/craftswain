import { jest } from "@jest/globals";
import { CraftswainPlugin } from "..";

const examplePlugin: CraftswainPlugin = (set, config, dependencies) => {
  set("test", { foo: "bar" });
};

export const loadPlugin = jest.fn(() => examplePlugin);
