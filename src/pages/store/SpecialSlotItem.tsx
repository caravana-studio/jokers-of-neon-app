import { Box, Flex, Heading, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage";
import { PriceBox } from "../../components/PriceBox";
import { MAX_SPECIAL_CARDS } from "../../constants/config";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps";
import { useGame } from "../../dojo/queries/useGame";
import { useStore } from "../../providers/StoreProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";

interface ISpecialSlotItem {}

export const SpecialSlotItem = ({}: ISpecialSlotItem) => {
  const { cardScale, isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("store", { keyPrefix: "store.special-slot" });
  const navigate = useNavigate();

  const { specialSlotItem } = useStore();

  const game = useGame();
  const visible =
    (game?.special_slots ?? 1) < MAX_SPECIAL_CARDS;

  const price = specialSlotItem?.cost;
  const purchased = specialSlotItem?.purchased ?? false;

  const height = CARD_HEIGHT * cardScale * 0.8;
  const width = CARD_WIDTH * cardScale * 0.8;

  return (
    visible && (
      <Tooltip label={t("tooltip")} placement="top">
        <Flex
          position="relative"
          height={`${height}px`}
          width={`${width}px`}
          cursor={purchased ? "not-allowed" : "pointer"}
          onClick={() => {
            if (!purchased && !isSmallScreen) {
              navigate("/preview/slot");
            }
          }}
        >
          <CachedImage
            opacity={purchased ? 0.3 : 1}
            src="/store/slot-icon.png"
            alt="slot-icon"
          />
          {price && (
            <PriceBox
              price={Number(price)}
              purchased={Boolean(purchased)}
              discountPrice={Number(specialSlotItem?.discount_cost ?? 0)}
              fontSize={isSmallScreen ? 12 : 16}
              discountFontSize={isSmallScreen ? 10 : 12}
            />
          )}
          {purchased && (
            <Box
              sx={{
                position: "absolute",
                top: `${height / 2 - 10}px`,
                left: 0,
                zIndex: 10,
              }}
            >
              <Heading
                variant="italic"
                fontSize={isSmallScreen ? 6 : 11 * cardScale}
              >
                PURCHASED
              </Heading>
            </Box>
          )}
        </Flex>
      </Tooltip>
    )
  );
};
