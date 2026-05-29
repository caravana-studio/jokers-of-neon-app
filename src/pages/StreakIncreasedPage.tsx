import { useNavigate } from "react-router-dom";
import { DelayedLoading } from "../components/DelayedLoading";
import { DailyStreakSheet } from "../components/DailyStreakSheet";

const MOCKED_DAILY_STREAK = 30;

export const StreakIncreasedPage = () => {
  const navigate = useNavigate();

  return (
    <DelayedLoading ms={0}>
      <DailyStreakSheet
        streak={MOCKED_DAILY_STREAK}
        onClose={() => navigate("/test")}
      />
    </DelayedLoading>
  );
};
