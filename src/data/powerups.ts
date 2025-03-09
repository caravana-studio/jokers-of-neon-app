import { CardDataMap } from "../types/CardData";
import i18n from 'i18next';

export const POWER_UPS_CARDS_DATA: CardDataMap = {};

export const POWER_UPS_KEYS = {
  800: {
    name: i18n.t('powerUpsData.800.name', {ns:'effects'}),
    description: i18n.t('powerUpsData.800.description', {ns:'effects'}),
  },
  801: {
    name: i18n.t('powerUpsData.801.name', {ns:'effects'}),
    description: i18n.t('powerUpsData.801.description', {ns:'effects'}),
  },
  802: {
    name: i18n.t('powerUpsData.802.name', {ns:'effects'}),
    description: i18n.t('powerUpsData.802.description', {ns:'effects'}),
  },
  803: {
    name: i18n.t('powerUpsData.803.name', {ns:'effects'}),
    description: i18n.t('powerUpsData.803.description', {ns:'effects'}),
  },
  804: {
    name: i18n.t('powerUpsData.804.name', {ns:'effects'}),
    description: i18n.t('powerUpsData.804.description', {ns:'effects'}),
  },
  805: {
    name: i18n.t('powerUpsData.805.name', {ns:'effects'}),
    description: i18n.t('powerUpsData.805.description', {ns:'effects'}),
  },
  806: {
    name: i18n.t('powerUpsData.806.name', {ns:'effects'}),
    description: i18n.t('powerUpsData.806.description', {ns:'effects'}),
  },
  807: {
    name: i18n.t('powerUpsData.807.name', {ns:'effects'}),
    description: i18n.t('powerUpsData.807.description', {ns:'effects'}),
  },
}

const loadTranslations = async () => {
  await i18n.loadNamespaces(['effects']);

  Object.assign(POWER_UPS_CARDS_DATA, POWER_UPS_KEYS);
}

i18n.on('initialized', loadTranslations);
i18n.on('languageChanged', loadTranslations);