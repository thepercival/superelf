import { JsonCompetition, JsonSeason } from 'ngx-sport';
import { JsonFormation } from 'ngx-sport/src/sport/formation/json';
import { JsonPoolCollection } from './collection/json';
import { JsonPoolPeriod } from './period/json';
import { JsonPoolScoreUnit } from './scoreUnit/json';
import { JsonPoolUser } from './user/json';

export interface JsonPool {
    id?: number;
    formations?: JsonFormation[];
    collection: JsonPoolCollection;
    season: JsonSeason;
    competitions: JsonCompetition[];
    users: JsonPoolUser[];
    scoreUnits?: JsonPoolScoreUnit[];
    periods?: JsonPoolPeriod[];
}