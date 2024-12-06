import { CardDataMap } from "../types/CardData";
import i18n from 'i18next';

export const POWER_UPS_CARDS_DATA: CardDataMap = {};

const loadTranslations = async () => {
  await i18n.loadNamespaces(['effects']);

  Object.assign(POWER_UPS_CARDS_DATA, {
    600: {
      name: i18n.t('powerUpsData.600.name', {ns:'effects'}),
      description: i18n.t('powerUpsData.600.description', {ns:'effects'}),
    },
    601: {
      name: i18n.t('powerUpsData.601.name', {ns:'effects'}),
      description: i18n.t('powerUpsData.601.description', {ns:'effects'}),
    },
    602: {
      name: i18n.t('powerUpsData.602.name', {ns:'effects'}),
      description: i18n.t('powerUpsData.602.description', {ns:'effects'}),
    },
    603: {
      name: i18n.t('powerUpsData.603.name', {ns:'effects'}),
      description: i18n.t('powerUpsData.603.description', {ns:'effects'}),
    },
    604: {
      name: i18n.t('powerUpsData.604.name', {ns:'effects'}),
      description: i18n.t('powerUpsData.604.description', {ns:'effects'}),
    },
    605: {
      name: i18n.t('powerUpsData.605.name', {ns:'effects'}),
      description: i18n.t('powerUpsData.605.description', {ns:'effects'}),
    },
    606: {
      name: i18n.t('powerUpsData.606.name', {ns:'effects'}),
      description: i18n.t('powerUpsData.606.description', {ns:'effects'}),
    },
    607: {
      name: i18n.t('powerUpsData.607.name', {ns:'effects'}),
      description: i18n.t('powerUpsData.607.description', {ns:'effects'}),
    },
  });
}

i18n.on('initialized', loadTranslations);
i18n.on('languageChanged', loadTranslations);