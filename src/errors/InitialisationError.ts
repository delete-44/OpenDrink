export class InitialisationError extends Error {
  constructor(...params: any[]) {
    super(...params);

    this.name = "InitialisationError";
  }
}
