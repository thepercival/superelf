import { Period } from 'ngx-sport';
import { JsonCompetitionShell } from '../activeConfig/json';

export class ActiveConfig {

    constructor(
        protected createAndJoinPeriod: Period,
        protected joinAndChoosePlayersPeriod: Period,
        protected sourceCompetitions: JsonCompetitionShell[]) {
    }

    public getCreateAndJoinPeriod(): Period {
        return this.createAndJoinPeriod;
    }

    public getJoinAndChoosePlayersPeriod(): Period {
        return this.joinAndChoosePlayersPeriod;
    }

    public getCompetitions(): JsonCompetitionShell[] {
        return this.sourceCompetitions;
    }
}