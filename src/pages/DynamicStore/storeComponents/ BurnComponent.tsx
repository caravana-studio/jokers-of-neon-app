import { Box, Flex, Heading, Tooltip } from "@chakra-ui/react";
import useResizeObserver from "@react-hook/resize-observer";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BurnIcon from "../../../assets/burn.svg?component";
import { PriceBox } from "../../../components/PriceBox";
import { useStore } from "../../../providers/StoreProvider";
import { useResponsiveValues } from "../../../theme/responsiveSettings";

interface IBurnItem {}

export const BurnComponent = ({}: IBurnItem) => {
  const { cardScale, isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("store");
  const navigate = useNavigate();

  const { burnItem } = useStore();

  const price = burnItem?.cost;
  const purchased = burnItem?.purchased ?? false;
  const flexRef = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState<number | undefined>(undefined);

  useResizeObserver(flexRef, (entry) => {
    setHeight(entry.contentRect.height);
  });

  return (
    <Tooltip label={t("store.burn-item.tooltip")} placement="top">
      <Flex
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={"column"}
        ref={flexRef}
        onClick={() => {
          if (!purchased) {
            navigate("/deck", { state: { burn: true } });
          }
        }}
      >
        <Flex
          height={"100%"}
          w={"100%"}
          flexDirection="column"
          justifyContent={"center"}
          cursor={purchased ? "not-allowed" : "pointer"}
          opacity={purchased ? 0.3 : 1}
        >
          <BurnIcon height={`${height ? height * 0.7 : 70}px`} />
        </Flex>
        {purchased && (
          <Box>
            <Heading
              mt={{ base: -6, sm: -12 }}
              variant="italic"
              textAlign="center"
              fontSize={isSmallScreen ? 6 : 11 * cardScale}
            >
              {t("store.labels.purchased").toLocaleUpperCase()}
            </Heading>
          </Box>
        )}
        {price && (
          <PriceBox
            price={Number(price)}
            purchased={Boolean(purchased)}
            discountPrice={Number(burnItem?.discount_cost ?? 0)}
            absolutePosition={false}
          />
        )}
      </Flex>
    </Tooltip>
  );
};
