import { clean, diff } from "./index";

describe("clean", function() {
  it("should clean recursively", () => {
    const obj = {
      a: "test",
      b: undefined,
      c: null,
      d: {
        a: undefined,
        b: null
      },
      e: 1,
      f: false,
      g: {
        h: "test"
      },
      i: []
    };
    expect(clean(obj)).toEqual({
      a: "test",
      e: 1,
      f: false,
      g: { h: "test" },
      i: []
    });
  });
});

describe("diff", function() {
  it("should return diff of two objects", () => {
    const obj = {
      a: "test",
      aa: "haha",
      b: undefined,
      c: null,
      d: {
        a: undefined,
        b: null
      },
      e: 1,
      f: false,
      g: {
        h: "test"
      },
      i: []
    };
    const base = {
      a: "test",
      b: "sdfsdf",
      c: null,
      d: {
        a: "ed",
        b: null
      },
      e: 2,
      f: false,
      g: {
        h: "test"
      },
      i: []
    };
    expect(diff(obj, base)).toEqual({ aa: "haha", b: undefined, d: { a: undefined }, e: 1 });
  });
});
