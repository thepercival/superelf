import { JsonCompetition } from 'ngx-sport';
import { JsonAssemblePeriod } from '../period/assemble/json';
import { JsonTransferPeriod } from '../period/transfer/json';
import { JsonPoolCollection } from './collection/json';
import { JsonPoolScoreUnit } from './scoreUnit/json';

export interface JsonPool {
    id: number;
    collection: JsonPoolCollection;
    competitions: JsonCompetition[];
    sourceCompetitionId: number;
    scoreUnits: JsonPoolScoreUnit[];
    assemblePeriod: JsonAssemblePeriod;
    transferPeriod: JsonTransferPeriod;
}