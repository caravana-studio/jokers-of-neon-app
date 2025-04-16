import { Box, Link, Tooltip } from "@chakra-ui/react";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { IconComponent } from "./IconComponent";
import { Icons } from "../constants/icons";
import { BarMenuBtn } from "./Menu/Buttons/BarMenuBtn";

export const PositionedDiscordLink = () => {
  return (
    <LinkContainer>
      <DiscordLink width="25px" />
    </LinkContainer>
  );
};

export const DiscordLink = ({
  width,
  label,
}: {
  width: string;
  label?: boolean;
}) => {
  const { t } = useTranslation(["home"]);

  return (
    <BarMenuBtn
      width={width}
      icon={Icons.DISCORD}
      description={t("home.join-discord")}
      label={label ? "Discord" : undefined}
      onClick={() =>
        window.open(
          "https://discord.gg/4y296W6jaq",
          "_blank",
          "noopener,noreferrer"
        )
      }
    />
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
