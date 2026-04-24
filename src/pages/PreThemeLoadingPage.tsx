import { PropsWithChildren, useEffect, useState } from "react";
import { useSeasonNumber } from "../constants/season";
import { resolveSeasonalAssetPath } from "../utils/assetAvailability";

interface PreThemeLoadingPageProps {
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
}

export const PreThemeLoadingPage = ({
  children,
  backgroundSize = "cover",
  backgroundPosition = "center",
  backgroundRepeat = "no-repeat",
}: PropsWithChildren<PreThemeLoadingPageProps>) => {
  const seasonNumber = useSeasonNumber();
  const fallbackBackgroundSrc = "/bg/home-bg.jpg";
  const [backgroundSrc, setBackgroundSrc] = useState<string>(
    fallbackBackgroundSrc
  );

  useEffect(() => {
    let isMounted = true;
    setBackgroundSrc(fallbackBackgroundSrc);

    const resolveBackground = async () => {
      const resolvedBackground = await resolveSeasonalAssetPath(
        fallbackBackgroundSrc,
        seasonNumber
      );

      if (!isMounted) return;
      setBackgroundSrc(resolvedBackground);
    };

    void resolveBackground();

    return () => {
      isMounted = false;
    };
  }, [seasonNumber]);

  return (
    <div
      style={{
        height: "100svh",
        minHeight: "100svh",
        position: "fixed",
        inset: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Orbitron",
        fontSize: 30,
        backgroundImage: `url(${backgroundSrc})`,
        backgroundSize,
        backgroundPosition,
        backgroundRepeat,
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  );
};
