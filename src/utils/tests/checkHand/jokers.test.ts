import { expect, test } from "vitest";
import { Plays } from "../../../enums/plays";
import { preCheckHand } from "../../../testUtils/preCheckHand";
import { JOKER1 } from "../../mocks/cardMocks";

test("One Joker should be high card", () => {
  expect(preCheckHand([JOKER1], [], [])).toBe(Plays.HIGH_CARD);
});
