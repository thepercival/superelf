import { Injectable } from '@angular/core';
import { CompetitionMapper, SeasonMapper } from 'ngx-sport';

import { Pool } from '../pool';
import { JsonPool } from './json';
import { CompetitorMapper } from '../competitor/mapper';
import { UserMapper } from '../user/mapper';
import { PoolCollectionMapper } from './collection/mapper';

@Injectable()
export class PoolMapper {
    constructor(
        private collectionMapper: PoolCollectionMapper,
        private seasonMapper: SeasonMapper,
        private competitionMapper: CompetitionMapper,
        private competitorMapper: CompetitorMapper,
        private userMapper: UserMapper) { }

    toObject(json: JsonPool): Pool {
        const pool = new Pool(this.collectionMapper.toObject(json.collection), this.seasonMapper.toObject(json.season));
        json.competitions.forEach(jsonCompetition => {
            const competition = this.competitionMapper.toObject(jsonCompetition);
            json.competitors.forEach(jsonCompetitor => {
                if (competition.getLeague().getName() === Pool.LeagueSuperCup && !jsonCompetitor.supercup) {
                    return;
                }
                const user = this.userMapper.toObject(jsonCompetitor.user);
                this.competitorMapper.toObject(jsonCompetitor, pool, competition, user);
            });
        });

        pool.setId(json.id);
        return pool;
    }

    toJson(pool: Pool): JsonPool {
        return {
            id: pool.getId(),
            collection: this.collectionMapper.toJson(pool.getCollection()),
            season: this.seasonMapper.toJson(pool.getSeason()),
            competitions: pool.getCompetitions().map(competition => this.competitionMapper.toJson(competition)),
            competitors: pool.getCompetitors().map(competitor => this.competitorMapper.toJson(competitor)),
        };
    }
}
