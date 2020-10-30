import { JsonCompetition, JsonSeason } from 'ngx-sport';
import { JsonPoolCompetitor } from '../competitor/json';
import { JsonPoolCollection } from './collection/json';

export interface JsonPool {
    id?: number;
    collection: JsonPoolCollection;
    season: JsonSeason;
    competitions: JsonCompetition[];
    competitors: JsonPoolCompetitor[];
}