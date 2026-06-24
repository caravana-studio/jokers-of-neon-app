import { describe, expect, it } from "vitest";
import { getSpecialCategory, SPECIAL_CATEGORIES } from "./CreateListingPage";

describe("special card categories", () => {
  it("includes Season 3 as a selectable category", () => {
    expect(SPECIAL_CATEGORIES.some((category) => category.key === "Season 3")).toBe(true);
  });

  it("maps 103xx special card ids to Season 3", () => {
    expect(getSpecialCategory(10301)).toBe("Season 3");
    expect(getSpecialCategory(10399)).toBe("Season 3");
  });
});
