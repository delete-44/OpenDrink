export class ValidationError extends Error {
  constructor(...params: any[]) {
    super(...params);

    this.name = "ValidationError";
  }
}
