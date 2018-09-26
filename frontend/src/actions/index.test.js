import { base } from "./index";

describe("get action type's base string", function() {
  it("should get from success type", () => {
    const type = "SOME_THING_SUCCESS";
    expect(base(type)).toEqual("SOME_THING");
  });
  it("should get from failure type", () => {
    const type = "SOME_THING_FAILURE";
    expect(base(type)).toEqual("SOME_THING");
  });
});
