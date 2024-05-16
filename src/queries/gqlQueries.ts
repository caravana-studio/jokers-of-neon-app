import { gql } from "graphql-tag";

export const GET_CURRENT_HAND_QUERY = gql`
  query GetCurrentHand($gameId: ID!) {
    currentHandCardModels(first: 30, where: { game_idEQ: $gameId }) {
      edges {
        node {
          suit
          idx
          type_card
          value
          game_id
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
