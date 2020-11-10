import { Injectable } from '@angular/core';
import { Competition, CompetitionMapper, FormationMapper, SeasonMapper } from 'ngx-sport';

import { Pool } from '../pool';
import { JsonPool } from './json';
import { PoolCollectionMapper } from './collection/mapper';
import { PoolPeriodMapper } from './period/mapper';
import { PoolScoreUnitMapper } from './scoreUnit/mapper';
import { PoolUserMapper } from './user/mapper';

@Injectable()
export class PoolMapper {
    constructor(
        private collectionMapper: PoolCollectionMapper,
        private seasonMapper: SeasonMapper,
        private poolPeriodMapper: PoolPeriodMapper,
        private poolScoreUnitMapper: PoolScoreUnitMapper,
        private competitionMapper: CompetitionMapper,
        private poolUserMapper: PoolUserMapper,
        private formationMapper: FormationMapper) { }

    toObject(json: JsonPool, sourceCompetition: Competition): Pool {
        const pool = new Pool(
            this.collectionMapper.toObject(json.collection),
            sourceCompetition,
            this.seasonMapper.toObject(json.season));
        json.competitions.forEach(jsonCompetition => {
            pool.getCompetitions().push(this.competitionMapper.toObject(jsonCompetition));
        });
        const defaultSport = pool.getCompetition()?.getSportConfig().getSport();
        if (defaultSport) {
            json.formations.forEach(jsonFormation => {
                pool.getFormations().push(this.formationMapper.toObject(jsonFormation, defaultSport));
            });
        }
        json.periods.forEach(jsonPoolPeriod => {
            this.poolPeriodMapper.toObject(jsonPoolPeriod, pool);
        });
        json.scoreUnits.forEach(jsonPoolScoreUnit => {
            this.poolScoreUnitMapper.toObject(jsonPoolScoreUnit, pool);
        });
        json.users.forEach(jsonPoolUser => {
            this.poolUserMapper.toObject(jsonPoolUser, pool);
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
