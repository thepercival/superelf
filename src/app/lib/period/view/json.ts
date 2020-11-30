import { JsonPeriod } from 'ngx-sport';
import { JsonGameRound } from '../../gameRound/json';

export interface JsonViewPeriod extends JsonPeriod {
    rounds: JsonGameRound[];
}