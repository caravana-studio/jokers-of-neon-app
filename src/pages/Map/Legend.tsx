import { ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import CachedImage from "../../components/CachedImage";
import { MotionBox } from "../../components/MotionBox";
import { BLUE_LIGHT } from "../../theme/colors";

export const Legend = () => {
  const { t } = useTranslation("map", { keyPrefix: "legend" });
  const { isOpen, onToggle } = useDisclosure();

  const nodes = useMemo(
    () => [
      {
        title: t("nodes.round.title"),
        icon: "/map/icons/round/round-legend.png",
      },
      {
        title: t("nodes.rage.title"),
        icon: "/map/icons/rage/final-off.png",
        description: t("nodes.rage.final"),
      },
      {
        title: t("nodes.rage.title"),
        icon: "/map/icons/rage/intermediate-off.png",
        description: t("nodes.rage.intermediate"),
      },
      {
        title: t("nodes.shop.title"),
        description: t("nodes.shop.deck"),
        icon: "/map/icons/rewards/1-off.png",
      },
      {
        title: t("nodes.shop.title"),
        description: t("nodes.shop.global"),
        icon: "/map/icons/rewards/2-off.png",
      },
      {
        title: t("nodes.shop.title"),
        description: t("nodes.shop.specials"),
        icon: "/map/icons/rewards/3-off.png",
      },
      {
        title: t("nodes.shop.title"),
        description: t("nodes.shop.level-ups"),
        icon: "/map/icons/rewards/4-off.png",
      },
      {
        title: t("nodes.shop.title"),
        description: t("nodes.shop.modifiers"),
        icon: "/map/icons/rewards/5-off.png",
      },
      {
        title: t("nodes.shop.title"),
        description: t("nodes.shop.mix"),
        icon: "/map/icons/rewards/6-off.png",
      },
    ],
    [t]
  );

  return (
    <Box position="relative">
      <Button variant="ghost" onClick={onToggle}>
        {t("title")}{" "}
        <ChevronUpIcon
          transform={isOpen ? "rotate(180deg)" : "rotate(0)"}
          transition="transform 0.2s ease-in-out"
          ml={2}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <MotionBox
            position="absolute"
            bottom="100%"
            right="0"
            mb={2}
            py={4}
            px={4}
            width="200px"
            borderRadius="20px"
            bg="black"
            zIndex={10}
            border={`1px solid ${BLUE_LIGHT}`}
            boxShadow={`0px 0px 5px ${BLUE_LIGHT}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            <Flex
              maxHeight="70vh"
              overflowY="auto"
              flexDirection="column"
              gap={3}
            >
              {nodes.map((node, idx) => (
                <Flex gap={3} key={idx}>
                  <CachedImage width="50px" src={node.icon} alt="legend icon" />
                  <Flex flexDirection="column" gap={0} justifyContent="center">
                    <Text fontWeight="bold" fontSize="sm">
                      {node.title}
                    </Text>
                    {node.description && (
                      <Text fontSize="sm">{node.description}</Text>
                    )}
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};
