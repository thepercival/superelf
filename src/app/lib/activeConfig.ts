import { Formation, Period } from 'ngx-sport';
import { JsonCompetitionShell } from './activeConfig/json';

export class ActiveConfig {

    constructor(
        protected createAndJoinPeriod: Period,
        protected availableFormations: Formation[],
        protected sourceCompetitions: JsonCompetitionShell[]) {
    }

    public getCreateAndJoinPeriod(): Period {
        return this.createAndJoinPeriod;
    }

    public getAvailableFormations(): Formation[] {
        return this.availableFormations;
    }

    public getCompetitions(): JsonCompetitionShell[] {
        return this.sourceCompetitions;
    }
}