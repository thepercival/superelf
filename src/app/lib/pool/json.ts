import { JsonCompetition } from 'ngx-sport';
import { JsonAssemblePeriod } from '../period/assemble/json';
import { JsonTransferPeriod } from '../period/transfer/json';
import { JsonViewPeriod } from '../period/view/json';
import { JsonPoints } from '../points/json';
import { JsonPoolCollection } from './collection/json';

export interface JsonPool {
    id: number;
    collection: JsonPoolCollection;
    competitions: JsonCompetition[];
    sourceCompetitionId: number;
    points: JsonPoints;
    createAndJoinPeriod: JsonViewPeriod;
    assemblePeriod: JsonAssemblePeriod;
    transferPeriod: JsonTransferPeriod;
}