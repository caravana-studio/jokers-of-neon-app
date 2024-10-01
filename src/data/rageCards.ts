import { CardDataMap } from "../types/CardData";
import i18n from 'i18next';

export const RAGE_CARDS_DATA: CardDataMap = {}

i18n.on('initialized', () => {
  Object.assign(RAGE_CARDS_DATA, {
    401: {
      name: i18n.t('rageCardsData.401.name'),
      description: i18n.t('rageCardsData.401.description'),
    },
    402: {
      name: i18n.t('rageCardsData.402.name'),
      description: i18n.t('rageCardsData.402.description'),
    },
    403: {
      name: i18n.t('rageCardsData.403.name'),
      description: i18n.t('rageCardsData.403.description'),
    },
    404: {
      name: i18n.t('rageCardsData.404.name'),
      description: i18n.t('rageCardsData.404.description'),
    },
    405: {
      name: i18n.t('rageCardsData.405.name'),
      description: i18n.t('rageCardsData.405.description'),
    },
    406: {
      name: i18n.t('rageCardsData.406.name'),
      description: i18n.t('rageCardsData.406.description'),
    },
    407: {
      name: i18n.t('rageCardsData.407.name'),
      description: i18n.t('rageCardsData.407.description'),
    },
    408: {
      name: i18n.t('rageCardsData.408.name'),
      description: i18n.t('rageCardsData.408.description'),
    },
    409: {
      name: i18n.t('rageCardsData.409.name'),
      description: i18n.t('rageCardsData.409.description'),
    }
  });
});