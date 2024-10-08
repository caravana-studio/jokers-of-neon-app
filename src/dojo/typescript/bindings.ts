type TypePlayerCard = { type: 'Common'; } | { type: 'Effect'; }

interface DeckCard {
    fieldOrder: string[];
    game_id: number;
    idx: number;
    type_player_card: TypePlayerCard;
    card_id: number;
}

enum Models{
    DeckCard = "jokers_of_neon-DeckCard"

}

type Schema =
{
    jokers_of_neon:{
        DeckCard: DeckCard;
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
    },
};

export type { Schema, DeckCard, TypePlayerCard };
export { schema, Models };