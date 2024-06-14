import { gql } from "graphql-tag";

export const GET_CURRENT_HAND_QUERY = gql`
  query GetCurrentHand($gameId: ID!) {
    currentHandCardModels(first: 30, where: { game_idEQ: $gameId }) {
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
    roundModels(first: 30, where: { game_idEQ: $gameId }) {
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

export const GET_PLAYER_EFFECT_CARDS = gql`
    query GetPlayerEffectCards($gameId: ID!) {
        playerEffectCardsModels(first: 1000, where: { game_idEQ: $gameId }) {
            edges {
                node {
                    idx
                    game_id
                    effect_card_id
                }
            }
        }
    }
`;

export const GET_DECK_QUERY = gql`
  query GetDeck($gameId: ID!) {
    roundModels(where: { game_idEQ: $gameId }) {
      edges {
        node {
          current_len_deck
        }
      }
    }
    playerCommonCardsModels(where: { game_idEQ: $gameId }, limit: 10000) {
      totalCount
      edges {
        node {
          common_card_id
          idx
        }
      }
    }
    playerEffectCardsModels(where: { game_idEQ: $gameId }, limit: 10000) {
      totalCount
      edges {
        node {
          effect_card_id
          idx
        }
      }
    }
  }
`;

export const GET_STATIC_EFFECT_CARDS = gql`
  query {
    effectCardModels(first: 1000) {
      edges {
        node {
          id
          effect_id
          type_effect_card
          price
          probability
        }
      }
    }
  }
`;

export const GET_STATIC_EFFECTS = gql`
  query {
    effectModels(first: 1000) {
      edges {
        node {
          id
          points
          multi_add
          multi_multi
          suit
        }
      }
    }
  }
`;

export const GET_PLAYS_LEVEL_QUERY = gql`
    query GetLevelPokerHand {
        playerLevelPokerHandModels {
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
