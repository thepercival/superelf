import { Injectable } from '@angular/core';
import { Competition, CompetitionMapper } from 'ngx-sport';

import { Pool } from '../pool';
import { JsonPool } from './json';
import { PoolCollectionMapper } from './collection/mapper';
import { PoolScoreUnitMapper } from './scoreUnit/mapper';
import { PoolUserMapper } from './user/mapper';
import { AssemblePeriodMapper } from '../period/assemble/mapper';
import { TransferPeriodMapper } from '../period/transfer/mapper';

@Injectable()
export class PoolMapper {
    constructor(
        private collectionMapper: PoolCollectionMapper,
        private assemblePeriodMapper: AssemblePeriodMapper,
        private transferPeriodMapper: TransferPeriodMapper,
        private poolScoreUnitMapper: PoolScoreUnitMapper,
        private competitionMapper: CompetitionMapper,
        private poolUserMapper: PoolUserMapper) { }

    toObject(json: JsonPool, sourceCompetition: Competition): Pool {
        const pool = new Pool(
            this.collectionMapper.toObject(json.collection),
            sourceCompetition,
            this.assemblePeriodMapper.toObject(json.assemblePeriod),
            this.transferPeriodMapper.toObject(json.transferPeriod));
        json.competitions.forEach(jsonCompetition => {
            pool.getCompetitions().push(this.competitionMapper.toObject(jsonCompetition));
        });
        json.scoreUnits.forEach(jsonPoolScoreUnit => {
            this.poolScoreUnitMapper.toObject(jsonPoolScoreUnit, pool);
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
