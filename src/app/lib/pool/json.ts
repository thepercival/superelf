import { JsonCompetition } from 'ngx-sport';
import { JsonPoolCollection } from './collection/json';
import { JsonPoolAssemblePeriod } from './period/assemble/json';
import { JsonPoolTransferPeriod } from './period/transfer/json';
import { JsonPoolScoreUnit } from './scoreUnit/json';

export interface JsonPool {
    id: number;
    collection: JsonPoolCollection;
    competitions: JsonCompetition[];
    sourceCompetitionId: number;
    scoreUnits: JsonPoolScoreUnit[];
    assemblePeriod: JsonPoolAssemblePeriod;
    transferPeriod: JsonPoolTransferPeriod;
}