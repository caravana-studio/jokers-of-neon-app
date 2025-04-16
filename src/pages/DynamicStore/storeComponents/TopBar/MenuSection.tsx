import { Flex, Heading } from "@chakra-ui/react";
import { MenuBtn } from "../../../../components/Menu/Buttons/MenuBtn";
import { Icons } from "../../../../constants/icons";
import { ControllerIcon } from "../../../../icons/ControllerIcon";
import { useNavigate } from "react-router-dom";
import { useCurrentPageName } from "../../../../hooks/useCurrentPageName";
import { useResponsiveValues } from "../../../../theme/responsiveSettings";
import { SettingsMenuBtn } from "../../../../components/Menu/Buttons/SettingsMenuBtn";
import { DocsMenuBtn } from "../../../../components/Menu/Buttons/DocsMenuBtn";
import { LeaderboardMenuBtn } from "../../../../components/Menu/Buttons/LeaderboardMenuBtn";
import { MapMenuBtn } from "../../../../components/Menu/Buttons/MapMenuBtn";

export const MenuSection = () => {
  const { isSmallScreen } = useResponsiveValues();
  const page = useCurrentPageName();
  const navigate = useNavigate();

  const iconWidth = "14px";

  return (
    <>
      <Flex justifyContent="space-between" alignContent={"center"}>
        <Flex
          py={1}
          justifyContent={"center"}
          alignContent={"center"}
          alignItems={"center"}
          onClick={() => page?.url && navigate(page.url)}
          cursor={"pointer"}
          flex={1}
          gap={2}
        >
          <MenuBtn icon={Icons.CIRCLE} description={""} width={"12px"} />
          <Heading
            variant="italic"
            as="div"
            size={"xs"}
            textTransform={"uppercase"}
            flex={1}
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            {page?.name ?? ""}
          </Heading>
        </Flex>
        <Flex gap={4} justifyContent={"center"} alignItems={"center"}>
          <SettingsMenuBtn width={iconWidth} />
          <DocsMenuBtn width={iconWidth} />
          <LeaderboardMenuBtn width={iconWidth} />
          <MapMenuBtn
            width={iconWidth}
            mtText={isSmallScreen ? "8px" : undefined}
            fontSizeText={isSmallScreen ? "6px" : undefined}
          />
          <ControllerIcon width={iconWidth} />
        </Flex>
      </Flex>
    </>
  );
};
