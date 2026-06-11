import { Box, Flex, Heading } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DelayedLoading } from "../components/DelayedLoading";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { MobileBottomBar } from "../components/MobileBottomBar";
import { MobileDecoration } from "../components/MobileDecoration";
import { useResponsiveValues } from "../theme/responsiveSettings";

interface MiniAppInfoPageLayoutProps extends PropsWithChildren {
  title?: string;
}

export const MiniAppInfoPageLayout = ({
  title,
  children,
}: MiniAppInfoPageLayoutProps) => {
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("miniapp", {
    keyPrefix: "profile-pages.actions",
  });

  return (
    <DelayedLoading ms={0}>
      <PositionedDiscordLink />
      <MobileDecoration />
      <Flex
        h="100%"
        w="100%"
        pt={isSmallScreen ? "30px" : "80px"}
        flexDir="column"
        justifyContent="flex-start"
        alignItems="center"
        minH={0}
        gap={4}
      >
        {title ? (
          <Heading variant="italic" size={isSmallScreen ? "sm" : "md"}>
            {title}
          </Heading>
        ) : null}
        <Flex
          w="100%"
          flex="1"
          overflowY="auto"
          minH={0}
          flexDir="column"
          justifyContent="flex-start"
          alignItems="center"
          px={isSmallScreen ? 4 : 8}
        >
          <Box
            w="100%"
            maxW="720px"
            color="white"
            pb={6}
            sx={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.35) transparent",
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(255,255,255,0.35)",
                borderRadius: "999px",
              },
            }}
          >
            {children}
          </Box>
        </Flex>
        <MobileBottomBar
          firstButton={{
            label: t("back-to-profile"),
            onClick: () => navigate("/profile"),
          }}
        />
      </Flex>
    </DelayedLoading>
  );
};
