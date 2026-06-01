import { useLocation, useNavigate } from "react-router-dom";
import { DelayedLoading } from "../components/DelayedLoading";
import { DailyStreakSheet } from "../components/DailyStreakSheet";
import { useProfileStore } from "../state/useProfileStore";

const MOCKED_DAILY_STREAK = 30;

type StreakIncreasedLocationState = {
  streak?: number;
  from?: string;
};

export const StreakIncreasedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as StreakIncreasedLocationState | null;
  const profileStreak = useProfileStore(
    (store) => store.profileData?.profile.streak ?? 0
  );
  const streak = state?.streak ?? profileStreak ?? MOCKED_DAILY_STREAK;

  const handleClose = () => {
    if (state?.from) {
      navigate(state.from);
      return;
    }

    navigate(-1);
  };

  return (
    <DelayedLoading ms={0}>
      <DailyStreakSheet
        streak={streak}
        onClose={handleClose}
      />
    </DelayedLoading>
  );
};
