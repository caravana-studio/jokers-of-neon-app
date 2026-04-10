import { expect, test } from "vitest";
import { resolvePostActionKind } from "../../playEvents/postAction";

test("resolves direct play/discard action types", () => {
  expect(resolvePostActionKind(0)).toBe("play");
  expect(resolvePostActionKind(1)).toBe("discard");
});

test("resolves legacy card type action values", () => {
  expect(resolvePostActionKind(15)).toBe("play");
  expect(resolvePostActionKind(9)).toBe("discard");
});

test("uses fallback when action type is unknown", () => {
  expect(resolvePostActionKind(1, "play")).toBe("play");
  expect(resolvePostActionKind(42, "play")).toBe("play");
  expect(resolvePostActionKind(undefined, "discard")).toBe("discard");
});
