import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getMarketplaceTermsSections } from "../../marketplace/terms";

export function TermsPage() {
  const { t } = useTranslation("marketplace");
  const navigate = useNavigate();
  const termsSections = getMarketplaceTermsSections(t);

  return (
    <Box maxW="860px" mx="auto">
      {/* Top bar */}
      <Flex align="center" mb={6} gap={4}>
        <Button
          size="sm"
          variant="ghost"
          color="whiteAlpha.700"
          _hover={{ color: "white", bg: "whiteAlpha.100" }}
          onClick={() => navigate(-1)}
          fontFamily="Orbitron"
          fontSize={11}
          letterSpacing="0.08em"
        >
          ← {t("terms.back")}
        </Button>
      </Flex>

      {/* Main card */}
      <Box
        bg="rgba(6, 15, 38, 0.75)"
        border="1px solid rgba(32, 198, 237, 0.2)"
        borderRadius="xl"
        boxShadow="0 0 40px rgba(32, 198, 237, 0.08)"
        p={{ base: 6, md: 10 }}
      >
        {/* Header */}
        <Flex direction="column" align="center" mb={8}>
          <Box
            as="img"
            src="/logos/jn.png"
            alt="Jokers of Neon"
            h="32px"
            mb={4}
          />
          <Heading
            fontFamily="Orbitron"
            textTransform="uppercase"
            fontSize={{ base: 18, md: 22 }}
            letterSpacing="0.12em"
            color="white"
            textAlign="center"
            mb={2}
          >
            {t("terms.pageTitle")}
          </Heading>
          <Text fontFamily="Oxanium" fontSize={12} color="#ff934b" mb={1}>
            {t("terms.betaNotice")}
          </Text>
          <Text fontFamily="Oxanium" fontSize={12} color="whiteAlpha.500">
            {t("terms.effectiveDate")}:{" "}
            {t("terms.metadataLine", {
              date: t("terms.effectiveDateValue"),
              entity: t("terms.entityName"),
            })}
          </Text>
        </Flex>

        {/* Sections */}
        <Box>
          {termsSections.map((section, i) => (
            <Box
              key={`${section.number}-${section.title}`}
              mb={6}
              pb={6}
              borderBottom={
                i < termsSections.length - 1
                  ? "1px solid rgba(255,255,255,0.07)"
                  : "none"
              }
            >
              <Text
                fontFamily="Orbitron"
                fontSize={13}
                letterSpacing="0.06em"
                color="#20c6ed"
                mb={2}
              >
                {section.number} {section.title}
              </Text>
              <Text
                fontFamily="Oxanium"
                fontSize={13}
                color="whiteAlpha.800"
                whiteSpace="pre-wrap"
                lineHeight="1.75"
              >
                {section.body}
              </Text>
            </Box>
          ))}
        </Box>

        {/* Footer note */}
        <Text
          fontFamily="Oxanium"
          fontSize={11}
          color="whiteAlpha.400"
          textAlign="center"
          mt={4}
        >
          {t("terms.footerNotice")}
        </Text>
      </Box>
    </Box>
  );
}
