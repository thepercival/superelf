import { Injectable } from '@angular/core';

import { Pool } from '../pool';
import { PoolCompetitor } from '../competitor';
import { Competition, JsonCompetitor } from 'ngx-sport';
import { JsonPoolCompetitor } from './json';
import { User } from '../user';
import { UserMapper } from '../user/mapper';

@Injectable()
export class CompetitorMapper {
    constructor(private userMapper: UserMapper) { }

    toObject(json: JsonPoolCompetitor, pool: Pool, competition: Competition, user: User, competitor?: PoolCompetitor): PoolCompetitor {
        if (competitor === undefined) {
            competitor = new PoolCompetitor(pool, competition, user, json.pouleNr, json.placeNr, json.admin);
        }
        competitor.setId(json.id);
        this.updateObject(json, competitor);
        return competitor;
    }

    updateObject(json: JsonCompetitor, competitor: PoolCompetitor) {
        competitor.setRegistered(json.registered);
        competitor.setInfo(json.info);
    }

    toJson(competitor: PoolCompetitor): JsonPoolCompetitor {
        return {
            id: competitor.getId(),
            registered: competitor.getRegistered(),
            info: competitor.getInfo(),
            name: competitor.getName(),
            pouleNr: competitor.getPouleNr(),
            placeNr: competitor.getPlaceNr(),
            admin: competitor.getAdmin(),
            user: this.userMapper.toJson(competitor.getUser()),
            supercup: competitor.getCompetition().getLeague().getName() === Pool.LeagueSuperCup
        };
    }
}