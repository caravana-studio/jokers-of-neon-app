import { describe, expect, it } from "vitest";
import { getVideoSourceCandidates } from "./backgroundVideoSources";

describe("getVideoSourceCandidates", () => {
  it("tries the seasonal rage video before the default fallback", () => {
    expect(getVideoSourceCandidates("rage", false, 3)).toEqual([
      "/bg/rage-bg-s3.mp4",
      "/bg/rage-bg.mp4",
    ]);
  });

  it("falls back from seasonal rage boss to seasonal rage and then default rage", () => {
    expect(getVideoSourceCandidates("rageboss", false, 3)).toEqual(
      [
        "/bg/rage-boss-bg-s3.mp4",
        "/bg/rage-bg-s3.mp4",
        "/bg/rage-bg.mp4",
      ]
    );
  });

  it("keeps tournament rage candidates isolated from default rage assets", () => {
    expect(getVideoSourceCandidates("rage", true, 3)).toEqual([
      "/bg/rage-bg_t-s3.mp4",
      "/bg/rage-bg_t.mp4",
    ]);
  });

  it("keeps the season 1 fallback chain explicit", () => {
    expect(getVideoSourceCandidates("home", false, 1)).toEqual([
      "/bg/home-bg-s1.mp4",
      "/bg/home-bg.mp4",
    ]);
  });
});
