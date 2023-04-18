export class RetryError extends Error {
  constructor(
    message: string,
    public attemptNumber: number,
    public retriesLeft: number,
    innerError?: Error
  ) {
    message = `Received '${message}' on attempt ${attemptNumber}, with ${retriesLeft} retries left.`;

    super(message, innerError ? { cause: innerError } : undefined);
  }
}
