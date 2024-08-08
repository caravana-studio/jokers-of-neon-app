import { gql } from "graphql-tag";

export const GET_CURRENT_HAND_QUERY = gql`
  query GetCurrentHand($gameId: ID!) {
    jokersOfNeonCurrentHandCardModels(first: 30, where: { game_idEQ: $gameId }) {
      edges {
        node {
          idx
          type_player_card
          game_id
          player_card_id
          card_id
        }
      }
    }
  }
`;

export const GET_ROUND_QUERY = gql`
  query GetRound($gameId: ID!) {
    jokersOfNeonRoundModels(first: 30, where: { game_idEQ: $gameId }) {
      edges {
        node {
          player_score
          level_score
          hands
          discard
        }
      }
    }
  }
`;

export const GET_DECK_QUERY = gql`
    query GetDeck($gameId: ID!) {
        jokersOfNeonRoundModels(where: { game_idEQ: $gameId }) {
            edges {
                node {
                    current_len_deck
                }
            }
        }
        jokersOfNeonPlayerCommonCardsModels(where: { game_idEQ: $gameId }) {
            totalCount
        }
        jokersOfNeonPlayerEffectCardsModels(where: { game_idEQ: $gameId }) {
            totalCount
        }
    }

`;


export const GET_PLAYS_LEVEL_QUERY = gql`
    query GetLevelPokerHand($gameId: ID!) {
        jokersOfNeonPlayerLevelPokerHandModels(first: 30, where: { game_idEQ: $gameId }) {
            edges {
                node {
                    poker_hand
                    level
                    multi
                    points
                }
            }
        }
    }
`;
