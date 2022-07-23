import { JsonCompetition, JsonIdentifiable } from 'ngx-sport';
import { JsonAssemblePeriod } from '../period/assemble/json';
import { JsonTransferPeriod } from '../period/transfer/json';
import { JsonViewPeriod } from '../period/view/json';
import { LineScorePoints, ScorePoints } from '../score/points';

export interface JsonCompetitionConfig extends JsonIdentifiable {
    sourceCompetition: JsonCompetition;
    scorePoints: ScorePoints[];
    lineScorePoints: LineScorePoints[];
    createAndJoinPeriod: JsonViewPeriod;
    assemblePeriod: JsonAssemblePeriod;
    transferPeriod: JsonTransferPeriod;
}