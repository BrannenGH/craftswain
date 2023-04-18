import type Docker from "dockerode";
import internal from "stream";
import debug from "../debug";

export const waitForStream =
  (docker: Docker) => async (stream: Partial<internal.Stream>) => {
    await new Promise((resolve, reject) => {
      if (stream.on) {
        // no-op, on needs to be defined in parent.
        return;
      }

      docker.modem.followProgress(
        stream as internal.Stream,
        (err: unknown, res: unknown) => (err ? reject(err) : resolve(res)),
        (event: Buffer) => debug(event.toString("utf-8"))
      );
    });
  };
