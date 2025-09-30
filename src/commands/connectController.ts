import { ControllerConnector } from "@cartridge/connector";

export const connectControllerCommand = async (connector: unknown) => {
  const controllerConnector = connector as ControllerConnector;
  await controllerConnector?.controller?.openProfile("achievements");
};
