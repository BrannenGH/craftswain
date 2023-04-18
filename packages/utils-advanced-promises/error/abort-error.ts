export class AbortError extends Error {
  constructor(message: string, private innerError?: Error) {
    super(message, innerError ? { cause: innerError } : undefined);
  }
}
