import { afterEach, describe, expect, it } from "vitest";
import { renderMissionDescription } from "../data/dailyMissions";
import i18n from "../i18n";
import { useMissionsStore } from "../state/useMissionsStore";
import { DailyMissionDifficulty, type DailyMission } from "../types/DailyMissions";
import { getCompletedMissionDescription } from "./getCompletedMissionDescription";

const initialMissionStoreState = {
  dailyMissions: [],
  weeklyMissions: [],
  loading: false,
  loaded: false,
  error: null,
  lastLoadedUserAddress: undefined,
  lastLoadedGameId: undefined,
  pendingUserAddress: undefined,
  pendingGameId: undefined,
};

const loadMissionNamespaces = async (language: string) => {
  await i18n.changeLanguage(language);
  await i18n.loadNamespaces(["achievements", "plays", "game"]);
};

describe("getCompletedMissionDescription", () => {
  afterEach(async () => {
    useMissionsStore.setState(initialMissionStoreState);
    await loadMissionNamespaces("en");
  });

  it("uses the matching mission description from the store when the event has no params", async () => {
    await loadMissionNamespaces("es");

    const mission: DailyMission = {
      id: "daily-flush-suit",
      missionId: "mission-123",
      templateId: "daily-flush-suit",
      description: "Juega Color de Corazones",
      completed: false,
      difficulty: DailyMissionDifficulty.EASY,
      periodType: "daily",
      target: 1,
      param1: 3,
      param2: 0,
      xp: 10,
    };

    useMissionsStore.setState({
      ...initialMissionStoreState,
      dailyMissions: [mission],
    });

    expect(
      getCompletedMissionDescription({
        player: "0x1",
        dailyMissionId: "daily-flush-suit",
        missionId: "mission-123",
        templateId: "daily-flush-suit",
        periodType: "daily",
        target: 1,
        base_xp: 10,
      })
    ).toBe("Juega Color de Corazones");
  });

  it("renders the flush-by-suit mission text naturally in supported locales", async () => {
    await loadMissionNamespaces("en");
    expect(
      renderMissionDescription({
        templateId: "daily-flush-suit",
        target: 1,
        param1: 3,
        param2: 0,
      })
    ).toBe("Play Flush in Hearts");

    await loadMissionNamespaces("es");
    expect(
      renderMissionDescription({
        templateId: "daily-flush-suit",
        target: 1,
        param1: 3,
        param2: 0,
      })
    ).toBe("Juega Color de Corazones");

    await loadMissionNamespaces("pt");
    expect(
      renderMissionDescription({
        templateId: "daily-flush-suit",
        target: 1,
        param1: 3,
        param2: 0,
      })
    ).toBe("Jogue Flush de Copas");
  });
});
