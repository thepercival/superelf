import { Injectable } from '@angular/core';
import { CompetitionMapper } from 'ngx-sport';

import { Pool } from '../pool';
import { JsonPool } from './json';
import { PoolCollectionMapper } from './collection/mapper';
import { CompetitionConfig } from '../competitionConfig';
import { CompetitionConfigMapper } from '../competitionConfig/mapper';

@Injectable({
    providedIn: 'root'
})
export class PoolMapper {
    constructor(
        private collectionMapper: PoolCollectionMapper,
        private competitionConfigMapper: CompetitionConfigMapper,
        private competitionMapper: CompetitionMapper) { }

    toObject(json: JsonPool): Pool {
        const config: CompetitionConfig = this.competitionConfigMapper.toObject(json.competitionConfig)
        const pool = new Pool(
            this.collectionMapper.toObject(json.collection),
            config);
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
