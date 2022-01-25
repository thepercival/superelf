import { JsonCompetition } from 'ngx-sport';
import { JsonCompetitionConfig } from '../competitionConfig/json';
import { JsonPoolCollection } from './collection/json';

export interface JsonPool {
    id: number;
    collection: JsonPoolCollection;
    competitions: JsonCompetition[];
    competitionConfig: JsonCompetitionConfig;
}