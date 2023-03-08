import CraftswainContainer, { useRegister, useCleanup } from "@craftswain/core";
import Docker from "dockerode";

export default () => {
  useRegister<Docker>(() => {
    return {
      docker: Promise.resolve(new Docker({ host: "localhost", port: 2376 })),
    };
  });
};
