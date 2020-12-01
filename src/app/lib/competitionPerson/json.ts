import { JsonPerson } from 'ngx-sport';
import { JsonGameRoundStats } from './gameRoundStats/json';

export interface JsonCompetitionPerson {
    id: number;
    person: JsonPerson;
    gameRoundScores: JsonGameRoundStats[];
}