import { Box } from "@chakra-ui/react";
import { ImageBanner } from "../pages/NewHome/banners/ImageBanner";
import { Banner, BannerType } from "../queries/useDistributionSettings";
import { Clock } from "../components/Clock";
import { MiniAppLeaderboardBanner } from "./MiniAppLeaderboardBanner";

type MiniAppBannerRendererProps = {
  banner: Banner;
};

export const MiniAppBannerRenderer = ({
  banner,
}: MiniAppBannerRendererProps) => {
  const endDate = banner.endTime ? new Date(banner.endTime) : null;
  const shouldShowClock =
    endDate && !Number.isNaN(endDate.getTime()) && endDate > new Date();

  const bannerContent = (() => {
    switch (banner.type) {
      case BannerType.LEADERBOARD:
        return <MiniAppLeaderboardBanner />;
      case BannerType.IMAGE:
        if (!banner.url) {
          console.error("Miniapp image banner missing URL:", banner);
          return null;
        }
        return <ImageBanner url={banner.url} navigateTo={banner.navigateTo} />;
      default:
        console.error("Unsupported miniapp banner type:", banner);
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
