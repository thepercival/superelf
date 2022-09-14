import { FootballLine } from "ngx-sport";
import { JsonGameRound } from "../gameRound/json";
import { Sheet } from "../sheet";

export interface JsonStatistics {
    gameRound: JsonGameRound,
    result: number,
    beginMinute: number,
    endMinute: number,
    nrOfFieldGoals: number,
    nrOfAssists: number,
    nrOfPenalties: number,
    nrOfOwnGoals: number,
    sheet: Sheet,
    nrOfYellowCards: number,
    directRedCard: boolean,
    playerLine: FootballLine
}