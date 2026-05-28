import { ValidationError } from "@/src/errors/ValidationError";

describe("ValidationError", () => {
  it("assigns name correctly", () => {
    const err = new ValidationError("test error");

    expect(err.name).toEqual("ValidationError");
    expect(err.message).toEqual("test error");
    expect(err instanceof ValidationError).toBe(true);
  });
});
