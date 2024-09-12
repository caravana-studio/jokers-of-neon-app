import { Box, Image, Text } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { isMobile } from "react-device-detect";

interface BackgroundProps extends PropsWithChildren {
  type?: "game" | "store" | "home";
  dark?: boolean;
  scrollOnMobile?: boolean;
  bgDecoration?: boolean;
}

export const Background = ({
  children,
  type = "game",
  dark = false,
  bgDecoration: bgDecoration = false,
  scrollOnMobile = false,
}: BackgroundProps) => {
  return (
    <Box
      sx={{
        backgroundImage: `url(bg/${type}-bg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100svh",
        width: "100vw",
        position: isMobile ? "fixed" : "unset",
        bottom: isMobile ? 0 : "unset",
        boxShadow: dark ? "inset 0 0 0 1000px rgba(0,0,0,.4)" : "none",
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
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {!isMobile && (
        <Image
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
        justifyContent={isMobile ? "center" : "space-between"}
        alignItems="center"
        padding={isMobile ? "0 50px" : "25px 50px 0px 50px"}
      >
        <Image
          alignSelf="center"
          justifySelf="end"
          src="/logos/logo-variant.svg"
          alt="logo-variant"
          width={"65%"}
          maxW={"300px"}
          ml={4}
        />
        {!isMobile && (
          <Image
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
          height: "60%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
      {!isMobile && (
        <>
          <Image
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
            <Text size="m">BUIDL YOUR DECK</Text>
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
