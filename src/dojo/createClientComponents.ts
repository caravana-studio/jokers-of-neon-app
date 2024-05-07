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
        Game: overridableComponent(contractComponents.Game),
    };
}
