import { JsonPeriod } from "ngx-sport";

export interface JsonGameRound {
  number: number;
  period: JsonPeriod;
  created: number;
  inProgress: number;
  finished: number;
}