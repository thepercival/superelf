import { FootballLine, JsonPerson } from "ngx-sport";
import { JsonGameRound } from "../gameRound/json";
import { Sheet } from "../sheet";

export interface JsonStatistics {
    gameRound: JsonGameRound|undefined,
    person: JsonPerson|undefined,
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
    playerLine: FootballLine,
    gameStart: string;
}