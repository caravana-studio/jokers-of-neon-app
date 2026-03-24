import { Box, Flex, Heading, Text, useTheme } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../state/useGameStore";
import { RollingNumber } from "./RollingNumber";

export const MultiPoints = () => {
  const { points, multi } = useGameStore();
  const { t } = useTranslation(["game"]);

  return (
    <Flex
      width="100%"
      alignItems="center"
      className="game-tutorial-step-6"
      gap={{ base: 2, md: 3 }}
    >
      <Flex flex={1} direction="column" alignItems="center" gap={1}>
        <Text
          textTransform="uppercase"
          fontSize={{ base: "11px", md: "16px" }}
          letterSpacing={{ base: "0.05em", md: "0.08em" }}
          lineHeight={1}
          zIndex={10}
        >
          {t("game.multi-points.points")}
        </Text>
        <PointBox type="points" stretch>
          <Heading size={{ base: "s", md: "m" }}>
            <RollingNumber n={points} />
          </Heading>
        </PointBox>
      </Flex>

      {!isMobile && (
        <Heading size="s" mt={4} px={{ base: 0, md: 1 }}>
          x
        </Heading>
      )}

      <Flex flex={1} direction="column" alignItems="center" gap={1}>
        <Text
          textTransform="uppercase"
          fontSize={{ base: "11px", md: "16px" }}
          letterSpacing={{ base: "0.05em", md: "0.08em" }}
          lineHeight={1}
          zIndex={10}
        >
          {t("game.multi-points.multi")}
        </Text>
        <PointBox type="multi" stretch>
          <Heading size={{ base: "s", md: "m" }}>
            <RollingNumber n={multi} />
          </Heading>
        </PointBox>
      </Flex>
    </Flex>
  );
};

interface PointBoxProps {
  children: JSX.Element | JSX.Element[];
  type: "points" | "multi" | "level";
  height?: string;
  stretch?: boolean;
}

export const PointBox = ({ children, type, height, stretch = false }: PointBoxProps) => {
  const { colors } = useTheme();
  const colorMap = {
    points: colors.neonGreen,
    multi: colors.neonPink,
    level: "#FFF",
  };

  const color = colorMap[type];
  return (
    <Box
      width={stretch ? "100%" : "auto"}
      minWidth={stretch ? 0 : { base: 70, md: 120 }}
      p={{ base: 1, md: 1 }}
      sx={{
        border: `2px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textShadow: `0 0 5px ${color}`,
      }}
      boxShadow={{
        base: `0px 0px 10px 4px ${color} `,
        sm: `0px 0px 17px 7px ${color}`,
      }}
      borderRadius={{ base: 15, md: 15 }}
    >
      {children}
    </Box>
  );
};
