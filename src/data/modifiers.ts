import { CardDataMap } from "../types/CardData";
import i18n from 'i18next';

console.log(i18n.t('modifierCardsData.600.name'));

export const MODIFIER_CARDS_DATA: CardDataMap = {};

i18n.on('initialized', () => {
  Object.assign(MODIFIER_CARDS_DATA, {
    600: {
      name: i18n.t('modifierCardsData.600.name'),
      description: i18n.t('modifierCardsData.600.description'),
    },
    601: {
      name: i18n.t('modifierCardsData.601.name'),
      description: i18n.t('modifierCardsData.601.description'),
    },
    602: {
      name: i18n.t('modifierCardsData.602.name'),
      description: i18n.t('modifierCardsData.602.description'),
    },
    603: {
      name: i18n.t('modifierCardsData.603.name'),
      description: i18n.t('modifierCardsData.603.description'),
    },
    604: {
      name: i18n.t('modifierCardsData.604.name'),
      description: i18n.t('modifierCardsData.604.description'),
    },
    605: {
      name: i18n.t('modifierCardsData.605.name'),
      description: i18n.t('modifierCardsData.605.description'),
    },
    606: {
      name: i18n.t('modifierCardsData.606.name'),
      description: i18n.t('modifierCardsData.606.description'),
    },
    607: {
      name: i18n.t('modifierCardsData.607.name'),
      description: i18n.t('modifierCardsData.607.description'),
    },
    608: {
      name: i18n.t('modifierCardsData.608.name'),
      description: i18n.t('modifierCardsData.608.description'),
    },
    609: {
      name: i18n.t('modifierCardsData.609.name'),
      description: i18n.t('modifierCardsData.609.description'),
    },
    610: {
      name: i18n.t('modifierCardsData.610.name'),
      description: i18n.t('modifierCardsData.610.description'),
    },
    611: {
      name: i18n.t('modifierCardsData.611.name'),
      description: i18n.t('modifierCardsData.611.description'),
    }
  });
});
