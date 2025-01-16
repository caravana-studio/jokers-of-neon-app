import { Box, Text } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { useResponsiveValues } from "../theme/responsiveSettings";
import CachedImage from "./CachedImage";
import { useGameContext } from "../providers/GameProvider";

interface BackgroundProps extends PropsWithChildren {
  type?: "game" | "store" | "home" | "white" | "rage";
  dark?: boolean;
  scrollOnMobile?: boolean;
  bgDecoration?: boolean;
}

const getBackgroundColor = (type: string) => {
  switch (type) {
    case "white":
      return "white";
    case "rage":
      return "black";
    default:
      return "transparent";
  }
};

const fetchBackgroundImageUrl = async (
  type: string,
  modId: number
): Promise<string | null> => {
  const baseUrl = import.meta.env.VITE_MOD_URL + modId + "/bg";

  try {
    const response = await fetch(`${baseUrl}/${type}-bg.jpg`);

    if (!response.ok) {
      console.error(`Failed to fetch background image: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.download_url; // Use the raw file URL
  } catch (error) {
    console.error("Error fetching background image:", error);
    return null;
  }
};

const getBackgroundImage = (type: string) => {
  switch (type) {
    case "white":
      return "none";
    case "rage":
      return "none";
    default:
      return `url(/bg/${type}-bg.jpg)`;
  }
};

export const Background = ({
  children,
  type = "game",
  dark = false,
  bgDecoration: bgDecoration = false,
  scrollOnMobile = false,
}: BackgroundProps) => {
  const { isSmallScreen } = useResponsiveValues();
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>("none");

  const { modId } = useGameContext();

  useEffect(() => {
    const loadBackgroundImage = async () => {
      if (modId !== 1) {
        const imageUrl = await fetchBackgroundImageUrl(type, modId);
        setBackgroundImageUrl(imageUrl || "none");
      }
    };

    loadBackgroundImage();
  }, [type]);

  return (
    <Box
      sx={{
        backgroundColor: getBackgroundColor(type),
        backgroundImage:
          modId === 1 || modId === 0
            ? getBackgroundImage(type)
            : backgroundImageUrl,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100svh",
        width: "100vw",
        position: isSmallScreen ? "fixed" : "unset",
        bottom: isSmallScreen ? 0 : "unset",
        boxShadow: dark ? "inset 0 0 0 1000px rgba(0,0,0,.4)" : "none",
        overflow: scrollOnMobile && isSmallScreen ? "scroll" : "unset",
      }}
    >
      {bgDecoration ? (
        <BackgroundDecoration>{children}</BackgroundDecoration>
      ) : (
        children
      )}
    </Box>
  );
};

const BackgroundDecoration = ({ children }: PropsWithChildren) => {
  const { isSmallScreen } = useResponsiveValues();
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {!isSmallScreen && (
        <CachedImage
          src="/borders/top.png"
          height="8%"
          width="100%"
          maxHeight="70px"
          position="fixed"
          top={0}
        />
      )}
      <Box
        height="15%"
        width="100%"
        display="flex"
        justifyContent={isSmallScreen ? "center" : "space-between"}
        alignItems="center"
        padding={isSmallScreen ? "0 50px" : "25px 50px 0px 50px"}
      >
        <CachedImage
          alignSelf="center"
          justifySelf="end"
          src="/logos/logo-variant.svg"
          alt="logo-variant"
          width={"65%"}
          maxW={"300px"}
          ml={4}
        />
        {!isSmallScreen && (
          <CachedImage
            alignSelf="center"
            justifySelf="end"
            src="/logos/joker-logo.png"
            alt="/logos/joker-logo.png"
            width={"25%"}
            maxW={"150px"}
          />
        )}
      </Box>
      <Box
        sx={{
          height: { base: "80%", sm: "60%" },
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
      {!isSmallScreen && (
        <>
          <CachedImage
            src="/borders/bottom.png"
            height="8%"
            width="100%"
            maxHeight="70px"
            position="fixed"
            bottom={0}
          />
          <Box
            sx={{
              position: "fixed",
              bottom: 16,
              left: 12,
            }}
          >
            <Text size="m">BUILD YOUR DECK</Text>
          </Box>
          <Box
            sx={{
              position: "fixed",
              bottom: 16,
              right: 12,
            }}
          >
            <Text size="m">RULE THE GAME</Text>
          </Box>
        </>
      )}
    </Box>
  );
};
