export const getMajor = (version: string) => {
  const [major] = version.split(".");
  return major;
};

export const getMinor = (version: string) => {
  const [major, minor] = version.split(".");
  return minor;
};

export const getPatch = (version: string) => {
  const [major, minor, patch] = version.split(".");
  return patch;
};