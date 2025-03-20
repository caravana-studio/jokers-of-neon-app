import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LootBoxRateInfo } from "../../../components/Info/LootBoxRateInfo";
import { PriceBox } from "../../../components/PriceBox";
import SpineAnimation, {
  SpineAnimationRef,
} from "../../../components/SpineAnimation";
import { animationsData } from "../../../constants/spineAnimations";
import { useGame } from "../../../dojo/queries/useGame";
import { BlisterPackItem } from "../../../dojo/typescript/models.gen";
import { usePageTransitions } from "../../../providers/PageTransitionsProvider";
import { useStore } from "../../../providers/StoreProvider";
import { GREY_LINE } from "../../../theme/colors";
import theme from "../../../theme/theme";
import { getCardData } from "../../../utils/getCardData";

export const LootBoxesMobile = () => {
  const { packs } = useStore();

  return (
    <Flex
      className="game-tutorial-step-packs"
      m={1}
      flexGrow={1}
      w="100%"
      gap={2}
      flexDirection={"column"}
      grow={1}
      pt={1}
      pb={1}
      overflow="scroll"
    >
      {packs.map((pack) => {
        return <PackView key={`pack-${pack.blister_pack_id}`} pack={pack} />;
      })}
    </Flex>
  );
};

const PackView = ({ pack }: { pack: BlisterPackItem }) => {
  const { buyPack, locked, setLockRedirection } = useStore();
  const [buyDisabled, setBuyDisabled] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const game = useGame();
  const cash = game?.cash ?? 0;
  const { neonGreen } = theme.colors;
  const { t } = useTranslation(["store"]);

  const { transitionTo } = usePageTransitions();

  const openAnimationCallBack = () => {
    setTimeout(() => {
      transitionTo("/open-loot-box");
    }, 200);
  };

  const card = {
    id: pack.blister_pack_id.toString(),
    img: `packs/${pack.blister_pack_id}`,
    idx: Number(pack.blister_pack_id),
    price: Number(pack.cost),
    card_id: Number(pack.blister_pack_id),
  };

  const spineAnimationRef = useRef<SpineAnimationRef>(null);
  const notEnoughCash =
    !card.price ||
    (pack.discount_cost ? cash < pack.discount_cost : cash < card.price);

  const { name, description, details, size } = getCardData(card, true);

  const handleBuyClick = useMemo(
    () => () => {
      setBuyDisabled(true);
      setIsAnimationRunning(true);
      spineAnimationRef.current?.playOpenBoxAnimation();
      buyPack(pack)
        .then((response) => {
          if (response) {
            setLockRedirection(true);
          } else {
            setBuyDisabled(false);
            setIsAnimationRunning(false);
          }
        })
        .catch(() => {
          setBuyDisabled(false);
          setIsAnimationRunning(false);
        });
    },
    [pack, buyPack]
  );

  return (
    <Flex
      flexDirection={"column"}
      justifyContent={"space-between"}
      margin={"0 auto"}
      bg="rgba(0, 0, 0, 0.6)"
      borderRadius="10px"
      pt={3}
      pb={5}
      pr={2}
      boxShadow={`0px 0px 6px 0px ${GREY_LINE}`}
      width={"95%"}
      h={"50%"}
      key={`pack-${pack.blister_pack_id}`}
      overflow="hidden"
      zIndex={1}
    >
      <Flex flexDirection="row" alignItems="center" gap={4} height="100%">
        <Flex h="100%" w="40%">
          <Flex
            key={`pack-${pack.blister_pack_id}`}
            w="100%"
            h={"100%"}
            justifyContent={"center"}
            pl={2}
          >
            <SpineAnimation
              ref={spineAnimationRef}
              jsonUrl={`/spine-animations/loot_box_${pack.blister_pack_id}.json`}
              atlasUrl={`/spine-animations/loot_box_${pack.blister_pack_id}.atlas`}
              initialAnimation={animationsData.loopAnimation}
              loopAnimation={animationsData.loopAnimation}
              openBoxAnimation={animationsData.openBoxAnimation}
              isPurchased={pack.purchased.valueOf() && !isAnimationRunning}
              xOffset={-270}
              onOpenAnimationStart={openAnimationCallBack}
            />
          </Flex>
        </Flex>

        <Flex
          flexDirection={"column"}
          width="60%"
          flex="1"
          height="100%"
          justifyContent={"space-between"}
        >
          <Flex justifyContent="space-between" mb={2} alignItems="center">
            <Heading fontWeight={"400"} fontSize={"xs"}>
              {name}
            </Heading>
          </Flex>

          <Flex mb={4} flexGrow={1} flexDir={"column"} gap={2}>
            <Text color={neonGreen} fontSize={"xs"}>
              {description}
            </Text>
            <Text color={neonGreen} fontSize={"xs"}>
              {t("store.packs.size", { size })}
            </Text>
          </Flex>

          <Flex mb={4} gap={2}>
            <LootBoxRateInfo name={name} details={details} />
          </Flex>

          <Flex alignItems={"baseline"} justifyContent={"space-between"}>
            {card.price && (
              <PriceBox
                price={card.price}
                purchased={pack.purchased}
                discountPrice={pack.discount_cost}
                absolutePosition={false}
              />
            )}
            {notEnoughCash && !pack.purchased ? (
              <Text color={neonGreen} fontSize={"xs"}>
                {t("store.labels.no-coins")}
              </Text>
            ) : (
              <Button
                onClick={handleBuyClick}
                isDisabled={
                  notEnoughCash || locked || buyDisabled || pack.purchased
                }
                width={{ base: "30%", sm: "unset" }}
                size={"xs"}
                fontSize={10}
                borderRadius={6}
                height={5}
                mr={2}
              >
                {t("store.preview-card.labels.buy")}
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
