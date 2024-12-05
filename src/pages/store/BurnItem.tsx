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
import BurnIcon from "../../assets/burn.svg?component";

interface IBurnItem {}

export const BurnItem = ({}: IBurnItem) => {
  const { cardScale, isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("store");
  const navigate = useNavigate();

  const { burnItem } = useStore();

  const game = useGame();
  const visible =
    (game?.len_max_current_special_cards ?? 1) < MAX_SPECIAL_CARDS;

  const price = burnItem?.cost;
  const purchased = burnItem?.purchased ?? false;

  const height = CARD_HEIGHT * cardScale * 0.8;
  const width = CARD_WIDTH * cardScale * 0.8;

  return (
    visible && (
      <Tooltip label={t("store.burn-item.tooltip")} placement="top">
        <Flex
          position="relative"
          height={`${height}px`}
          width={`${width}px`}
          cursor={purchased ? "not-allowed" : "pointer"}
          opacity={purchased ? 0.3 : 1}
          onClick={() => {
            if (!purchased) {
              navigate("/deck", { state: { inStore: true, burn: true } });
            }
          }}
        >
          <BurnIcon />
          {price && (
            <PriceBox price={Number(price)} purchased={Boolean(purchased)} />
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
                {t("store.labels.purchased").toLocaleUpperCase()}
              </Heading>
            </Box>
          )}
        </Flex>
      </Tooltip>
    )
  );
};
