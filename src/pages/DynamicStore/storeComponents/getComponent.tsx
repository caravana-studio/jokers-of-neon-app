import { CardComponent } from "./CardComponent";
import { TestComponent } from "./TestComponent";

export const getComponent = (id: string, doubleRow = false) => {
  switch (id) {
    case "traditionals":
      return <CardComponent id="traditionals" doubleRow={doubleRow} />;
    case "modifiers":
      return <CardComponent id="modifiers" doubleRow={doubleRow} />;
    case "specials":
      return <CardComponent id="specials" doubleRow={doubleRow} />;
    case "burn":
      return <TestComponent />;
    default:
      return <TestComponent />;
  }
};
