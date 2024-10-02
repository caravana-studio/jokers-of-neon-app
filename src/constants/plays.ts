import { Card } from "../types/Card";
import { HA, CK, DQ, S9, H7, D7, C9, H9, D8, S10, HJ, H4, C7, S7, D10, D9, DJ, DA, DK } from "../utils/mocks/cardMocks";
import i18n from 'i18next';

export const PLAYS: string[] = [];
export const PLAYS_DATA: PlaysData[] = [];

i18n.on('initialized', () => {
  Object.assign(PLAYS,[
    "NONE",
    i18n.t('playsData.royalFlush.name'),
    i18n.t('playsData.straightFlush.name'),
    i18n.t('playsData.fourOfAKind.name'),
    i18n.t('playsData.fullHouse.name'),
    i18n.t('playsData.straight.name'),
    i18n.t('playsData.flush.name'),
    i18n.t('playsData.threeOfAKind.name'),
    i18n.t('playsData.twoPair.name'),
    i18n.t('playsData.pair.name'),
    i18n.t('playsData.highCard.name'),
    i18n.t('playsData.fiveOfAKind.name'),
  ]);

  Object.assign(PLAYS_DATA, [
    {
      name: i18n.t('playsData.royalFlush.name'),
      description: i18n.t('playsData.royalFlush.description'),
      example: [D10, DJ, DQ, DK, DA],
      importantCards: [D10, DJ, DQ, DK, DA],
    },
    {
      name: i18n.t('playsData.straightFlush.name'),
      description: i18n.t('playsData.straightFlush.description'),
      example: [D7, D8, D9, D10, DJ],
      importantCards: [D7, D8, D9, D10, DJ],
    },
    {
      name: i18n.t('playsData.fiveOfAKind.name'),
      description: i18n.t('playsData.fiveOfAKind.description'),
      example: [H7, D7, C7, S7, S7],
      importantCards: [H7, D7, C7, S7, S7],
    },
    {
      name: i18n.t('playsData.fourOfAKind.name'),
      description: i18n.t('playsData.fourOfAKind.description'),
      example: [H7, D7, C7, S7, H9],
      importantCards: [H7, D7, C7, S7],
    },
    {
      name: i18n.t('playsData.fullHouse.name'),
      description: i18n.t('playsData.fullHouse.description'),
      example: [H7, D7, C7, S9, H9],
      importantCards: [H7, D7, C7, S9, H9],
    },
    {
      name: i18n.t('playsData.straight.name'),
      description: i18n.t('playsData.straight.description'),
      example: [D7, D8, H9, S10, HJ],
      importantCards: [D7, D8, H9, S10, HJ],
    },
    {
      name: i18n.t('playsData.flush.name'),
      description: i18n.t('playsData.flush.description'),
      example: [HA, H7, H9, H4, HJ],
      importantCards: [HA, H7, H9, H4, HJ],
    },
    {
      name: i18n.t('playsData.threeOfAKind.name'),
      description: i18n.t('playsData.threeOfAKind.description'),
      example: [C9, S9, H9, HA, D7],
      importantCards: [C9, S9, H9],
    },
    {
      name: i18n.t('playsData.twoPair.name'),
      description: i18n.t('playsData.twoPair.description'),
      example: [H7, D7, C9, S9, HA],
      importantCards: [H7, D7, C9, S9],
    },
    {
      name: i18n.t('playsData.pair.name'),
      description: i18n.t('playsData.pair.description'),
      example: [H7, D7, HA, CK, DQ],
      importantCards: [H7, D7],
    },
    {
      name: i18n.t('playsData.highCard.name'),
      description: i18n.t('playsData.highCard.description'),
      example: [HA, CK, DQ, S9, H7],
      importantCards: [HA],
    },
  ]);
});

// export const PLAYS_DATA: PlaysData[] = [
//   {
//     name: i18n.t('playsData.royalFlush.name'),
//     description: i18n.t('playsData.royalFlush.description'),
//     example: [D10, DJ, DQ, DK, DA],
//     importantCards: [D10, DJ, DQ, DK, DA],
//   },
//   {
//     name: i18n.t('playsData.straightFlush.name'),
//     description: i18n.t('playsData.straightFlush.description'),
//     example: [D7, D8, D9, D10, DJ],
//     importantCards: [D7, D8, D9, D10, DJ],
//   },
//   {
//     name: i18n.t('playsData.fiveOfAKind.name'),
//     description: i18n.t('playsData.fiveOfAKind.description'),
//     example: [H7, D7, C7, S7, S7],
//     importantCards: [H7, D7, C7, S7, S7],
//   },
//   {
//     name: i18n.t('playsData.fourOfAKind.name'),
//     description: i18n.t('playsData.fourOfAKind.description'),
//     example: [H7, D7, C7, S7, H9],
//     importantCards: [H7, D7, C7, S7],
//   },
//   {
//     name: i18n.t('playsData.fullHouse.name'),
//     description: i18n.t('playsData.fullHouse.description'),
//     example: [H7, D7, C7, S9, H9],
//     importantCards: [H7, D7, C7, S9, H9],
//   },
//   {
//     name: i18n.t('playsData.straight.name'),
//     description: i18n.t('playsData.straight.description'),
//     example: [D7, D8, H9, S10, HJ],
//     importantCards: [D7, D8, H9, S10, HJ],
//   },
//   {
//     name: i18n.t('playsData.flush.name'),
//     description: i18n.t('playsData.flush.description'),
//     example: [HA, H7, H9, H4, HJ],
//     importantCards: [HA, H7, H9, H4, HJ],
//   },
//   {
//     name: i18n.t('playsData.threeOfAKind.name'),
//     description: i18n.t('playsData.threeOfAKind.description'),
//     example: [C9, S9, H9, HA, D7],
//     importantCards: [C9, S9, H9],
//   },
//   {
//     name: i18n.t('playsData.twoPair.name'),
//     description: i18n.t('playsData.twoPair.description'),
//     example: [H7, D7, C9, S9, HA],
//     importantCards: [H7, D7, C9, S9],
//   },
//   {
//     name: i18n.t('playsData.pair.name'),
//     description: i18n.t('playsData.pair.description'),
//     example: [H7, D7, HA, CK, DQ],
//     importantCards: [H7, D7],
//   },
//   {
//     name: i18n.t('playsData.highCard.name'),
//     description: i18n.t('playsData.highCard.description'),
//     example: [HA, CK, DQ, S9, H7],
//     importantCards: [HA],
//   },
// ];

interface PlaysData
{
  name: string,
  description: string,
  example: Card[],
  importantCards: Card[],
}