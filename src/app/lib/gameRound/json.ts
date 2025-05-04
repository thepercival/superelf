import { GameState, JsonPeriod } from "ngx-sport";

export interface JsonGameRound {
  number: number;
  period: JsonPeriod;
  state: GameState;
  created: number;
  inProgress: number;
  finished: number;  
  totalNrOfGames: number
}