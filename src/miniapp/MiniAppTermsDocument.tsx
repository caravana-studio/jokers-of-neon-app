import { Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useResponsiveValues } from "../theme/responsiveSettings";

const getTermsBlocks = (content: string) =>
  content.split("\n\n").map((block) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const isBulletList =
      lines.length > 0 && lines.every((line) => line.startsWith("• "));

    if (isBulletList) {
      return {
        type: "list" as const,
        items: lines.map((line) => line.replace(/^•\s*/, "")),
      };
    }

    return {
      type: "text" as const,
      content: block,
    };
  });

export const MiniAppTermsDocument = () => {
  const { t } = useTranslation("miniapp", { keyPrefix: "terms-gate" });
  const { isSmallScreen } = useResponsiveValues();
  const termsBlocks = getTermsBlocks(t("body"));

  return (
    <Flex
      maxW="720px"
      mx="auto"
      flexDirection="column"
      gap={4}
      pb={isSmallScreen ? 2 : 4}
    >
      {termsBlocks.map((block, index) =>
        block.type === "list" ? (
          <UnorderedList
            key={`list-${index}`}
            spacing={2}
            pl={5}
            m={0}
            color="whiteAlpha.900"
          >
            {block.items.map((item) => (
              <ListItem
                key={item}
                fontFamily="Oxanium"
                fontSize={{ base: "13px", md: "16px" }}
                lineHeight="1.7"
              >
                {item}
              </ListItem>
            ))}
          </UnorderedList>
        ) : (
          <Text
            key={`text-${index}-${block.content.slice(0, 20)}`}
            fontFamily="Oxanium"
            fontSize={{ base: "13px", md: "16px" }}
            lineHeight="1.7"
            color="whiteAlpha.900"
            whiteSpace="pre-wrap"
          >
            {block.content}
          </Text>
        )
      )}
    </Flex>
  );
};
