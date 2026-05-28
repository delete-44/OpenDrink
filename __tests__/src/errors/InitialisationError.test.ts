import { InitialisationError } from "@/src/errors/InitialisationError";

describe("InitialisationError", () => {
  it("assigns name correctly", () => {
    const err = new InitialisationError("test error");

    expect(err.name).toEqual("InitialisationError");
    expect(err.message).toEqual("test error");
    expect(err instanceof InitialisationError).toBe(true);
  });
});
