import { Box, Button, Flex, HStack, Heading, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import CachedImage from "../components/CachedImage.tsx";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { GameStateEnum } from "../dojo/typescript/custom.ts";
import { Duration } from "../enums/duration.ts";
import { useCustomNavigate } from "../hooks/useCustomNavigate.tsx";
import { StoreTopBar } from "../pages/DynamicStore/storeComponents/TopBar/StoreTopBar.tsx";
import theme from "../theme/theme";
import { colorizeText } from "../utils/getTooltip.tsx";
import { CashSymbol } from "./CashSymbol.tsx";
import { DurationSwitcher } from "./DurationSwitcher.tsx";
import { useNavigate } from "react-router-dom";

const SIZE_MULTIPLIER = isMobile ? 1.3 : 2;
const { white, neonGreen } = theme.colors;

export interface IStorePreviewComponent {
  image: JSX.Element;
  title: string;
  description: string;
  cardType?: string;
  extraDescription?: string;
  details?: string;
  price: number;
  temporalPrice?: number;
  isPack?: boolean;
  spine?: JSX.Element;
  showOverlay?: boolean;
  discountPrice?: number;
  temporalDiscountPrice?: number;
  duration?: Duration;
  onDurationChange?: (duration: Duration) => void;
  tab?: number;
}

interface IStorePreviewComponentDesktop extends IStorePreviewComponent {
  buyButton: ReactNode;
}

export const StorePreviewComponent = ({
  buyButton,
  image,
  title,
  description,
  cardType,
  extraDescription,
  details,
  price,
  temporalPrice,
  isPack = false,
  spine,
  showOverlay,
  discountPrice,
  temporalDiscountPrice,
  duration,
  onDurationChange,
}: IStorePreviewComponentDesktop) => {
  const navigate = useNavigate();
  const { t } = useTranslation(["store"]);

  return (
    <>
      <Flex
        flexDirection={"column"}
        justifyContent={"center"}
        minHeight={isMobile ? "100%" : "unset"}
        height={isMobile ? "unset" : "100%"}
        alignItems={"center"}
      >
        <Flex width={{ base: "85%", sm: "60%" }} mb={2}>
          <StoreTopBar hideReroll />
        </Flex>
        <Flex
          flexDirection={"column"}
          justifyContent={"center"}
          width={{ base: "85%", sm: "60%" }}
          margin={"0 auto"}
          bg="rgba(0, 0, 0, 0.6)"
          borderRadius="25px"
          mt={4}
          p={6}
          boxShadow={`0px 0px 10px 1px ${white}`}
          zIndex={1}
        >
          <Flex
            flexDirection={{ base: "column", sm: "row" }}
            alignItems="center"
            gap={4}
            flex="1"
            height="100%"
          >
            {isPack ? (
              <Flex
                w={{ base: "100%", sm: "35%" }}
                h={`${CARD_HEIGHT * SIZE_MULTIPLIER + 30}px`}
                justifyContent="center"
                flexDir="column"
              >
                {spine}
              </Flex>
            ) : (
              <Flex
                width={`${CARD_WIDTH * SIZE_MULTIPLIER + 30}px`}
                justifyContent={"center"}
              >
                {image}
              </Flex>
            )}

            <Flex
              flexDirection={"column"}
              width="100%"
              ml={{ base: "15px", sm: "30px" }}
              flex="1"
              height="100%"
              justifyContent={"space-between"}
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Heading size={{ base: "sm", sm: "l" }} variant="italic">
                  {title}
                </Heading>
                {!isMobile && (
                  <CachedImage
                    src={`/logos/jn-logo.png`}
                    alt={"JN logo"}
                    width="120px"
                  />
                )}
              </Flex>

              {cardType && (
                <Box mt={"20px"}>
                  <Text
                    color="white"
                    fontSize={{ base: "md", sm: "lg" }}
                    mb={2}
                    sx={{
                      position: "relative",
                      _before: {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        width: "95%",
                        height: "2px",
                        backgroundColor: "white",
                        boxShadow:
                          "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                      },
                    }}
                  >
                    {t("store.preview-card.title.card-type")}
                  </Text>
                  <Text color={neonGreen} fontSize={{ base: "md", sm: "xl" }}>
                    {cardType}
                  </Text>
                </Box>
              )}
              <Box mb={4}>
                <Text
                  color="white"
                  fontSize={{ base: "md", sm: "lg" }}
                  mb={2}
                  sx={{
                    position: "relative",
                    _before: {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      width: "95%",
                      height: "2px",
                      backgroundColor: "white",
                      boxShadow:
                        "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                    },
                  }}
                >
                  {t("store.preview-card.title.description")}
                </Text>
                <Text fontSize={{ base: "md", sm: "xl" }}>
                  {colorizeText(description)}
                </Text>
                {extraDescription && (
                  <Text
                    variant="neonGreen"
                    fontSize={{ base: "md", sm: "xl" }}
                    pt={2}
                  >
                    {extraDescription}
                  </Text>
                )}
              </Box>

              {details && (
                <Box mb={4}>
                  <Text
                    color="white"
                    fontSize={{ base: "md", sm: "lg" }}
                    mb={2}
                    sx={{
                      position: "relative",
                      _before: {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        width: "95%",
                        height: "2px",
                        backgroundColor: "white",
                        boxShadow:
                          "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 6px 20px rgba(255, 255, 255, 0.5)",
                      },
                    }}
                  >
                    {t("store.preview-card.title.details")}
                  </Text>
                  <Text color={neonGreen} fontSize={{ base: "md", sm: "xl" }}>
                    {details?.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </Text>
                </Box>
              )}

              <Box flex={1} alignItems={"end"} display={"flex"} flexDir={"row"}>
                <Flex flexDirection={"column"} gap={5}>
                  <Flex gap={3}>
                    {temporalPrice &&
                    duration !== undefined &&
                    onDurationChange ? (
                      <DurationSwitcher
                        price={price}
                        discountPrice={discountPrice}
                        temporalDiscountPrice={temporalDiscountPrice}
                        temporalPrice={temporalPrice}
                        duration={duration}
                        onDurationChange={onDurationChange}
                      />
                    ) : (
                      <Flex gap={3}>
                        <Heading
                          fontSize={{ base: "sm", sm: "lg" }}
                          variant="italic"
                        >
                          {t("store.preview-card.title.price")}
                        </Heading>
                        <Flex gap={1} alignItems="center" justifyContent={"center"}>
                          {!discountPrice && <CashSymbol />}
                          <Heading
                            fontSize={{ base: "sm", sm: "lg" }}
                            variant="italic"
                            textDecoration={
                              discountPrice ? "line-through" : "none"
                            }
                          >
                            {price}
                          </Heading>
                        </Flex>
                        {discountPrice !== 0 && (
                          <Flex gap={1} alignItems="center" justifyContent={"center"}>
                            <CashSymbol />
                            <Heading
                              fontSize={{ base: "sm", sm: "lg" }}
                              variant="italic"
                            >
                              {discountPrice}
                            </Heading>
                          </Flex>
                        )}
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </Flex>

        <Flex
          width="60%"
          gap={4}
          m={1000}
          mt={{ base: 4, sm: 8 }}
          mb={4}
          justifyContent={"flex-end"}
          margin={"0 auto"}
          flexDirection={{ base: "column", sm: "row" }}
        >
          <HStack gap={4}>
            {buyButton}
            <Button
              variant="outlineSecondaryGlow"
              onClick={() => navigate("/store")}
              height={{ base: "40px", sm: "100%" }}
              width={{ base: "50%", sm: "unset" }}
            >
              {t("store.preview-card.labels.close")}
            </Button>
          </HStack>
        </Flex>
      </Flex>
      {showOverlay && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          backgroundColor="white"
          zIndex="9999"
        />
      )}
    </>
  );
};
