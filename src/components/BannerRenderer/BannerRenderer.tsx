import { Box } from "@chakra-ui/react";
import { DailyMissionsBanner } from "../../pages/NewHome/banners/DailyMissionsBanner";
import { ImageBanner } from "../../pages/NewHome/banners/ImageBanner";
import { LeaderboardBanner } from "../../pages/NewHome/banners/LeaderboardBanner";
import { PacksBanner } from "../../pages/NewHome/banners/PacksBanner";
import { TournamentBanner } from "../../pages/NewHome/banners/TournamentBanner";
import { Banner, BannerType } from "../../queries/useDistributionSettings";
import { Clock } from "../Clock";

interface BannerRendererProps {
  banner: Banner;
}

export const BannerRenderer: React.FC<BannerRendererProps> = ({ banner }) => {
  const endDate = banner.endTime ? new Date(banner.endTime) : null;
  const shouldShowClock =
    endDate && !Number.isNaN(endDate.getTime()) && endDate > new Date();

  const bannerContent = (() => {
    switch (banner.type) {
      case BannerType.DAILY_MISSIONS:
        return <DailyMissionsBanner />;
      case BannerType.LEADERBOARD:
        return <LeaderboardBanner />;
      case BannerType.TOURNAMENT:
        return <TournamentBanner />;
      case BannerType.PACKS:
        return (
          <PacksBanner
            packs={
              banner.packs?.length && banner.packs.length > 0
                ? banner.packs
                : [3, 2, 1]
            }
          />
        );
      case BannerType.IMAGE:
        if (!banner.url) {
          console.error("Image banner missing URL:", banner);
          return null;
        }
        return <ImageBanner url={banner.url} navigateTo={banner.navigateTo} />;
      default:
        console.error("Unknown banner type:", banner);
        return null;
    }
  })();

  if (!bannerContent) {
    return null;
  }

  return (
    <Box position="relative" w="100%">
      {shouldShowClock && endDate && (
        <Box
          position="absolute"
          top={{ base: 2, sm: 5 }}
          right={{ base: 4, sm: 6 }}
          zIndex={20}
          pointerEvents="none"
        >
          <Clock date={endDate} />
        </Box>
      )}
      {bannerContent}
    </Box>
  );
};
