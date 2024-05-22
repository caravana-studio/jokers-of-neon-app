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
          score
          hands
          discard
        }
      }
    }
  }
`;

export const GET_COMMON_CARDS = gql`
  query GetCommonCards($gameId: ID!) {
    playerCommonCardsModels(first: 1000, where: { game_idEQ: $gameId }) {
      edges {
        node {
          idx
          game_id
          value
          suit
        }
      }
    }
  }
`;
