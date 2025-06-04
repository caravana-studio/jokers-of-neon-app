export const SPINE_BASE_PATH = "/spine-animations/";

export const SPINE_LOGO_FILES = ["JokerLogo.json", "JokerLogo.atlas"];
export const SPINE_PHOENIX_FILES = ["phoenix.json", "phoenix.atlas"];

export const getSpineBoxFiles = (
  ids: number[],
  basePath: string = SPINE_BASE_PATH
): string[] => {
  return ids.flatMap((id) => [
    `${basePath}loot_box_${id}.json`,
    `${basePath}loot_box_${id}.atlas`,
  ]);
};

export const getSpineLogoPaths = (
  basePath: string = SPINE_BASE_PATH
): string[] => SPINE_LOGO_FILES.map((file) => `${basePath}logo/${file}`);

export const getSpinePhoenixPaths = (
  basePath: string = SPINE_BASE_PATH
): string[] => SPINE_PHOENIX_FILES.map((file) => `${basePath}phoenix/${file}`);
