import { overridableComponent } from "@dojoengine/recs";
import { ContractComponents } from "./generated/contractComponents";

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({
    contractComponents,
}: {
    contractComponents: ContractComponents;
}) {
    return {
        ...contractComponents,
        Card: overridableComponent(contractComponents.Card),
        CurrentSpecialCards: overridableComponent(contractComponents.CurrentSpecialCards),
        Game: overridableComponent(contractComponents.Game),
        CurrentHandCard: overridableComponent(contractComponents.CurrentHandCard),
        DeckCard: overridableComponent(contractComponents.DeckCard),
        Round: overridableComponent(contractComponents.Round),
        PlayerCommonCards: overridableComponent(contractComponents.PlayerCommonCards),
        Effect: overridableComponent(contractComponents.Effect),
        EffectCard: overridableComponent(contractComponents.EffectCard),
        PlayerEffectCards: overridableComponent(contractComponents.PlayerEffectCards),
        CardItem: overridableComponent(contractComponents.CardItem),
    };
}
