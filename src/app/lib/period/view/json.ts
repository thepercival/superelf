import { JsonPeriod } from 'ngx-sport';
import { JsonGameRound } from '../../gameRound/json';

export interface JsonViewPeriod extends JsonPeriod {
    id: number;
    gameRounds: JsonGameRound[];
}