import { Button, Tooltip } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import CachedImage from "../../components/CachedImage.tsx";
import SpineAnimation, {
  SpineAnimationRef,
} from "../../components/SpineAnimation.tsx";
import { StorePreviewComponent } from "../../components/StorePreviewComponent.tsx";
import { animationsData } from "../../constants/spineAnimations.ts";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { usePageTransitions } from "../../providers/PageTransitionsProvider.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import { getCardData } from "../../utils/getCardData.ts";

export const PreviewLootBox = () => {
  const { state } = useLocation();

  const { card, pack } = state || {};

  const [buyDisabled, setBuyDisabled] = useState(false);
  const { t } = useTranslation("store", { keyPrefix: "store.preview-card" });

  if (!card) {
    return <p>Card not found.</p>;
  }

  const game = useGame();
  const { buyPack, locked } = useStore();
  const cash = game?.cash ?? 0;
  const { name, description, details } = getCardData(card, true);
  const spineAnimationRef = useRef<SpineAnimationRef>(null);

  const notEnoughCash =
    !card.price ||
    (pack.discount_cost ? cash < pack.discount_cost : cash < card.price);

  const { transitionTo } = usePageTransitions();

  const openAnimationCallBack = () => {
    setTimeout(() => {
      transitionTo("/open-loot-box");
    }, 200);
  };

  const buyButton = (
    <Button
      onClick={() => {
        setBuyDisabled(true);
        spineAnimationRef.current?.playOpenBoxAnimation();
        buyPack(pack)
          .then((response) => {
            if (response) {
              // setLockRedirection(true);
            } else {
              setBuyDisabled(false);
            }
          })
          .catch(() => {
            setBuyDisabled(false);
          });
      }}
      isDisabled={notEnoughCash || locked || buyDisabled}
      variant="outlinePrimaryGlow"
      height={{ base: "40px", sm: "100%" }}
      width={{ base: "50%", sm: "unset" }}
    >
      {t("labels.buy")}
    </Button>
  );

  const tooltipButton = notEnoughCash ? (
    <Tooltip label={t("tooltip.no-coins")}>{buyButton}</Tooltip>
  ) : (
    buyButton
  );

  const image = (
    <CachedImage
      src={`/Cards/${card.img}.png`}
      alt={`Pack`}
      borderRadius="10px"
    />
  );

  const spineAnim = (
    <SpineAnimation
      ref={spineAnimationRef}
      jsonUrl={`/spine-animations/loot_box_${pack.blister_pack_id}.json`}
      atlasUrl={`/spine-animations/loot_box_${pack.blister_pack_id}.atlas`}
      initialAnimation={animationsData.loopAnimation}
      loopAnimation={animationsData.loopAnimation}
      openBoxAnimation={animationsData.openBoxAnimation}
      width={1200}
      height={1500}
      xOffset={-650}
      scale={1}
      onOpenAnimationStart={openAnimationCallBack}
    />
  );

  return (
    <StorePreviewComponent
      buyButton={tooltipButton}
      image={image}
      title={name}
      description={description}
      price={card.price}
      details={details}
      isPack
      spine={spineAnim}
      showOverlay={false}
      discountPrice={pack.discount_cost}
    />
  );
};
