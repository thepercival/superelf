import { Injectable } from '@angular/core';
import { Competition, CompetitionMapper } from 'ngx-sport';

import { Pool } from '../pool';
import { JsonPool } from './json';
import { PoolCollectionMapper } from './collection/mapper';
import { PoolUserMapper } from './user/mapper';
import { AssemblePeriodMapper } from '../period/assemble/mapper';
import { TransferPeriodMapper } from '../period/transfer/mapper';
import { ViewPeriodMapper } from '../period/view/mapper';
import { PointsMapper } from '../points/mapper';

@Injectable()
export class PoolMapper {
    constructor(
        private collectionMapper: PoolCollectionMapper,
        private viewPeriodMapper: ViewPeriodMapper,
        private competitionMapper: CompetitionMapper,
        private pointsMapper: PointsMapper,
        private assemblePeriodMapper: AssemblePeriodMapper,
        private transferPeriodMapper: TransferPeriodMapper) { }

    toObject(json: JsonPool, sourceCompetition: Competition): Pool {
        const pool = new Pool(
            this.collectionMapper.toObject(json.collection),
            sourceCompetition,
            this.pointsMapper.toObject(json.points),
            this.viewPeriodMapper.toObject(json.createAndJoinPeriod, sourceCompetition),
            this.assemblePeriodMapper.toObject(json.assemblePeriod, sourceCompetition),
            this.transferPeriodMapper.toObject(json.transferPeriod, sourceCompetition));
        json.competitions.forEach(jsonCompetition => {
            pool.getCompetitions().push(this.competitionMapper.toObject(jsonCompetition));
        });
        pool.setId(json.id);
        return pool;
    }

    // toJson(pool: Pool): JsonPool {
    //     return {
    //         id: pool.getId(),
    //         collection: this.collectionMapper.toJson(pool.getCollection()),
    //         season: this.seasonMapper.toJson(pool.getSeason()),
    //         competitions: pool.getCompetitions().map(competition => this.competitionMapper.toJson(competition)),
    //         formations: pool.getFormations().map(formation => this.formationMapper.toJson(formation)),
    //         users: pool.getUsers().map(poolUser => this.poolUserMapper.toJson(poolUser)),
    //     };
    // }
}
