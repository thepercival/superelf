import { Injectable } from '@angular/core';
import { Competition, CompetitionMapper, FormationMapper } from 'ngx-sport';

import { JsonCompetitionConfig } from './json';
import { AssemblePeriodMapper } from '../period/assemble/mapper';
import { TransferPeriodMapper } from '../period/transfer/mapper';
import { ViewPeriodMapper } from '../period/view/mapper';
import { PointsMapper } from '../points/mapper';
import { CompetitionConfig } from '../competitionConfig';

@Injectable({
    providedIn: 'root'
})
export class CompetitionConfigMapper {
    constructor(
        private competitionMapper: CompetitionMapper,
        private viewPeriodMapper: ViewPeriodMapper,
        private pointsMapper: PointsMapper,
        private assemblePeriodMapper: AssemblePeriodMapper,
        private transferPeriodMapper: TransferPeriodMapper) { }

    toObject(json: JsonCompetitionConfig): CompetitionConfig {
        const config = new CompetitionConfig(
            this.competitionMapper.toObject(json.sourceCompetition),
            this.pointsMapper.toObject(json.points),
            this.viewPeriodMapper.toObject(json.createAndJoinPeriod),
            this.assemblePeriodMapper.toObject(json.assemblePeriod),
            this.transferPeriodMapper.toObject(json.transferPeriod)
        );
        config.setId(json.id);
        return config;
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
