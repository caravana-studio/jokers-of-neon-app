import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DelayedLoading } from "../components/DelayedLoading";
import { SimulatedLoadingBar } from "../components/LoadingProgressBar/SimulatedLoadingProgressBar";
import { MobileDecoration } from "../components/MobileDecoration";
import { LoadingProgress } from "../types/LoadingProgress";

export const PurchasingPackPage = () => {
  const { t } = useTranslation("home", {
    keyPrefix: "packs",
  });

  const headingStages: LoadingProgress[] = [
    {
      text: t("open-pack-stages.stage-1"),
      showAt: 0,
    },
    {
      text: t("open-pack-stages.stage-2"),
      showAt: 3000,
    },
    {
      text: t("open-pack-stages.stage-3"),
      showAt: 5000,
    },
  ];

  return (
    <DelayedLoading ms={0}>
      <MobileDecoration />
      <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
        <Flex
          w={{ base: "90%", sm: "80%", md: "70%" }}
          h="100%"
          justifyContent="center"
          alignItems="center"
          zIndex={2}
        >
          <SimulatedLoadingBar headingStages={headingStages} duration={5000} />
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
