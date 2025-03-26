import LevelUpTable from "../../store/StoreElements/LevelUpTable";
import { TestComponent } from "./TestComponent";

export const getComponent = (id: string) => {
  switch (id) {
    case "traditionals":
      return <TestComponent />;
    case "modifiers":
      return <TestComponent />;
    case "burn":
      return <TestComponent />;
      case "level-up-table":
        return <LevelUpTable/>;
    default:
      return <TestComponent />;
  }
};
