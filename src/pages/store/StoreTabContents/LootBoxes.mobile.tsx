import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LootBoxRateInfo } from "../../../components/Info/LootBoxRateInfo";
import { LootBox, LootBoxRef } from "../../../components/LootBox";
import { PriceBox } from "../../../components/PriceBox";
import { BlisterPackItem } from "../../../dojo/typescript/models.gen";
import { useCardData } from "../../../providers/CardDataProvider";
import { usePageTransitions } from "../../../providers/PageTransitionsProvider";
import { useStore } from "../../../providers/StoreProvider";
import { useGameStore } from "../../../state/useGameStore";
import { useShopStore } from "../../../state/useShopStore";
import { GREY_LINE } from "../../../theme/colors";
import theme from "../../../theme/theme";

export const LootBoxesMobile = () => {
  const { packs } = useShopStore();

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
  const { buyPack } = useStore();
  const { locked } = useShopStore();
  const [buyDisabled, setBuyDisabled] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const { cash } = useGameStore();
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

  const lootBoxRef = useRef<LootBoxRef>(null);
  const notEnoughCash =
    !card.price ||
    (pack.discount_cost ? cash < pack.discount_cost : cash < card.price);

  const { getLootBoxData } = useCardData();

  const { name, description, details, size } = getLootBoxData(
    card.card_id ?? 0
  );

  const handleBuyClick = useMemo(
    () => () => {
      setBuyDisabled(true);
      setIsAnimationRunning(true);
      lootBoxRef.current?.openBox();
      buyPack(pack)
        .then((response) => {
          if (!response) {
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
      <Flex flexDirection="row" height="100%" alignItems="stretch">
        <Flex
          width="40%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Flex key={`pack-${pack.blister_pack_id}`} w="100%" h="100%" pl={2}>
            <LootBox
              ref={lootBoxRef}
              boxId={pack.blister_pack_id}
              width={500}
              height={1500}
              xOffset={-270}
              isPurchased={pack.purchased.valueOf() && !isAnimationRunning}
              onOpenAnimationStart={openAnimationCallBack}
            />
          </Flex>
        </Flex>

        <Flex width="60%" flexDirection="column" justifyContent="space-between">
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
