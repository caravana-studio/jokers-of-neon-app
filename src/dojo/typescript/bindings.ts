type TypePlayerCard = { type: 'Common'; } | { type: 'Effect'; }

interface DeckCard {
    fieldOrder: string[];
    game_id: number;
    idx: number;
    type_player_card: TypePlayerCard;
    card_id: number;
}

interface Round {
    fieldOrder: string[];
    game_id: number,
    player_score: number,
    level_score: number,
    hands: number,
    discard: number,
    current_len_deck: number,
}

enum Models {
    DeckCard = "jokers_of_neon-DeckCard",
    Round = "jokers_of_neon-Round"
}

type Schema =
{
    jokers_of_neon:{
        DeckCard: DeckCard;
        Round: Round;
    }
}

const schema: Schema = {
    // this should match namespace define in dojo
    jokers_of_neon: {
        // this has to match model names
        DeckCard: {
            fieldOrder: ["game_id", "idx", "type_player_card", "card_id"],
            game_id: 0,
            idx: 0,
            // properties have to match too.
            type_player_card: { type: 'Common' } ,
            card_id: 0
        },
        Round: {
            fieldOrder: ["game_id", "player_score", "level_score", "hands", "discard", "current_len_deck"],
            game_id: 0,
            player_score: 0,
            level_score: 0,
            hands: 0,
            discard: 0,
            current_len_deck: 0,
        }
    },
};

export type { Schema, DeckCard, TypePlayerCard, Round };
export { schema, Models };