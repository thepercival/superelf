import { Injectable } from '@angular/core';
import { CompetitionMapper } from 'ngx-sport';

import { Pool } from '../pool';
import { JsonPool } from './json';
import { CompetitorMapper } from '../competitor/mapper';
import { UserMapper } from '../user/mapper';

@Injectable()
export class PoolMapper {
    constructor(
        private competitionMapper: CompetitionMapper,
        private competitorMapper: CompetitorMapper,
        private userMapper: UserMapper) { }

    toObject(json: JsonPool): Pool {
        const competition = this.competitionMapper.toObject(json.competition);
        const pool = new Pool(competition);
        json.competitors.forEach(jsonCompetitor => {
            const user = this.userMapper.toObject(jsonCompetitor.user);
            this.competitorMapper.toObject(jsonCompetitor, pool, user);
        });
        pool.setId(json.id);
        pool.setPublic(json.public);
        return pool;
    }

    toJson(pool: Pool): JsonPool {
        return {
            id: pool.getId(),
            competition: this.competitionMapper.toJson(pool.getCompetition()),
            competitors: pool.getCompetitors().map(competitor => this.competitorMapper.toJson(competitor)),
            public: pool.getPublic()
        };
    }
}
