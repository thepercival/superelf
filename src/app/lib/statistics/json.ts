import { FootballLine } from "ngx-sport";
import { JsonGameRound } from "../gameRound/json";

export interface JsonStatistics {
    gameRound: JsonGameRound,
    result: number,
    beginMinute: number,
    endMinute: number,
    nrOfFieldGoals: number,
    nrOfAssists: number,
    nrOfPenalties: number,
    nrOfOwnGoals: number,
    cleanSheet: boolean,
    spottySheet: boolean,
    nrOfYellowCards: number,
    directRedCard: boolean,
    playerLine: FootballLine
}