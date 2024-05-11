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
        PokerHandEvent: overridableComponent(contractComponents.PokerHandEvent),
        CurrentSpecialCards: overridableComponent(contractComponents.CurrentSpecialCards),
        Game: overridableComponent(contractComponents.Game),
        PlayerCurrentSpecialCards: overridableComponent(contractComponents.PlayerCurrentSpecialCards),
        PlayerModifierCards: overridableComponent(contractComponents.PlayerModifierCards),
        PlayerSpecialCards: overridableComponent(contractComponents.PlayerSpecialCards),
        CurrentHand: overridableComponent(contractComponents.CurrentHand),
        Deck: overridableComponent(contractComponents.Deck),
        Round: overridableComponent(contractComponents.Round),
    };
}
