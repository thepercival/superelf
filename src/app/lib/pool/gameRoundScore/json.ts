import { JsonPoolScoreUnit } from '../scoreUnit/json';

export interface JsonGameRoundScore {
    gameRound: number;
    scoreUnits: JsonPoolScoreUnit[];
}