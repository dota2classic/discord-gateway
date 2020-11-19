export const steamIdToNum = (steamId: string) => {
  return parseInt(steamId.substring(1, steamId.length - 1).split(":")[2]);
};