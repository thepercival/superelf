import { Injectable } from '@angular/core';
import { FormationMapper, Period } from 'ngx-sport';

import { ActiveConfig } from '../activeConfig';
import { JsonActiveConfig } from './json';

@Injectable({
    providedIn: 'root'
})
export class ActiveConfigMapper {
    constructor(protected formationMapper: FormationMapper
    ) { }

    toObject(json: JsonActiveConfig): ActiveConfig {
        const activeConfig = new ActiveConfig(
            new Period(new Date(json.createAndJoinStart), new Date(json.createAndJoinEnd)),
            json.availableFormations.map(jsonFormation => this.formationMapper.toObject(jsonFormation)),
            json.sourceCompetitions
        );
        return activeConfig;
    }

    // toJson(activeConfig: ActiveConfig): JsonActiveConfig {
    //     return {
    //         createAndJoinStart: activeConfig.getCreateAndJoinPeriod().getStartDateTime().toISOString(),
    //         createAndJoinEnd: activeConfig.getCreateAndJoinPeriod().getEndDateTime().toISOString(),
    //         joinAndAssembleStart: activeConfig.getJoinAndAssemblePeriod().getStartDateTime().toISOString(),
    //         joinAndAssembleEnd: activeConfig.getJoinAndAssemblePeriod().getEndDateTime().toISOString(),
    //         sourceCompetitions: activeConfig.getCompetitions()
    //     };
    // }
}
