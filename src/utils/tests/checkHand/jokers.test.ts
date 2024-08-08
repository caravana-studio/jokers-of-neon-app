import { expect, test } from "vitest";
import { Plays } from "../../../enums/plays";
import { testCheckHand } from "../../../testUtils/testCheckHand";
import { JOKER1 } from "../../mocks/cardMocks";

test("One Joker should be high card", () => {
  expect(testCheckHand([JOKER1], [], [])).toBe(Plays.HIGH_CARD);
});
