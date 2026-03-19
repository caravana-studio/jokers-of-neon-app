import type { TFunction } from "i18next";

export type MarketplaceTermsSection = {
  number: string;
  title: string;
  body: string;
};

const TERMS_SECTION_KEYS = [
  "tldr",
  "acceptance",
  "relationshipToGameTerms",
  "aboutMarketplace",
  "eligibility",
  "howMarketplaceWorks",
  "feesAndTaxes",
  "sellerRepresentations",
  "failedOrStaleOrders",
  "risks",
  "nftsAndIp",
  "noInvestmentAdvice",
  "prohibitedConduct",
  "walletAndThirdPartyServices",
  "noCustody",
  "noRefundsOrReversals",
  "gameModifications",
  "complianceAndSuspension",
  "betaDisclaimer",
  "disclaimers",
  "limitationOfLiability",
  "indemnification",
  "updates",
  "governingLaw",
  "contact",
] as const;

export function getMarketplaceTermsSections(
  t: TFunction<"marketplace">
): MarketplaceTermsSection[] {
  return TERMS_SECTION_KEYS.map((key) => ({
    number: t(`terms.sections.${key}.number`) as string,
    title: t(`terms.sections.${key}.title`) as string,
    body: t(`terms.sections.${key}.body`) as string,
  }));
}

export function getMarketplaceTermsDocument(
  t: TFunction<"marketplace">
): string {
  const headerLines = [
    t("terms.documentTitle"),
    `${t("terms.betaVersionLabel")} | ${t("terms.effectiveDate")}: ${t("terms.effectiveDateValue")}`,
    `${t("terms.entityLabel")}: ${t("terms.entityName")}`,
    `${t("terms.contactLabel")}: ${t("terms.contactEmail")}`,
  ];

  const sectionLines = getMarketplaceTermsSections(t).map(
    ({ number, title, body }) => `${number ? `${number} ` : ""}${title}\n${body}`
  );

  return [
    ...headerLines,
    "",
    sectionLines.join("\n\n"),
    "",
    t("terms.authoritativeNotice"),
    t("terms.copyright"),
  ].join("\n");
}
