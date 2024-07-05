import { Box, Button, Flex, Heading, Image, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { Background } from "../../components/Background";
import { GameMenu } from "../../components/GameMenu";
import { Loading } from "../../components/Loading";
import { PlaysTable } from "../../components/Plays/PlaysTable";
import { RollingNumber } from "../../components/RollingNumber";
import { useDojo } from "../../dojo/useDojo";
import { useCustomToast } from "../../hooks/useCustomToast";
import { useGameContext } from "../../providers/GameProvider";
import { useStore } from "../../providers/StoreProvider";
import { useGetGame } from "../../queries/useGetGame";
import { useGetStore } from "../../queries/useGetStore";
import { StoreCardsRow } from "./StoreCardsRow";

export const Store = () => {
  const { gameId, setHand } = useGameContext();
  const { data: game } = useGetGame(gameId);
  const { data: store } = useGetStore(gameId);
  const state = game?.state;
  const { onShopSkip } = useGameContext();

  const rerollCost = store?.reroll_cost ?? 0;

  const [rerolled, setRerolled] = useState(store?.reroll_executed ?? false);
  const { showErrorToast } = useCustomToast();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    store && setRerolled(store.reroll_executed);
  }, [store?.reroll_executed]);

  const {
    setup: {
      systemCalls: { skipShop },
    },
    account,
  } = useDojo();

  const { cash, shopItems, reroll } = useStore();

  const navigate = useNavigate();

  const levelUpTable = (
    <Box py={[2, 2, 2, 2, 4]}>
      {shopItems.pokerHandItems.length > 0 && <PlaysTable inStore />}
    </Box>
  );

  const rerollButton = (
    <Tooltip
      placement="right"
      label={
        rerolled ? "Available only once per level" : "Update available items"
      }
    >
      <Button
        fontSize={[10, 10, 10, 14, 14]}
        w={["unset", "unset", "unset", "100%", "100%"]}
        isDisabled={rerolled}
        onClick={() => {
          reroll().then((response) => {
            if (response) {
              setRerolled(true);
            }
          });
        }}
      >
        REROLL{isMobile && <br />} {rerollCost}ȼ
      </Button>
    </Tooltip>
  );

  const specialsButton = (
    <Button
      fontSize={[10, 10, 10, 14, 14]}
      w={["unset", "unset", "unset", "100%", "100%"]}
    >
      SEE MY{isMobile && <br />} SPECIAL CARDS
    </Button>
  );

  const nextLevelButton = (
    <Button
      my={{ base: 0, md: 6 }}
      w={["unset", "unset", "unset", "100%", "100%"]}
      onClick={() => {
        setLoading(true);
        onShopSkip();
        skipShop(account.account, gameId).then((response): void => {
          if (response.success) {
            setHand(response.cards);
            navigate("/redirect/demo");
          } else {
            setLoading(false);
            showErrorToast("Error skipping shop");
          }
        });
      }}
      lineHeight={1.6}
      variant="secondarySolid"
      fontSize={[10, 10, 10, 14, 14]}
    >
      GO TO {isMobile && <br />} NEXT LEVEL
    </Button>
  );

  useEffect(() => {
    if (state === "FINISHED") {
      navigate("/gameover");
    } else if (state === "IN_GAME") {
      navigate("/demo");
    }
  }, [state]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Background type="store" scrollOnMobile>
      {!isMobile ? (
        <Box
          sx={{
            position: "fixed",
            bottom: 7,
            left: 10,
            zIndex: 1000,
          }}
        >
          <GameMenu />
        </Box>
      ) : (
        <Box
          sx={{
            position: "fixed",
            bottom: "5px",
            right: "5px",
            zIndex: 1000,
            transform: "scale(0.7)",
          }}
        >
          <GameMenu />
        </Box>
      )}
      <Flex
        width="100%"
        height="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          width="100%"
          overflow={isMobile ? "scroll" : "auto"}
          pt={isMobile ? 4 : 0}
          px={{ base: 2, md: 14 }}
        >
          <Box
            display="flex"
            w={["100%", "100%", "35%", "35%", "35%"]}
            h={[null, null, "100%", "100%", "100%"]}
            flexDirection="column"
            justifyContent="space-between"
            pb={isMobile ? 4 : 0}
          >
            <Heading variant="italic" size="l" ml={4}>
              LEVEL UP YOUR GAME
            </Heading>
            {!isMobile && levelUpTable}
            <Box>
              <Heading
                variant={"italic"}
                size={"m"}
                mb={[2, 2, 2, 6, 6]}
                mt={[4, 4, 0, 0, 0]}
                sx={{
                  ml: 4,
                  position: "relative",
                  textShadow: `0 0 10px white`,
                  /* _after: {
                    content: '""',
                    position: "absolute",
                    bottom: -2,
                    left: 0,
                    width: "100%",
                    height: "1px",
                    background: "white",
                    boxShadow:
                      "0 0 1px 0px rgba(255, 255, 255), 0 0 8px 1px rgba(255, 255, 255)",
                  }, */
                }}
              >
                MY COINS: <RollingNumber className="italic" n={cash} /> ȼ
              </Heading>
            </Box>
          </Box>
          <Box
            w={["100%", "100%", "50%", "50%", "50%"]}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            pb={isMobile ? 4 : 0}
            pl={4}
            gap={[2, 2, 4, 6, 6]}
          >
            <Box>
              {shopItems.commonCards.length > 0 && (
                <StoreCardsRow
                  cards={shopItems.commonCards}
                  title="traditional cards"
                />
              )}
            </Box>
            <Box>
              {shopItems.modifierCards.length > 0 && (
                <StoreCardsRow
                  cards={shopItems.modifierCards}
                  title="modifiers"
                />
              )}
            </Box>
            <Box>
              {shopItems.specialCards.length > 0 && (
                <StoreCardsRow
                  cards={shopItems.specialCards}
                  title="special cards"
                />
              )}
            </Box>
          </Box>
          {isMobile && (
            <Box
              w="100%"
              background="rgba(0,0,0,0.5)"
              px={4}
              borderRadius="10px"
            >
              <Heading variant="italic" size="m" mt={4}>
                IMPROVE YOUR PLAYS
              </Heading>
              {levelUpTable}
            </Box>
          )}
          <Box
            display="flex"
            flexDirection={[
              "row-reverse",
              "row-reverse",
              "row-reverse",
              "column",
              "column",
            ]}
            w={["100%", "100%", "100%", "15%", "15%"]}
            h={[null, null, null, "100%", "100%"]}
            justifyContent={[
              "center",
              "center",
              "center",
              "space-between",
              "space-between",
            ]}
            gap={10}
            px={isMobile ? 2 : 0}
          >
            {!isMobile ? (
              <>
                {nextLevelButton}
                <Flex flexDirection="column" gap={14}>
                  {rerollButton}
                  {/* {specialsButton} */}
                  <Image
                    src="/logos/logo-variant.png"
                    alt="store-bg"
                    width="100%"
                  />
                </Flex>
              </>
            ) : (
              <Flex
                width="95%"
                justifyContent="space-between"
                my={4}
                mb={"100px"}
              >
                {rerollButton}
                {/* {specialsButton} */}
                {nextLevelButton}
              </Flex>
            )}
          </Box>
        </Box>
      </Flex>
    </Background>
  );
};
