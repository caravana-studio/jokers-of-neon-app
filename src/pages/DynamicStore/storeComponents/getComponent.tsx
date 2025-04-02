import LevelUpTable from "../../store/StoreElements/LevelUpTable";
import { BurnComponent } from "./ BurnComponent";
import { CardComponent } from "./CardComponent";
import { LootBoxComponent } from "./LootBoxComponent";
import { PowerUpsComponent } from "./PowerUpsComponent";
import { TestComponent } from "./TestComponent";

export const getComponent = (id: string, doubleRow = false) => {
  switch (id) {
    case "traditionals":
      return <CardComponent id="traditionals" doubleRow={doubleRow} />;
    case "modifiers":
      return <CardComponent id="modifiers" doubleRow={doubleRow} />;
    case "specials":
      return <CardComponent id="specials" doubleRow={doubleRow} />;
    case "loot-boxes":
      return <LootBoxComponent />;
    case "burn":
      return <BurnComponent />;
    case "level-up-table":
      return <LevelUpTable />;
    case "power-ups":
      return <PowerUpsComponent doubleRow={doubleRow} />;
    default:
      return <TestComponent />;
  }
};
