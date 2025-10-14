import { Banner, BannerType } from '../../queries/useDistributionSettings';
import { DailyMissionsBanner } from '../../pages/NewHome/banners/DailyMissionsBanner';
import { LeaderboardBanner } from '../../pages/NewHome/banners/LeaderboardBanner';
import { ImageBanner } from '../../pages/NewHome/banners/ImageBanner';

interface BannerRendererProps {
  banner: Banner;
}

export const BannerRenderer: React.FC<BannerRendererProps> = ({ banner }) => {
  switch (banner.type) {
    case BannerType.DAILY_MISSIONS:
      return <DailyMissionsBanner />;
    case BannerType.LEADERBOARD:
      return <LeaderboardBanner />;
    case BannerType.IMAGE:
      if (!banner.url) {
        console.error('Image banner missing URL:', banner);
        return null;
      }
      return <ImageBanner url={banner.url} navigateTo={banner.navigateTo} />;
    default:
      console.error('Unknown banner type:', banner);
      return null;
  }
};