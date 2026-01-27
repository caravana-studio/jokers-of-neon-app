import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getUserCards } from "../../api/getUserCards";
import { GalaxyBackground } from "../../components/backgrounds/galaxy/GalaxyBackground";
import CachedImage from "../../components/CachedImage";
import { DelayedLoading } from "../../components/DelayedLoading";
import { NFTPackRateInfo } from "../../components/Info/NFTPackRateInfo";
import { MobileDecoration } from "../../components/MobileDecoration";
import { packAnimation, packGlowAnimation } from "../../constants/animations";
import { RARITY, RarityLabels } from "../../constants/rarity";
import { packCutSfx, packResultSfx } from "../../constants/sfx";
import { SKINS_RARITY } from "../../data/specialCards";
import { useDojo } from "../../dojo/useDojo";
import { CardTypes } from "../../enums/cardTypes";
import { useAudio } from "../../hooks/useAudio";
import { useCardData } from "../../providers/CardDataProvider";
import { useSettings } from "../../providers/SettingsProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Intensity } from "../../types/intensity";
import { isNativeAndroid } from "../../utils/capacitorUtils";
import { colorizeText } from "../../utils/getTooltip";
import Stack from "./CardStack/Stack";
import PackTear from "./PackTear";
import { SplitPackOnce } from "./SplitPackOnce";

const getIntensity = (
  type: CardTypes,
  rarity: RARITY,
  highlightedCardSkin: RARITY,
) => {
  switch (type) {
    case CardTypes.JOKER:
      return Intensity.MEDIUM;
    case CardTypes.NEON:
      return Intensity.MEDIUM;
    case CardTypes.SPECIAL:
      if (highlightedCardSkin) {
        return Intensity.MAX;
      }
      switch (rarity) {
        case RARITY.C:
          return Intensity.MEDIUM;
        case RARITY.B:
          return Intensity.MEDIUM;
        case RARITY.A:
          return Intensity.HIGH;
        case RARITY.S:
          return Intensity.MAX;
        default:
          return Intensity.MEDIUM;
      }
    default:
      return Intensity.LOW;
  }
};

export interface SimplifiedCard {
  card_id: number;
  skin_id: number;
}

interface ExternalPackProps {
  initialCards?: SimplifiedCard[];
  onContinue?: () => void;
  packId?: number;
  returnTo?: string;
  ownedCardIds?: string[];
}

