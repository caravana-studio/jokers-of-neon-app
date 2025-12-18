import { Box, Divider, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { matchPath, useNavigate, useLocation } from "react-router-dom";
import { useCurrentPageInfo } from "../../../hooks/useCurrentPageInfo";
import { AnimatedText } from "../../AnimatedText";
import { LogoutMenuListBtn } from "../Buttons/Logout/LogoutMenuListBtn";
import { ContextMenuItem } from "../ContextMenuItem";
import { gameUrls, useContextMenuItems } from "../useContextMenuItems";
import { MotionBox } from "../../MotionBox";
import { DailyMissions } from "../../DailyMissions/DailyMissions";
import { DailyMissionsPopup } from "../../DailyMissions/DailyMissionsPopup";
import { useInformationPopUp } from "../../../providers/InformationPopUpProvider";
import { VIOLET } from "../../../theme/colors";
import { useGameStore } from "../../../state/useGameStore";
import { GameStateEnum } from "../../../dojo/typescript/custom";

export const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const page = useCurrentPageInfo();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { setInformation } = useInformationPopUp();
  const menuRef = useRef<HTMLDivElement>(null);
  const { state } = useGameStore();

  const iconWidth = "20px";

  const [animatedText, setAnimatedText] = useState(page?.name ?? "");

  // Route detection for Daily Missions behavior
  const isGameplayPage = location.pathname === "/demo" && (state === GameStateEnum.Round || state === GameStateEnum.Rage);
  const isPopupPage = ["/deck", "/docs", "/map"].includes(location.pathname);
  const isHiddenPage = ["/settings-game", "/plays"].includes(location.pathname);

  const handleDailyMissionsClick = () => {
    if (isPopupPage) {
      // On deck, docs, or map pages, open large popup
      setInformation(<DailyMissionsPopup />);
    } else if (isGameplayPage) {
      // On gameplay screen, open dropdown menu
      onToggle();
    }
    // On hidden pages, button won't be rendered so this won't be called
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

  // Close daily missions menu when route changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      // Add a small delay to prevent closing immediately after opening
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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
            {extraMenuItems
              .filter((item) => item.key !== "daily-missions" || !isHiddenPage)
              .map((item) => (
                <ContextMenuItem
                  {...item}
                  onClick={item.key === "daily-missions" ? handleDailyMissionsClick : item.onClick}
                />
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

      {/* Daily Missions Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <MotionBox
            ref={menuRef}
            position="fixed"
            left="48px"
            bottom="180px"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            zIndex={1100}
            width="290px"
            maxHeight="400px"
            overflowY="auto"
            borderRadius="10px"
            border="2px solid #DAA1E8FF"
            boxShadow={`0px 0px 15px 7px ${VIOLET}`}
            backgroundColor="rgba(0, 0, 0, 0.95)"
            p={4}
            sx={{
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              '-ms-overflow-style': 'none',
              'scrollbar-width': 'none'
            }}
          >
            <DailyMissions showTitle={true} fontSize="13px" />
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};
