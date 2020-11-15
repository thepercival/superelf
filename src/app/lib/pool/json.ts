import { JsonCompetition } from 'ngx-sport';
import { JsonPoolCollection } from './collection/json';
import { JsonPoolEditPeriod } from './period/edit/json';
import { JsonPoolScoreUnit } from './scoreUnit/json';

export interface JsonPool {
    id: number;
    collection: JsonPoolCollection;
    competitions: JsonCompetition[];
    sourceCompetitionId: number;
    scoreUnits: JsonPoolScoreUnit[];
    assemblePeriod: JsonPoolEditPeriod;
    transferPeriod: JsonPoolEditPeriod;
}