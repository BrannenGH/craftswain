import { Store, PLazy } from "@craftswain/core";
import Docker from "dockerode";
import { initApi } from "./container/container-lifecycle";
import os from "node:os";

export * from "./container/index";
export default (store: Store, config: unknown) => {
  store.set(
    "docker",
    new PLazy(() =>
      Promise.resolve(
        initApi(
          new Docker()
        )
      )
    )
  );
};
