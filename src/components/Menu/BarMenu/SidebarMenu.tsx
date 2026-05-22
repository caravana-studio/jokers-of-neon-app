import { Box, Divider, Flex, Heading, Skeleton, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useCurrentPageInfo } from "../../../hooks/useCurrentPageInfo";
import { useGameStore } from "../../../state/useGameStore";
import { AnimatedText } from "../../AnimatedText";
import CachedImage from "../../CachedImage";
import { LogoutMenuListBtn } from "../Buttons/Logout/LogoutMenuListBtn";
import { ContextMenuItem } from "../ContextMenuItem";
import { isInGamePath, useContextMenuItems } from "../useContextMenuItems";

export const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const page = useCurrentPageInfo();
  const { isTournament, round, gameLoading } = useGameStore();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-games",
  });

  const iconWidth = "20px";

  const [animatedText, setAnimatedText] = useState(page?.name ?? "");

  const { mainMenuItems, inGameMenuItems, extraMenuItems } =
    useContextMenuItems({
      onMoreClick: undefined,
    });

  const inGame = isInGamePath(location.pathname);
  const showRoundLoadingSkeleton =
    location.pathname === "/demo" && (gameLoading || round <= 0);

  useEffect(() => {
    setTimeout(() => {
      setAnimatedText(page?.name ?? "");
    }, 500);
  }, [page?.name]);

  return (
    <Box position="relative">
      <Flex
        width="48px"
        py={12}
        height="100%"
        flexDirection={"column"}
        justifyContent={"space-around"}
        alignItems={"center"}
        alignContent={"center"}
        zIndex={1000}
        left={0}
        top={0}
        backgroundColor={"black"}
      >
      <Flex
        flexDirection={"column"}
        gap={0}
        justifyContent={"center"}
        alignItems={"center"}
        w="100%"
      >
        {(!inGame ? mainMenuItems : inGameMenuItems).map((item) => {
          const { key, ...menuItem } = item;
          return (
            <ContextMenuItem
              key={key}
              {...menuItem}
              nameKey={key}
              pulse={item.pulse}
            />
          );
        })}

        {inGame && (
          <>
            <Divider my={3} />
            {extraMenuItems.map((item) => (
              <Box key={item.key} w="100%">
                <ContextMenuItem
                  {...item}
                  nameKey={item.key}
                  onClick={item.onClick}
                />
              </Box>
            ))}
          </>
        )}
      </Flex>
      <Flex
        gap={4}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        flex={1}
      >
        <Flex
          flexDirection={"column"}
          pt={8}
          justifyContent={"center"}
          alignItems={"center"}
          onClick={() => page?.url && navigate(page.url)}
          cursor={"pointer"}
          flex={1}
        >
          {showRoundLoadingSkeleton ? (
            <Skeleton
              height="110px"
              width="12px"
              borderRadius="999px"
              startColor="whiteAlpha.300"
              endColor="whiteAlpha.500"
            />
          ) : (
            <AnimatedText duration={0.5} displayedText={page?.name ?? ""}>
              <Heading
                variant="italic"
                as="div"
                size={"sm"}
                textTransform={"uppercase"}
                flex={1}
                sx={{
                  writingMode: "vertical-lr",
                  whiteSpace: "nowrap",
                  transform: "rotate(-180deg)",
                }}
              >
                {animatedText}
              </Heading>
            </AnimatedText>
          )}
          {/*           <MenuBtn
            icon={page?.icon ?? Icons.CIRCLE}
            description={""}
            width={iconWidth}
          /> */}
          {/*           <Flex
            sx={{
              w: "80px",
              transform: "rotate(-90deg)",
              alignItems: "center",
            }}
          >
            <CachedImage src="/logos/jn.png" height="15px" />
          </Flex> */}
        </Flex>
        {inGame && isTournament && (
          <Tooltip label={t("tournament-game")} placement="right">
            <Box>
              <CachedImage src="/tournament-entry.png" height="20px" />
            </Box>
          </Tooltip>
        )}
        <LogoutMenuListBtn width={iconWidth} />
      </Flex>
      </Flex>

    </Box>
  );
};
