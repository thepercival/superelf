import { Injectable } from '@angular/core';
import { FormationMapper } from '../../formation/mapper';

import { Pool } from '../../pool';
import { UserMapper } from '../../user/mapper';
import { PoolCompetitorMapper } from '../competitor/mapper';
import { PoolUser } from '../user';
import { JsonPoolUser } from './json';

@Injectable()
export class PoolUserMapper {
    constructor(
        protected userMapper: UserMapper,
        protected poolCompetitorMapper: PoolCompetitorMapper,
        protected formationMapper: FormationMapper) { }

    toObject(json: JsonPoolUser, pool: Pool): PoolUser {
        const poolUser = new PoolUser(pool, this.userMapper.toObject(json.user));
        poolUser.setAdmin(json.admin);
        poolUser.setId(json.id);
        if (json.assembleFormation) {
            const formation = this.formationMapper.toObject(json.assembleFormation);
            poolUser.setAssembleFormation(formation)
        }
        if (json.transferFormation) {
            const formation = this.formationMapper.toObject(json.transferFormation);
            poolUser.setTransferFormation(formation)
        }
        json.competitors.forEach(jsonPoolCompetitor => {
            const competition = pool.getCompetitions().find(competition => competition.getId() === jsonPoolCompetitor.competitionId);
            if (competition) {
                this.poolCompetitorMapper.toObject(jsonPoolCompetitor, poolUser, competition);
            }
        });
        return poolUser;
    }

    // toJson(poolUser: PoolUser): JsonPoolUser {
    //     return {
    //         id: poolUser.getId(),
    //         user: this.userMapper.toJson(poolUser.getUser()),
    //         admin: poolUser.getAdmin(),
    //         competitors: poolUser.getCompetitors().map(competitor => this.poolCompetitorMapper.toJson(competitor)),
    //     };
    // }
}


