import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Box, Image, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { shortenHex } from "@dojoengine/utils";
import { MouseEventHandler } from "react";
import { isMobile } from "react-device-detect";
import { ExternalToast, toast } from "sonner";
import { DAILY_MISSIONS, XP_PER_DIFFICULTY } from "../data/dailyMissions.ts";
import i18n from "../i18n.ts";
import {
  ERROR_TOAST,
  LOADING_TOAST,
  SUCCESS_TOAST,
  VIOLET_LIGHT,
} from "../theme/colors.tsx";
import { DailyMissionDifficulty } from "../types/DailyMissions.ts";
import type { LevelCompleteEvent } from "../types/ScoreData";
import { getEnvString } from "./getEnvValue.ts";
import { isNative, nativePaddingTop } from "./capacitorUtils.ts";

const TOAST_COMMON_OPTIONS: ExternalToast = {
  id: "transaction",
  position: "top-right",
  closeButton: false,
  dismissible: true,
  style: {
    maxWidth: "unset",
    padding: 0,
    backgroundColor: "transparent",
    boxShadow: "none",
    marginRight: "4px",
    right: "12px",
    left: "unset",
    width: "30px",
    top: nativePaddingTop,
  },
  duration: 1750,
};

type CircularToastProps = {
  backgroundColor: string;
  status: "loading" | "success" | "error";
  description?: string;
  onClickFn?: MouseEventHandler<HTMLDivElement>;
};

const CircularToast = ({
  backgroundColor,
  status,
  description,
  onClickFn,
}: CircularToastProps) => (
  <Tooltip
    placement="end"
    label={description}
    closeOnPointerDown
    color="white"
    backgroundColor={backgroundColor}
    padding={2}
    isDisabled={!description}
  >
    <Box
      width={isMobile ? "20px" : "30px"}
      height={isMobile ? "20px" : "30px"}
      bg={backgroundColor}
      borderRadius="50%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={onClickFn}
      cursor={onClickFn ? "pointer" : "default"}
    >
      {status === "loading" ? (
        <Spinner
          size="xs"
          thickness="2px"
          speed="0.65s"
          color="white"
        />
      ) : status === "success" ? (
        <CheckCircleIcon boxSize={isMobile ? "12px" : "20px"} color="white" />
      ) : (
        <WarningIcon boxSize={isMobile ? "12px" : "20px"} color="white" />
      )}
    </Box>
  </Tooltip>
);

export const showTransactionToast = (
  transaction_hash?: string,
  message?: string
): void => {
  const description = message || "Transaction in progress...";

  toast.loading(
    <CircularToast
      backgroundColor={LOADING_TOAST}
      status="loading"
      description={description}
    />,
    {
      ...TOAST_COMMON_OPTIONS,
    }
  );
};

const basePosition = isMobile ? "top-left" : "bottom-left";
const leftPosition = isMobile ? "8px" : "26px";
const marginTop = isMobile ? 80 : 60;

const getToastOptions = (): ExternalToast => {
  const baseStyle = {
    position: isNative
      ? "absolute"
      : ((isMobile ? "top-left" : "bottom-left") as any),
    left: leftPosition,
    margin: 0,
    ...(isNative ? { top: nativePaddingTop } : { offset: "0px" }),
  };

  return {
    position: basePosition,
    style: baseStyle,
    duration: 7000,
  };
};

const getOrdinalLabel = (count: number): string => {
  const safeCount = Math.max(0, Math.floor(count));
  const language = i18n.resolvedLanguage ?? i18n.language ?? "en";
  const rules = new Intl.PluralRules(language, { type: "ordinal" });
  const category = rules.select(safeCount);
  const key = `levelComplete.ordinal_${category}`;
  const label = i18n.t(key, {
    ns: "achievements",
    count: safeCount,
  });

  if (label === key) {
    return i18n.t("levelComplete.ordinal_other", {
      ns: "achievements",
      count: safeCount,
    });
  }

  return label;
};

export const showDailyMissionToast = (dailyMissionIds: string[]): void => {

  dailyMissionIds.forEach((id, index) => {
    const difficulty =
      DAILY_MISSIONS[id] ?? DailyMissionDifficulty.EASY;
    const xp = XP_PER_DIFFICULTY[difficulty];
    setTimeout(() => {
      toast.custom(
        (t) => (
          <Box
            display="flex"
            alignItems="center"
            bg="black"
            borderRadius="12px"
            p="10px"
            pl={isMobile ? "8px" : "80px"}
            px="20px"
            boxShadow={`0px 0px 10px 1px white`}
            maxW="300px"
            color="white"
            gap="10px"
            style={{ marginTop: index > 0 ? `${index * marginTop}px` : "0" }}
            onClick={() => {
              toast.dismiss(t);
            }}
          >
            <Image
              src="/logos/trophy.png"
              alt="Trophy Icon"
              boxSize={isMobile ? "16px" : "20px"}
              color="white"
            />
            <Box>
              <Text
                fontSize={isMobile ? "10px" : "12px"}
                color={VIOLET_LIGHT}
                fontWeight="bold"
                fontFamily="Sonara"
                textTransform="uppercase"
              >
                {i18n.t(`title`, { ns: "achievements" })} +{xp}XP
              </Text>
              <Text fontSize={isMobile ? "12px" : "14px"} fontWeight="semibold">
                {i18n.t(`data.${id}`, { ns: "achievements" })}
              </Text>
            </Box>
          </Box>
        ),
        getToastOptions()
      );
    }, index * 200);
  });
};

