import { CardDataMap } from "../types/CardData";
import i18n from 'i18next';

export const PACKS_DATA: CardDataMap = {};

i18n.on('initialized', () => {
  Object.assign(PACKS_DATA, {
    1: {
      name: i18n.t('packsData.1.name'),
      description: i18n.t('packsData.1.description'),
      details: i18n.t('packsData.1.details'),
    },
    2: {
      name: i18n.t('packsData.2.name'),
      description: i18n.t('packsData.2.description'),
      details: i18n.t('packsData.2.details'),
    },
    3: {
      name: i18n.t('packsData.3.name'),
      description: i18n.t('packsData.3.description'),
      details: i18n.t('packsData.3.details'),
    },
    4: {
      name: i18n.t('packsData.4.name'),
      description: i18n.t('packsData.4.description'),
      details: i18n.t('packsData.4.details'),
    },
    5: {
      name: i18n.t('packsData.5.name'),
      description: i18n.t('packsData.5.description'),
      details: i18n.t('packsData.5.details'),
    },
    6: {
      name: i18n.t('packsData.6.name'),
      description: i18n.t('packsData.6.description'),
      details: i18n.t('packsData.6.details'),
    },
    7: {
      name: i18n.t('packsData.7.name'),
      description: i18n.t('packsData.7.description'),
      details: i18n.t('packsData.7.details'),
    },
    8: {
      name: i18n.t('packsData.8.name'),
      description: i18n.t('packsData.8.description'),
      details: i18n.t('packsData.8.details'),
    },
    9: {
      name: i18n.t('packsData.9.name'),
      description: i18n.t('packsData.9.description'),
      details: i18n.t('packsData.9.details'),
    },
  });  
});