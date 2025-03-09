import { JsonCompetition, JsonIdentifiable } from 'ngx-sport';
import { JsonAssemblePeriod } from '../periods/assemblePeriod/json';
import { JsonTransferPeriod } from '../periods/transferPeriod/json';
import { JsonViewPeriod } from '../periods/viewPeriod/json';
import { LineScorePoints, ScorePoints } from '../score/points';

export interface JsonCompetitionConfig extends JsonIdentifiable {
    sourceCompetition: JsonCompetition;
    scorePoints: ScorePoints[];
    lineScorePoints: LineScorePoints[];
    createAndJoinPeriod: JsonViewPeriod;
    assemblePeriod: JsonAssemblePeriod;
    transferPeriod: JsonTransferPeriod;
}