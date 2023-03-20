import { JsonIdentifiable, JsonPerson, JsonPlayer } from 'ngx-sport';
import { JsonStatistics } from '../statistics/json';
import { JsonTotals } from '../totals/json';

export interface JsonS11Player extends JsonIdentifiable {
    person: JsonPerson;
    players: JsonPlayer[];
    statistics: JsonStatistics[] | undefined;
    totals: JsonTotals;
}