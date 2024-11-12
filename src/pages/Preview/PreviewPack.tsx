import { Box, Button, Flex, Tooltip, keyframes } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage.tsx";
import { StorePreviewComponent } from "../../components/StorePreviewComponent.tsx";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useStore } from "../../providers/StoreProvider.tsx";
import { getCardData } from "../../utils/getCardData.ts";
import SpineAnimation, {
  SpineAnimationRef,
} from "../../components/SpineAnimation.tsx";
import { animationsData } from "../../constants/spineAnimations.ts";

export const PreviewPack = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

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
  const [showOverlay, setShowOverlay] = useState(false);

  const notEnoughCash = !card.price || cash < card.price;

  const openAnimationCallBack = () => {
    setShowOverlay(true);
    setTimeout(() => {
      navigate("/redirect/open-pack");
    }, 1000);
  };

  const buyButton = (
    <Button
      onClick={() => {
        setBuyDisabled(true);
        buyPack(pack)
          .then((response) => {
            if (response) {
              spineAnimationRef.current?.playOpenBoxAnimation();
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
    <Tooltip label={t("labels.tooltip.no-coins")}>{buyButton}</Tooltip>
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
    <Flex width={"50%"}>
      <SpineAnimation
        // jsonUrl={`/spine-animations/${pack.blister_pack_id}.json`}
        // atlasUrl={`/spine-animations/${pack.blister_pack_id}.atlas`}
        ref={spineAnimationRef}
        jsonUrl={`/spine-animations/basicPack.json`}
        atlasUrl={`/spine-animations/basicPack.atlas`}
        initialAnimation={animationsData.loopAnimation}
        hoverAnimation={animationsData.hoverAnimation}
        loopAnimation={animationsData.loopAnimation}
        openBoxAnimation={animationsData.openBoxAnimation}
        width={500}
        height={1400}
        xOffset={-150}
        scale={1}
        onOpenAnimationStart={openAnimationCallBack}
      />
    </Flex>
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
      showOverlay={showOverlay}
    />
  );
};
