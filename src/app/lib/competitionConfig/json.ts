import { JsonCompetition, JsonIdentifiable } from 'ngx-sport';
import { JsonAssemblePeriod } from '../period/assemble/json';
import { JsonTransferPeriod } from '../period/transfer/json';
import { JsonViewPeriod } from '../period/view/json';
import { JsonPoints } from '../points/json';

export interface JsonCompetitionConfig extends JsonIdentifiable {
    sourceCompetition: JsonCompetition;
    points: JsonPoints;
    createAndJoinPeriod: JsonViewPeriod;
    assemblePeriod: JsonAssemblePeriod;
    transferPeriod: JsonTransferPeriod;
}