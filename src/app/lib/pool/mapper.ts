import { Injectable } from '@angular/core';
import { Competition, CompetitionMapper, SeasonMapper } from 'ngx-sport';

import { Pool } from '../pool';
import { JsonPool } from './json';
import { PoolCollectionMapper } from './collection/mapper';
import { PoolScoreUnitMapper } from './scoreUnit/mapper';
import { PoolUserMapper } from './user/mapper';
import { PoolAssemblePeriodMapper } from './period/assemble/mapper';
import { PoolTransferPeriodMapper } from './period/transfer/mapper';

@Injectable()
export class PoolMapper {
    constructor(
        private collectionMapper: PoolCollectionMapper,
        private poolAssemblePeriodMapper: PoolAssemblePeriodMapper,
        private poolTransferPeriodMapper: PoolTransferPeriodMapper,
        private poolScoreUnitMapper: PoolScoreUnitMapper,
        private competitionMapper: CompetitionMapper,
        private poolUserMapper: PoolUserMapper) { }

    toObject(json: JsonPool, sourceCompetition: Competition): Pool {
        const pool = new Pool(
            this.collectionMapper.toObject(json.collection),
            sourceCompetition,
            this.poolAssemblePeriodMapper.toObject(json.assemblePeriod),
            this.poolTransferPeriodMapper.toObject(json.transferPeriod));
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
