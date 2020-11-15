import { JsonPeriod } from 'ngx-sport';
import { JsonPoolViewPeriodRound } from './round/json';

export interface JsonPoolViewPeriod extends JsonPeriod {
    rounds: JsonPoolViewPeriodRound[];
}