import { CardDataMap } from "../types/CardData";
import i18n from 'i18next';

export const SPECIAL_CARDS_DATA: CardDataMap = {};
i18n.on('initialized', () => {
  Object.assign(SPECIAL_CARDS_DATA, {
    300: {
      name: i18n.t('specialCardsData.300.name'),
      description: i18n.t('specialCardsData.300.description'),
    },
    301: {
      name: i18n.t('specialCardsData.301.name'),
      description: i18n.t('specialCardsData.301.description'),
    },
    302: {
      name: i18n.t('specialCardsData.302.name'),
      description: i18n.t('specialCardsData.302.description'),
    },
    303: {
      name: i18n.t('specialCardsData.303.name'),
      description: i18n.t('specialCardsData.303.description'),
    },
    304: {
      name: i18n.t('specialCardsData.304.name'),
      description: i18n.t('specialCardsData.304.description'),
    },
    305: {
      name: i18n.t('specialCardsData.305.name'),
      description: i18n.t('specialCardsData.305.description'),
    },
    306: {
      name: i18n.t('specialCardsData.306.name'),
      description: i18n.t('specialCardsData.306.description'),
    },
    307: {
      name: i18n.t('specialCardsData.307.name'),
      description: i18n.t('specialCardsData.307.description'),
    },
    308: {
      name: i18n.t('specialCardsData.308.name'),
      description: i18n.t('specialCardsData.308.description'),
    },
    309: {
      name: i18n.t('specialCardsData.309.name'),
      description: i18n.t('specialCardsData.309.description'),
    },
    310: {
      name: i18n.t('specialCardsData.310.name'),
      description: i18n.t('specialCardsData.310.description'),
    },
    311: {
      name: i18n.t('specialCardsData.311.name'),
      description: i18n.t('specialCardsData.311.description'),
    },
    312: {
      name: i18n.t('specialCardsData.312.name'),
      description: i18n.t('specialCardsData.312.description'),
    },
    313: {
      name: i18n.t('specialCardsData.313.name'),
      description: i18n.t('specialCardsData.313.description'),
    },
    314: {
      name: i18n.t('specialCardsData.314.name'),
      description: i18n.t('specialCardsData.314.description'),
    },
    315: {
      name: i18n.t('specialCardsData.315.name'),
      description: i18n.t('specialCardsData.315.description'),
    },
    316: {
      name: i18n.t('specialCardsData.316.name'),
      description: i18n.t('specialCardsData.316.description'),
    },
    317: {
      name: i18n.t('specialCardsData.317.name'),
      description: i18n.t('specialCardsData.317.description'),
    },
    318: {
      name: i18n.t('specialCardsData.318.name'),
      description: i18n.t('specialCardsData.318.description'),
    },
    319: {
      name: i18n.t('specialCardsData.319.name'),
      description: i18n.t('specialCardsData.319.description'),
    },
    320: {
      name: i18n.t('specialCardsData.320.name'),
      description: i18n.t('specialCardsData.320.description'),
    }});
});