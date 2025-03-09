import { Injectable } from '@angular/core';
import { CompetitionMapper } from 'ngx-sport';

import { JsonCompetitionConfig } from './json';
import { AssemblePeriodMapper } from '../periods/assemblePeriod/mapper';
import { TransferPeriodMapper } from '../periods/transferPeriod/mapper';
import { ViewPeriodMapper } from '../periods/viewPeriod/mapper';
import { CompetitionConfig } from '../competitionConfig';
import { ScorePoints } from '../score/points';

@Injectable({
    providedIn: 'root'
})
export class CompetitionConfigMapper {
    constructor(
        private competitionMapper: CompetitionMapper,
        private viewPeriodMapper: ViewPeriodMapper,
        private assemblePeriodMapper: AssemblePeriodMapper,
        private transferPeriodMapper: TransferPeriodMapper) { }

    toObject(json: JsonCompetitionConfig): CompetitionConfig {
        const config = new CompetitionConfig(
            this.competitionMapper.toObject(json.sourceCompetition),
            json.scorePoints,
            json.lineScorePoints,
            this.viewPeriodMapper.toObject(json.createAndJoinPeriod),
            this.assemblePeriodMapper.toObject(json.assemblePeriod),
            this.transferPeriodMapper.toObject(json.transferPeriod)
        );
        config.setId(json.id);
        return config;
    }

    protected convertToScorePoints(): ScorePoints[] {
        return [];
    }

    // toJson(competitionConfig: CompetitionConfig): JsonCompetitionConfig {
    //     return {
    //         season: this.seasonMapper.toJson(pool.getSeason()),
    //         competitions: pool.getCompetitions().map(competition => this.competitionMapper.toJson(competition)),
    //         formations: pool.getFormations().map(formation => this.formationMapper.toJson(formation)),
    //         users: pool.getUsers().map(poolUser => this.poolUserMapper.toJson(poolUser)),
    //     };
    // }
}
