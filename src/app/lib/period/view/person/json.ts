import { JsonPerson } from 'ngx-sport';
import { JsonViewPeriodPersonGameRoundScore } from './gameRoundScore/json';

export interface JsonViewPeriodPerson {
    id: number;
    person: JsonPerson;
    points: Map<number, number>;
    total: number;
    gameRoundScores: JsonViewPeriodPersonGameRoundScore[];
}