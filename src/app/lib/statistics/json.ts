import { FootballLine } from "ngx-sport";

export interface JsonStatistics {
    gameRoundNumber: number,
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