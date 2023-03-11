import { LazyPromise, Store } from "@craftswain/core";
import Docker from "dockerode";

export default (store: Store, config: unknown) => {
  store.set("docker", new LazyPromise(() => Promise.resolve(new Docker())));
};