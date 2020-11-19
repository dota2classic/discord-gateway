import heroes from "./heroes";

export default (fullname?: string) => {
  return heroes.find(it => it.tag === fullname)?.name || "";
};

// export const profileUrl = (steam_id: string) => {
//   return `https://dota2classic.ru/players/${steam_id}`
// }