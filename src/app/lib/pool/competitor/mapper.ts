import { Injectable } from '@angular/core';

import { PoolCompetitor } from '../competitor';
import { Competition } from 'ngx-sport';
import { JsonPoolCompetitor } from './json';
import { PoolUser } from '../user';

@Injectable()
export class PoolCompetitorMapper {
    constructor() { }

    toObject(json: JsonPoolCompetitor, poolUser: PoolUser, competition: Competition, competitor?: PoolCompetitor): PoolCompetitor {
        if (competitor === undefined) {
            competitor = new PoolCompetitor(poolUser, competition, json.pouleNr, json.placeNr);
        }
        competitor.setId(json.id);
        this.updateObject(json, competitor);
        return competitor;
    }

    updateObject(json: JsonPoolCompetitor, competitor: PoolCompetitor) {
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
            competitionId: competitor.getCompetition().getId()
        };
    }
}