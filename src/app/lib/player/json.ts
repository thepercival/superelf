import { JsonIdentifiable, JsonPerson } from 'ngx-sport';
import { JsonStatistics } from '../statistics/json';
import { JsonPlayerTotals } from './totals/json';

export interface JsonS11Player extends JsonIdentifiable {
    person: JsonPerson;
    statistics: JsonStatistics[] | undefined;
    totals: JsonPlayerTotals;
    totalPoints: number;
}