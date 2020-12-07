import { PlayerId } from "../../../gateway/shared-types/player-id";
import { steamIdToNum } from "./steamids";

export const profile = (id: PlayerId) => `https://dota2classic.ru/player/${steamIdToNum(id.value)}`