export const showLevelCompleteToast = (
  levelCompleteEvents: LevelCompleteEvent[]
): void => {
  levelCompleteEvents.forEach((event, index) => {
    const ordinalLabel = getOrdinalLabel(event.completion_count);
    setTimeout(() => {
      toast.custom(
        (t) => (
          <Box
            display="flex"
            alignItems="center"
            bg="black"
            borderRadius="12px"
            p="10px"
            pl={isMobile ? "8px" : "80px"}
            px="20px"
            boxShadow={`0px 0px 10px 1px white`}
            maxW="300px"
            color="white"
            gap="10px"
            style={{ marginTop: index > 0 ? `${index * marginTop}px` : "0" }}
            onClick={() => {
              toast.dismiss(t);
            }}
          >
            <Image
              src="/logos/trophy.png"
              alt="Trophy Icon"
              boxSize={isMobile ? "16px" : "20px"}
              color="white"
            />
            <Box>
              <Text
                fontSize={isMobile ? "10px" : "12px"}
                color={VIOLET_LIGHT}
                fontWeight="bold"
                fontFamily="Sonara"
                textTransform="uppercase"
              >
                {i18n.t("levelComplete.title", {
                  ns: "achievements",
                  level: event.level,
                  xp: event.base_xp,
                })}
              </Text>
              <Text fontSize={isMobile ? "12px" : "14px"} fontWeight="semibold">
                {i18n.t("levelComplete.description", {
                  ns: "achievements",
                  level: event.level,
                  ordinalLabel,
                })}
              </Text>
            </Box>
          </Box>
        ),
        getToastOptions()
      );
    }, index * 200);
  });
};

export const showPurchaseSuccessToast = (id: string): void => {

      toast.custom(
        (t) => (
          <Box
            display="flex"
            alignItems="center"
            bg="black"
            borderRadius="12px"
            p="10px"
            pl={isMobile ? "8px" : "80px"}
            px="20px"
            boxShadow={`0px 0px 10px 1px white`}
            maxW="300px"
            color="white"
            gap="10px"
            onClick={() => {
              toast.dismiss(t);
            }}
          >
            <Image
              src="/logos/joker-logo.png"
              alt="Joker Icon"
              boxSize={isMobile ? "16px" : "20px"}
              color="white"
            />
            <Box>
              <Text
                fontSize={isMobile ? "10px" : "12px"}
                color={VIOLET_LIGHT}
                fontWeight="bold"
                fontFamily="Sonara"
                textTransform="uppercase"
              >
                {i18n.t(`purchases.success.title`, { ns: "achievements" })}
              </Text>
              <Text fontSize={isMobile ? "12px" : "14px"} fontWeight="semibold">
                {i18n.t(`purchases.success.${id}`, { ns: "achievements" })}
              </Text>
            </Box>
          </Box>
        ),
        getToastOptions()
      );

};

const openTx = function (transaction_hash: string): void {
  window.open(getEnvString("VITE_TRANSACTIONS_URL") + transaction_hash);
};

export const updateTransactionToast = (
  transaction_hash: string,
  succeed: boolean
): boolean => {
  const backgroundColor = succeed ? SUCCESS_TOAST : ERROR_TOAST;
  const description = shortenHex(transaction_hash, 15);

  if (succeed) {
    toast.success(
      <CircularToast
        backgroundColor={backgroundColor}
        status={"success"}
        onClickFn={() => openTx(transaction_hash)}
      />,
      {
        ...TOAST_COMMON_OPTIONS,
      }
    );
  } else {
    toast.error(
      <CircularToast
        backgroundColor={backgroundColor}
        status={"error"}
        description={description}
        onClickFn={() => openTx(transaction_hash)}
      />,
      {
        ...TOAST_COMMON_OPTIONS,
      }
    );
  }
  return succeed;
};

export const failedTransactionToast = (): boolean => {
  const TX_ERROR_MESSAGE = "Error processing transaction.";
  toast.error(
    <CircularToast
      backgroundColor={ERROR_TOAST}
      status="error"
      description={TX_ERROR_MESSAGE}
    />,
    {
      ...TOAST_COMMON_OPTIONS,
    }
  );

  return false;
};
