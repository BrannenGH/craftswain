import { Store, PLazy } from "@craftswain/core";
import Docker from "dockerode";
import { dockerApi } from "./container/container-lifecycle";

export * from "./container/index";
export default (store: Store/*TODO: , config: unknown*/) => {
  store.set(
    "docker",
    new PLazy(() =>
      Promise.resolve(
        dockerApi(
          new Docker()
        )
      )
    )
  );
};