export const ExternalPack = ({
  initialCards,
  onContinue,
  packId: providedPackId,
  returnTo,
  ownedCardIds: providedOwnedCardIds,
}: ExternalPackProps) => {
  const { t } = useTranslation("intermediate-screens");
  const { t: tPack } = useTranslation("intermediate-screens", {
    keyPrefix: "external-pack",
  });

  const params = useParams();
  const location = useLocation();
  const locationState = location.state as ExternalPackProps | null;
  const packId =
    providedPackId ?? locationState?.packId ?? Number(params.packId ?? 1);
  const returnPath = returnTo ?? locationState?.returnTo ?? "/";

  const { t: tDocs } = useTranslation("docs");
  const { t: tGame } = useTranslation("game");
  const { getCardData } = useCardData();
  const {
    account: { account },
  } = useDojo();

  const [allCardsSeen, setAllCardsSeen] = useState(false);
  const initialCardsSource =
    (initialCards && initialCards.length > 0 ? initialCards : undefined) ??
    (locationState?.initialCards && locationState.initialCards.length > 0
      ? locationState.initialCards
      : undefined);

  const [step, setStep] = useState(0);
  const [ownedCardIds, setOwnedCardIds] = useState<Set<string>>(new Set());
  const [ownedCardsLoaded, setOwnedCardsLoaded] = useState(false);

  const { isSmallScreen } = useResponsiveValues();

  const packWidth = useMemo(() => (isSmallScreen ? 250 : 292), [isSmallScreen]);
  const extraPackWidth = packWidth + 50;
  const packHeight = useMemo(
    () => (isSmallScreen ? 405 : 472),
    [isSmallScreen],
  );

  const [obtainedCards, setObtainedCards] = useState<SimplifiedCard[]>(
    initialCardsSource ?? [],
  );
  const [highlightedCard, setHighlightedCard] = useState<number | null>(null);
  const resolvedHighlightedCard =
    highlightedCard ?? obtainedCards?.[0]?.card_id ?? null;

  const {
    name,
    description,
    type,
    animation,
    price,
    rarity,
    temporaryPrice,
    details,
  } =
    resolvedHighlightedCard !== null
      ? getCardData(resolvedHighlightedCard)
      : {
          name: "",
          description: "",
          type: CardTypes.NONE,
        };

  const navigate = useNavigate();
  const highlightedCardSkin =
    obtainedCards.find((card) => card.card_id === highlightedCard)?.skin_id ??
    0;

  const shouldDisableHeavyBackground = isNativeAndroid;

  const { sfxVolume } = useSettings();
  const { play: playPackCut } = useAudio(packCutSfx, sfxVolume);
  const { play: playPackResult } = useAudio(packResultSfx, sfxVolume);

  // Use pre-open ownedCardIds from props or navigation state
  const preOpenOwnedCardIds =
    providedOwnedCardIds ?? locationState?.ownedCardIds;

  useEffect(() => {
    // Use pre-open ownedCardIds from props or navigation state if available
    // This ensures new cards from the pack are correctly marked as "NEW"
    if (preOpenOwnedCardIds && preOpenOwnedCardIds.length >= 0) {
      setOwnedCardIds(new Set(preOpenOwnedCardIds));
      setOwnedCardsLoaded(true);
      return;
    }

    if (!account?.address) {
      setOwnedCardIds(new Set());
      setOwnedCardsLoaded(false);
      return;
    }

    let cancelled = false;
    getUserCards(account.address)
      .then((data) => {
        if (cancelled) return;
        setOwnedCardIds(new Set(data.ownedCardIds ?? []));
        setOwnedCardsLoaded(true);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("ExternalPack: failed to load user collection", error);
        setOwnedCardIds(new Set());
        setOwnedCardsLoaded(false);
      });

    return () => {
      cancelled = true;
    };
  }, [account?.address, preOpenOwnedCardIds]);

  const cardsData = useMemo(
    () =>
      [...obtainedCards].reverse().map((card, index) => {
        const skinId = card.skin_id ?? 0;

        return {
          id: index,
          cardId: card.card_id,
          skinId,
          img: `/Cards/${card.card_id}${skinId !== 0 ? `_sk${skinId}` : ""}.png`,
        };
      }),
    [obtainedCards],
  );

  // Ensure the first render highlights the first real card instead of the fallback (ID 0 / 2 de trébol).
  useEffect(() => {
    if (resolvedHighlightedCard === null && obtainedCards.length > 0) {
      setHighlightedCard(obtainedCards[0].card_id);
    }
  }, [obtainedCards, resolvedHighlightedCard]);

  return (
    <DelayedLoading ms={100}>
      {!shouldDisableHeavyBackground && (
        <GalaxyBackground
          opacity={step >= 3 ? 1 : 0}
          intensity={getIntensity(
            type ?? CardTypes.NONE,
            rarity ?? RARITY.C,
            SKINS_RARITY[highlightedCardSkin],
          )}
        />
      )}

      {allCardsSeen && (
        <Button
          position="absolute"
          bottom={isSmallScreen ? "30px" : "80px"}
          right={isSmallScreen ? "15px" : "30px"}
          onClick={() => {
            onContinue ? onContinue() : navigate(returnPath);
          }}
          zIndex={20}
        >
          {isSmallScreen ? (
            <FontAwesomeIcon color="white" fontSize={13} icon={faCaretRight} />
          ) : (
            tPack("continue")
          )}
        </Button>
      )}
      <Flex flexDirection={"column"} width={"100%"} height={"100%"}>
        <MobileDecoration />
        <Flex
          flexDirection={"column"}
          gap={4}
          justifyContent={"center"}
          alignItems={"center"}
          p={4}
          height={"100%"}
          width={"100%"}
          transition="all 2s ease"
          backgroundColor={step === 0 ? "transparent" : "rgba(0,0,0,0.7)"}
        >
          {step === 0 && (
            <>
              <Flex flexDirection="column" textAlign="center">
                <Heading
                  fontWeight={500}
                  size="l"
                  letterSpacing={1.3}
                  variant="italic"
                  textTransform="unset"
                  textShadow={"0 0 10px white"}
                >
                  {t(`shop.packs.${packId}.name`)}
                </Heading>
                <Text
                  size="l"
                  textTransform={"uppercase"}
                  fontWeight={600}
                  textShadow={"0 0 10px black"}
                  color={packId > 4 ? "gold" : "white"}
                >
                  -{" "}
                  {t(
                    `shop.packs.${packId > 4 ? "limited-edition" : "player-pack"}`,
                  )}{" "}
                  -
                </Text>
              </Flex>
              <NFTPackRateInfo
                name={t(`shop.packs.${packId}.name`)}
                details={t(
                  `shop.packs.${packId > 4 ? "limited-edition" : "player-pack"}`,
                )}
                packId={packId}
              />
            </>
          )}

          {step === 4 && (
            <Flex
              key={`${name}-${type}`}
              flexDirection="column"
              textAlign="center"
              zIndex={10}
              height={isSmallScreen ? "150px" : "250px"}
              justifyContent={"center"}
              mt={isSmallScreen ? 0 : 14}
              sx={{
                animation: "0.3s ease-out slideIn",
                "@keyframes slideIn": {
                  from: {
                    opacity: 0,
                    transform: "translateX(-30px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateX(0)",
                  },
                },
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
            >
              <Heading
                fontWeight={500}
                size="l"
                letterSpacing={1.3}
                textTransform="unset"
              >
                {name}
              </Heading>
              <Text size="l" textTransform="lowercase" fontWeight={600}>
                -{" "}
                {tGame(
                  `game.card-types.${highlightedCardSkin > 1 ? "skin-special" : type}`,
                )}{" "}
                -
              </Text>
            </Flex>
          )}

          {step === 1 && (
            <Flex
              transform="translateY(35vh)"
              opacity={0}
              transition="opacity 1s ease"
              sx={{
                "@keyframes fadeIn": {
                  "0%": { opacity: 0 },
                  "100%": { opacity: 1 },
                },
                animation: "fadeIn 1s ease 3s forwards",
              }}
            >
              <Text size="lg">{tPack("draw-line")}</Text>
            </Flex>
          )}

          {/* PACK AREA */}
          <Flex
            h={packHeight}
            width={`${packWidth}px`}
            position="relative"
            zIndex={5}
            transform={
              step === 0
                ? "unset"
                : step === 1
                  ? "translateY(40vh)"
                  : step === 2
                    ? "translateY(40vh)"
                    : "translateY(50vh)"
            }
            transition="all 2s ease"
          >
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                position: "relative",
              }}
            >
              {/* Step < 2 → normal pack + overlay cutout */}
              {step < 2 && (
                <>
                  <PackTear
                    onOpened={() => {
                      playPackCut();
                      setStep(2);
                    }}
                    width={extraPackWidth}
                    packWidth={packWidth}
                    step={step}
                    color={packId > 3 ? "white" : "black"}
                  />
                  <CachedImage
                    src={`/packs/${packId}.png`}
                    h="100%"
                    animation={
                      step === 0
                        ? `${packGlowAnimation} 1s ease-in-out infinite, ${packAnimation} 3s ease-in-out infinite`
                        : "none"
                    }
                  />
                </>
              )}

              {/* Step 2 → pack split in 2 with animation */}
              {step >= 2 && (
                <SplitPackOnce
                  width={packWidth}
                  height={packHeight}
                  src={`/packs/${packId}.png`}
                  onDone={() => {
                    playPackResult();
                    setStep(3);

                    const timer = setTimeout(() => {
                      setStep(4);
                    }, 1000);
                    return () => clearTimeout(timer);
                  }}
                  step={step}
                />
              )}
            </div>
          </Flex>

          <Flex
            position={"absolute"}
            transform={`translateY(${step >= 3 ? 0 : "60vh"})`}
            transition="all 1s ease"
            opacity={step >= 3 ? 1 : 0}
            zIndex={2}
            pointerEvents={step >= 3 ? "all" : "none"}
          >
            <Flex animation={`${packAnimation} 2s ease-in-out infinite`}>
              {obtainedCards?.length > 0 && (
                <Stack
                  randomRotation={true}
                  sensitivity={180}
                  sendToBackOnClick={true}
                  cardDimensions={{
                    width: packWidth - 10,
                    height: packHeight - 40,
                  }}
                  cardsData={cardsData}
                  ownedCardIds={ownedCardIds}
                  onCardChange={(cardId) => {
                    setHighlightedCard(cardId);
                  }}
                  onAllSeen={() => setAllCardsSeen(true)}
                />
              )}
            </Flex>
          </Flex>

          {step === 0 && (
            <Button
              mt={6}
              onClick={() => {
                setStep(1);
              }}
              width={isSmallScreen ? "40%" : "200px"}
              variant={"secondarySolid"}
              fontFamily="Oxanium"
              fontSize={14}
            >
              {tPack("open")}
            </Button>
          )}
          {step === 4 && (
            <Flex
              key={`${description}-${rarity}`}
              flexDir="column"
              alignItems={"center"}
              height={isSmallScreen ? "120px" : "200px"}
              mb={isSmallScreen ? 0 : 16}
              pointerEvents="none"
              zIndex={10}
              sx={{
                animation: "0.3s ease-out slideIn",
                "@keyframes slideIn": {
                  from: {
                    opacity: 0,
                    transform: "translateX(-30px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateX(0)",
                  },
                },
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
            >
              <Text
                textAlign="center"
                size="xl"
                zIndex={10}
                fontSize={"17px"}
                width={"65%"}
              >
                {colorizeText(description)}
              </Text>
              {
                <Text
                  zIndex={10}
                  textAlign="center"
                  size="l"
                  fontSize={"14px"}
                  width={"65%"}
                  opacity={rarity ? 1 : 0}
                >
                  {tDocs(`rarity.${RarityLabels[rarity as RARITY]}`)}
                  {highlightedCardSkin > 1 &&
                    ` - ${tGame("game.skin")} ${tDocs(`rarity.${RarityLabels[SKINS_RARITY[highlightedCardSkin]]}`)}`}
                </Text>
              }
            </Flex>
          )}
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
