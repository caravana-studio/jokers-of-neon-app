import { Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { Icons } from "../constants/icons";
import { MenuBtn } from "./Menu/Buttons/MenuBtn";

export const PositionedDiscordLink = () => {
    const { isSmallScreen } = useResponsiveValues();

  return (
    <LinkContainer>
      <DiscordLink width={isSmallScreen ?"25px" : "40px"} />
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
    <MenuBtn
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
      right="30px"
      bottom="70px"
      cursor="pointer"
    >
      {children}
    </Box>
  );
};
