import { Box, Text } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { CLASSIC_MOD_ID } from "../constants/general";
import { useGameContext } from "../providers/GameProvider";
import { useResponsiveValues } from "../theme/responsiveSettings";
import CachedImage from "./CachedImage";

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
  const baseUrl = import.meta.env.VITE_MOD_URL + modId + "/resources/bg";

  useEffect(() => {
    const loadBackgroundImage = async () => {
      if (modId !== CLASSIC_MOD_ID) {
        const imageUrl = `${baseUrl}/${type}-bg.jpg`;
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
          modId === CLASSIC_MOD_ID
            ? getBackgroundImage(type)
            : backgroundImageUrl != "none"
              ? backgroundImageUrl
              : getBackgroundImage(type),
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
