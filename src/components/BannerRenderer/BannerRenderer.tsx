import { DailyMissionsBanner } from "../../pages/NewHome/banners/DailyMissionsBanner";
import { ImageBanner } from "../../pages/NewHome/banners/ImageBanner";
import { LeaderboardBanner } from "../../pages/NewHome/banners/LeaderboardBanner";
import { PacksBanner } from "../../pages/NewHome/banners/PacksBanner";
import { Banner, BannerType } from "../../queries/useDistributionSettings";

interface BannerRendererProps {
  banner: Banner;
}

export const BannerRenderer: React.FC<BannerRendererProps> = ({ banner }) => {
  switch (banner.type) {
    case BannerType.DAILY_MISSIONS:
      return <DailyMissionsBanner />;
    case BannerType.LEADERBOARD:
      return <LeaderboardBanner />;
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
};
