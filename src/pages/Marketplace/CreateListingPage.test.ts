import { describe, expect, it } from "vitest";
import {
  getInitialListingFormValues,
  getSpecialCategory,
  SPECIAL_CATEGORIES,
} from "./CreateListingPage";
import { STRK_ADDRESS } from "../../marketplace/config/contracts";

describe("special card categories", () => {
  it("includes Season 3 as a selectable category", () => {
    expect(SPECIAL_CATEGORIES.some((category) => category.key === "Season 3")).toBe(true);
  });

  it("maps 103xx special card ids to Season 3", () => {
    expect(getSpecialCategory(10301)).toBe("Season 3");
    expect(getSpecialCategory(10399)).toBe("Season 3");
  });

  it("prefills re-list form values from the expired listing", () => {
    expect(
      getInitialListingFormValues({
        price: "1000000000000000000",
        paymentToken: STRK_ADDRESS,
        expiryDays: 7,
      })
    ).toEqual({
      price: "1",
      paymentToken: STRK_ADDRESS,
      expiryDays: 7,
    });
  });
});
