import { PushActionsPayload, pushActions } from "./pushActions";

interface AchievementCompletedEvent {
  achievementId: string;
  player: { toString(): string };
}

export const handleAchievementPush = async (
  achievementEvent: AchievementCompletedEvent
) => {
  const payloads: PushActionsPayload[] = [
    {
      actions: [achievementEvent.achievementId],
      address: achievementEvent.player.toString(),
    },
  ];

  try {
    const promises = payloads.map((payload) => pushActions(payload));
    console.log(payloads);
    await Promise.all(promises).then((responses) => {
      console.log(responses);
    });
  } catch (error) {
    console.error("Failed to push actions", error);
  }
};
