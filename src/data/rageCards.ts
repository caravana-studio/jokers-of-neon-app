import { CardDataMap } from "../types/CardData";
import i18n from 'i18next';

export const RAGE_CARDS_DATA: CardDataMap = {}

const loadTranslations = async () => {
  await i18n.loadNamespaces(['rage']);
  
  Object.assign(RAGE_CARDS_DATA, {
    401: {
      name: i18n.t('rageCardsData.401.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.401.description', {ns:'rage'}),
    },
    402: {
      name: i18n.t('rageCardsData.402.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.402.description', {ns:'rage'}),
    },
    403: {
      name: i18n.t('rageCardsData.403.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.403.description', {ns:'rage'}),
    },
    404: {
      name: i18n.t('rageCardsData.404.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.404.description', {ns:'rage'}),
    },
    405: {
      name: i18n.t('rageCardsData.405.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.405.description', {ns:'rage'}),
    },
    406: {
      name: i18n.t('rageCardsData.406.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.406.description', {ns:'rage'}),
    },
    407: {
      name: i18n.t('rageCardsData.407.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.407.description', {ns:'rage'}),
    },
    408: {
      name: i18n.t('rageCardsData.408.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.408.description', {ns:'rage'}),
    },
    409: {
      name: i18n.t('rageCardsData.409.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.409.description', {ns:'rage'}),
    },
    410: {
      name: i18n.t('rageCardsData.410.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.410.description', {ns:'rage'}),
    },
    411: {
      name: i18n.t('rageCardsData.411.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.411.description', {ns:'rage'}),
    },
    412: {
      name: i18n.t('rageCardsData.412.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.412.description', {ns:'rage'}),
    },
    413: {
      name: i18n.t('rageCardsData.413.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.413.description', {ns:'rage'}),
    },
    414: {
      name: i18n.t('rageCardsData.414.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.414.description', {ns:'rage'}),
    },
    415: {
      name: i18n.t('rageCardsData.415.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.415.description', {ns:'rage'}),
    },
    416: {
      name: i18n.t('rageCardsData.416.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.416.description', {ns:'rage'}),
    },
    417: {
      name: i18n.t('rageCardsData.417.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.417.description', {ns:'rage'}),
    },
    418: {
      name: i18n.t('rageCardsData.418.name', {ns:'rage'}),
      description: i18n.t('rageCardsData.418.description', {ns:'rage'}),
    }
  });
}

i18n.on('initialized', loadTranslations);
i18n.on('languageChanged', loadTranslations);