import { Box, Divider, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { matchPath, useNavigate } from "react-router-dom";
import { useCurrentPageInfo } from "../../../hooks/useCurrentPageInfo";
import { AnimatedText } from "../../AnimatedText";
import { LogoutMenuListBtn } from "../Buttons/Logout/LogoutMenuListBtn";
import { ContextMenuItem } from "../ContextMenuItem";
import { gameUrls, useContextMenuItems } from "../useContextMenuItems";
import { DailyMissionsPopover } from "./DailyMissionsPopover";

export const SidebarMenu = () => {
  const navigate = useNavigate();
  const page = useCurrentPageInfo();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const iconWidth = "20px";

  const [animatedText, setAnimatedText] = useState(page?.name ?? "");

  const handleDailyMissionsClick = () => {
    if (isOpen) {
      onClose();
      return;
    }
    onOpen();
  };

  const { mainMenuItems, inGameMenuItems, extraMenuItems } =
    useContextMenuItems({
      onMoreClick: undefined,
    });

  const inGame = gameUrls.some((url) =>
    matchPath({ path: url, end: true }, window.location.pathname)
  );

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
        {(!inGame ? mainMenuItems : inGameMenuItems).map((item) => (
          <ContextMenuItem {...item} />
        ))}

        {inGame && (
          <>
            <Divider my={3} />
            {extraMenuItems.map((item) => {
              if (item.key === "daily-missions") {
                return (
                  <DailyMissionsPopover
                    key={item.key}
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                    trigger={
                      <Box w="100%">
                        <ContextMenuItem
                          {...item}
                          onClick={handleDailyMissionsClick}
                        />
                      </Box>
                    }
                  />
                );
              }

              return (
                <Box key={item.key} w="100%">
                  <ContextMenuItem {...item} onClick={item.onClick} />
                </Box>
              );
            })}
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
        <LogoutMenuListBtn width={iconWidth} />
      </Flex>
      </Flex>

    </Box>
  );
};
