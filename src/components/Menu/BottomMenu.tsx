import { Flex } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Icons } from "../../constants/icons";
import { GameStateEnum } from "../../dojo/typescript/custom";
import { useGameStore } from "../../state/useGameStore";
import { needsPadding } from "../../utils/capacitorUtils";
import { ConfirmationModal } from "../ConfirmationModal";
import { BottomMenuItem } from "./BottomMenuItem";


const mainMenuUrls = [
  "/",
  "/my-collection",
  "/my-games",
  "/profile",
  "/settings",
  "/leaderboard",
];

const gameUrls = [
  "/demo",
  "/store",
  "/rewards",
  "/redirect",
  "/gameover/:gameId",
  "/open-loot-box",
  "/entering-tournament",
  "/preview/:type",
  "/loot-box-cards-selection",
  "/manage"
]

const getIcon = (state: GameStateEnum) => {
  switch (state) {
    case GameStateEnum.Rage:
      return Icons.RAGE;
    case GameStateEnum.Round:
      return Icons.ROUND;
    default:
      return Icons.STORE; 
  }
}

export const BottomMenu = () => {
  const { t } = useTranslation("game", { keyPrefix: "bottom-menu"});
  const location = useLocation();
  const url = location.pathname;
  const { state } = useGameStore();
  const [confimrLeaveGameOpen, setConfirmLeaveGameOpen] = useState(false);
  const navigate = useNavigate();

  const mainMenuItems = useMemo(
    () => [
      <BottomMenuItem
        icon={Icons.HOME}
        url="/"
        active={url === "/"}
        key="home"
      />,
      <BottomMenuItem
        icon={Icons.DOCS}
        url="/my-collection"
        active={url === "/my-collection"}
        key="docs"
      />,
      <BottomMenuItem
        icon={Icons.JOKER}
        url="/my-games"
        active={url === "/my-games"}
        key="joker"
      />,
      <BottomMenuItem
        icon={Icons.PROFILE}
        url="/profile"
        active={url === "/profile"}
        key="profile"
      />,
      <BottomMenuItem
        icon={Icons.SETTINGS}
        url="/settings"
        active={url === "/settings"}
        key="settings"
      />,
    ],
    [url]
  );

  const inGameMenuItems = [
    <BottomMenuItem icon={Icons.BACK} url="/" key="arrow-left" onClick={() => setConfirmLeaveGameOpen(true)} />,
    <BottomMenuItem
      icon={Icons.LIST}
      url="/docs"
      active={url === "/docs"}
      key="docs"
    />,
    <BottomMenuItem
      icon={Icons.MAP}
      url="/map"
      active={url === "/map"}
      key="map"
    />,
    <BottomMenuItem
      icon={Icons.CLUB}
      url="/deck"
      active={url === "/deck"}
      key="deck"
    />,
    <BottomMenuItem
      icon={getIcon(state)}
      url="/redirect"
      disabled={state === GameStateEnum.Map}
      active={gameUrls.some(gameUrl => {
        if (gameUrl.includes(":")) {
          const base = gameUrl.split(":")[0];
          return url.startsWith(base);
        }
        return url === gameUrl;
      })}
      key="game"
    />, 
  ];

  return (
    <>
      <Flex
        h="50px"
        w="100%"
        backgroundColor="black"
        alignItems="center"
        zIndex={1000}
        position="absolute"
        bottom={needsPadding ? "30px" : "0px"}
      >
        {mainMenuUrls.includes(url) ? mainMenuItems : inGameMenuItems}
      </Flex>
      {confimrLeaveGameOpen && (
        <ConfirmationModal
          close={() => setConfirmLeaveGameOpen(false)}
          title={t("title")}
          description={t("description")}
          onConfirm={() => {
            navigate("/");
            setConfirmLeaveGameOpen(false)
          }}
        />
        )}
      <Flex
        position="absolute"
        zIndex={900}
        backgroundColor="black"
        bottom={0}
        w="100%"
        height="50px"
      />
    </>
  );
};
