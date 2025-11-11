import { LeaderboardPageLayout } from "./LeaderboardPageLayout";
import { TournamentEntries } from "./TournamentEntries";

export const TournamentPage = () => {
  return <LeaderboardPageLayout entriesSection={<TournamentEntries />} />;
};
