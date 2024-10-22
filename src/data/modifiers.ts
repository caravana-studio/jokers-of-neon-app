import { CardDataMap } from "../types/CardData";
import i18n from 'i18next';

export const MODIFIER_CARDS_DATA: CardDataMap = {};

const loadTranslations = async () => {
  await i18n.loadNamespaces(['effects']);

  Object.assign(MODIFIER_CARDS_DATA, {
    106: {
      name: i18n.t('modifierCardsData.106.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.106.description', {ns:'effects'}),
    },
    107: {
      name: i18n.t('modifierCardsData.107.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.107.description', {ns:'effects'}),
    },
    108: {
      name: i18n.t('modifierCardsData.108.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.108.description', {ns:'effects'}),
    },
    109: {
      name: i18n.t('modifierCardsData.109.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.109.description', {ns:'effects'}),
    },
    110: {
      name: i18n.t('modifierCardsData.110.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.110.description', {ns:'effects'}),
    },
    111: {
      name: i18n.t('modifierCardsData.111.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.111.description', {ns:'effects'}),
    },
    112: {
      name: i18n.t('modifierCardsData.112.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.112.description', {ns:'effects'}),
    },
    113: {
      name: i18n.t('modifierCardsData.113.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.113.description', {ns:'effects'}),
    },
    114: {
      name: i18n.t('modifierCardsData.114.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.114.description', {ns:'effects'}),
    },
    115: {
      name: i18n.t('modifierCardsData.115.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.115.description', {ns:'effects'}),
    },
    116: {
      name: i18n.t('modifierCardsData.116.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.116.description', {ns:'effects'}),
    },
    117: {
      name: i18n.t('modifierCardsData.117.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.117.description', {ns:'effects'}),
    }
  });
}

i18n.on('initialized', loadTranslations);
i18n.on('languageChanged', loadTranslations);