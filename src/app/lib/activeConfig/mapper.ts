import { Injectable } from '@angular/core';
import { JsonAssociation, Period } from 'ngx-sport';

import { Pool } from '../pool';
import { ActiveConfig } from '../pool/activeConfig';
import { JsonActiveConfig } from './json';

@Injectable()
export class ActiveConfigMapper {
    constructor(
    ) { }

    toObject(json: JsonActiveConfig): ActiveConfig {
        const activeConfig = new ActiveConfig(
            new Period(new Date(json.createAndJoinStart), new Date(json.createAndJoinEnd)),
            new Period(new Date(json.joinAndChoosePlayersStart), new Date(json.createAndJoinEnd)),
            json.sourceCompetitions
        );
        return activeConfig;
    }

    toJson(activeConfig: ActiveConfig): JsonActiveConfig {
        return {
            createAndJoinStart: activeConfig.getCreateAndJoinPeriod().getStartDateTime().toISOString(),
            createAndJoinEnd: activeConfig.getCreateAndJoinPeriod().getEndDateTime().toISOString(),
            joinAndChoosePlayersStart: activeConfig.getJoinAndChoosePlayersPeriod().getStartDateTime().toISOString(),
            joinAndChoosePlayersEnd: activeConfig.getJoinAndChoosePlayersPeriod().getEndDateTime().toISOString(),
            sourceCompetitions: activeConfig.getCompetitions()
        };
    }
}
