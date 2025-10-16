import { describe, it, expect } from "vitest";
import { getMajor, getMinor, getPatch } from "./versionUtils";

describe("versionUtils", () => {
  it("extracts major, minor, patch from a full semver string", () => {
    expect(getMajor("1.2.3")).toBe("1");
    expect(getMinor("1.2.3")).toBe("2");
    expect(getPatch("1.2.3")).toBe("3");
  });

  it("handles a two-part version string", () => {
    expect(getMajor("4.5")).toBe("4");
    expect(getMinor("4.5")).toBe("5");
    // implementation returns undefined when patch is missing
    expect(getPatch("4.5")).toBeUndefined();
  });

  it("handles a single-part version string", () => {
    expect(getMajor("7")).toBe("7");
    // implementation returns undefined for missing minor/patch
    expect(getMinor("7")).toBeUndefined();
    expect(getPatch("7")).toBeUndefined();
  });

  it("handles an empty string", () => {
    // split on empty string yields [""] so major is empty string
    expect(getMajor("")).toBe("");
    expect(getMinor("")).toBeUndefined();
    expect(getPatch("")).toBeUndefined();
  });
});
