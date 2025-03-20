import { TestComponent } from "./TestComponent";

export const getComponent = (id: string) => {
  switch (id) {
    case "traditionals":
      return <TestComponent />;
    case "modifiers":
      return <TestComponent />;
    case "burn":
      return <TestComponent />;
    default:
      return <TestComponent />;
  }
};
