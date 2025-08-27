import { useUsername } from "../../dojo/utils/useUsername";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { profileMock } from "../../utils/mocks/profileMocks";
import { ProfileDesktop } from "./ProfileDesktop";
import { ProfileMobile } from "./ProfileMobile";

export const Profile = () => {
  const { isSmallScreen } = useResponsiveValues();

  const profileData: ProfileData = {
    username: useUsername() ?? profileMock.username,
    level: profileMock.level,
    streak: profileMock.streak,
    games: profileMock.games,
    victories: profileMock.victories,
    currentXp: profileMock.currentXp,
    levelXp: profileMock.levelXp,
    currentBadges: profileMock.currentBadges,
    totalBadges: profileMock.totalBadges,
  };

  return isSmallScreen ? (
    <ProfileMobile data={profileData} />
  ) : (
    <ProfileDesktop data={profileData} />
  );
};
