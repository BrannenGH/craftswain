import { Logger } from "winston";
import { Global } from "@jest/types";

export type CraftswainGlobal = Global.Global & {
  logger?: Logger;
};
