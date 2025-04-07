import ControllerConnector from "@cartridge/connector/controller";

export const connectControllerCommand = async (connector: unknown) => {
  const controllerConnector = connector as ControllerConnector;
  await controllerConnector?.controller?.openProfile("achievements");
};