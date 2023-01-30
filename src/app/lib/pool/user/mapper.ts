import { Injectable } from '@angular/core';
import { EditActionMapper } from '../../editAction/mapper';
import { S11FormationMapper } from '../../formation/mapper';

import { Pool } from '../../pool';
import { UserMapper } from '../../user/mapper';
import { PoolCompetitorMapper } from '../competitor/mapper';
import { PoolUser } from '../user';
import { JsonPoolUser } from './json';

@Injectable({
    providedIn: 'root'
})
export class PoolUserMapper {
    constructor(
        protected userMapper: UserMapper,
        protected poolCompetitorMapper: PoolCompetitorMapper,
        protected formationMapper: S11FormationMapper,
        protected editActionMapper: EditActionMapper) { }

    toObject(json: JsonPoolUser, pool: Pool): PoolUser {
        let poolUser = this.getPoolUser(pool, json);
        if (poolUser === undefined) {
            poolUser = new PoolUser(pool, this.userMapper.toObject(json.user));
            poolUser.setAdmin(json.admin);
            poolUser.setId(json.id);
        }

        if (json.nrOfAssembled) {
            poolUser.setNrOfAssembled(json.nrOfAssembled);
        }
        // if (json.nrOfTransfersWithTeam) {
        //     poolUser.setNrOfTransferedWithTeam(json.nrOfTransfersWithTeam);
        // }
        const association = pool.getSourceCompetition().getAssociation();
        if (json.assembleFormation) {
            const formation = this.formationMapper.toObject(json.assembleFormation, poolUser, pool.getAssemblePeriod().getViewPeriod());
            poolUser.setAssembleFormation(formation);
        }
        if (json.replacements) {
            console.log('CDK');
            json.replacements.forEach(jsonTransfer => this.editActionMapper.toReplacement(jsonTransfer, poolUser, association));
        }
        if (json.transfers) {
            json.transfers.forEach(jsonTransfer => this.editActionMapper.toTransfer(jsonTransfer, poolUser, association));
        }
        if (json.substitutions) {
            json.substitutions.forEach(jsonSub => this.editActionMapper.toSubstitution(jsonSub, poolUser));
        }
        if (json.transferFormation) {
            const formation = this.formationMapper.toObject(json.transferFormation, poolUser, pool.getTransferPeriod().getViewPeriod());
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

    private getPoolUser(pool: Pool, json: JsonPoolUser): PoolUser {
        const existingPoolUser = pool.getUsers().find((poolUser: PoolUser): boolean => {
            return poolUser.getId() === json.id;
        });
        if (existingPoolUser !== undefined) {
            return existingPoolUser;
        }
        const poolUser = new PoolUser(pool, this.userMapper.toObject(json.user));
        poolUser.setAdmin(json.admin);
        poolUser.setId(json.id);
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


