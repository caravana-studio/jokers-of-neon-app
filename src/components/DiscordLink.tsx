import { Box, Link, Tooltip } from "@chakra-ui/react";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { IconComponent } from "./IconComponent";
import { Icons } from "../constants/icons";

export const PositionedDiscordLink = () => {
  return (
    <LinkContainer>
      <DiscordLink width="25px" />
    </LinkContainer>
  );
};

export const DiscordLink = ({ width }: { width: string }) => {
  const { t } = useTranslation(["home"]);
  const { isSmallScreen } = useResponsiveValues();

  return (
    <Link href="https://discord.gg/4y296W6jaq" target="_blank">
      <Tooltip label={t("home.join-discord")} placement="left">
        <IconComponent width={width} icon={Icons.DISCORD} height={width} />
      </Tooltip>
    </Link>
  );
};

const LinkContainer = ({ children }: PropsWithChildren) => {
  const { isSmallScreen } = useResponsiveValues();

  return isSmallScreen ? (
    <Box
      zIndex={999}
      position="absolute"
      right="15px"
      bottom="25px"
      cursor="pointer"
    >
      {children}
    </Box>
  ) : (
    <Box
      zIndex={999}
      position="absolute"
      right="20px"
      bottom="15px"
      cursor="pointer"
    >
      {children}
    </Box>
  );
};
