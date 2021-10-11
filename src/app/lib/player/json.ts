import { JsonIdentifiable, JsonPerson } from 'ngx-sport';
import { JsonStatistics } from '../statistics/json';

export interface JsonS11Player extends JsonIdentifiable {
    person: JsonPerson;
    statistics: JsonStatistics[] | undefined;
}