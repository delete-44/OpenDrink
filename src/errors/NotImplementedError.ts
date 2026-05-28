export class NotImplementedError extends Error {
  constructor(...params: any[]) {
    super(...params);

    this.name = "NotImplementedError";
  }
}
