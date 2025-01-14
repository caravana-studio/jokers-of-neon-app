import { CardDataMap } from "../types/CardData";
import i18n from 'i18next';

export const MODIFIER_CARDS_DATA: CardDataMap = {};

const loadTranslations = async () => {
  await i18n.loadNamespaces(['effects']);

  Object.assign(MODIFIER_CARDS_DATA, {
    608: {
      name: i18n.t('modifierCardsData.608.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.608.description', {ns:'effects'}),
    },
    609: {
      name: i18n.t('modifierCardsData.609.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.609.description', {ns:'effects'}),
    },
    610: {
      name: i18n.t('modifierCardsData.610.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.610.description', {ns:'effects'}),
    },
    611: {
      name: i18n.t('modifierCardsData.611.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.611.description', {ns:'effects'}),
    },
    612: {
      name: i18n.t('modifierCardsData.612.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.612.description', {ns:'effects'}),
    },
    613: {
      name: i18n.t('modifierCardsData.613.name', {ns:'effects'}),
      description: i18n.t('modifierCardsData.613.description', {ns:'effects'}),
    }
  });
}

i18n.on('initialized', loadTranslations);
i18n.on('languageChanged', loadTranslations);