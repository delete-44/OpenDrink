import { NotImplementedError } from "@/src/errors/NotImplementedError";

describe("NotImplementedError", () => {
  it("assigns name correctly", () => {
    const err = new NotImplementedError("test error");

    expect(err.name).toEqual("NotImplementedError");
    expect(err.message).toEqual("test error");
    expect(err instanceof NotImplementedError).toBe(true);
  });
});
