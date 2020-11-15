import { Period } from 'ngx-sport';
import { JsonCompetitionShell, JsonFormationShell } from '../activeConfig/json';

export class ActiveConfig {

    constructor(
        protected createAndJoinPeriod: Period,
        protected availableFormations: JsonFormationShell[],
        protected sourceCompetitions: JsonCompetitionShell[]) {
    }

    public getCreateAndJoinPeriod(): Period {
        return this.createAndJoinPeriod;
    }

    public getAvailableFormations(): JsonFormationShell[] {
        return this.availableFormations;
    }

    public getCompetitions(): JsonCompetitionShell[] {
        return this.sourceCompetitions;
    }
}