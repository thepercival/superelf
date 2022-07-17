import { Injectable } from '@angular/core';

import { PoolCompetitor } from '../competitor';
import { Competition, StartLocation } from 'ngx-sport';
import { JsonPoolCompetitor } from './json';
import { PoolUser } from '../user';

@Injectable({
    providedIn: 'root'
})
export class PoolCompetitorMapper {
    constructor() { }

    toObject(json: JsonPoolCompetitor, poolUser: PoolUser, competition: Competition, competitor?: PoolCompetitor): PoolCompetitor {
        if (competitor === undefined) {
            competitor = new PoolCompetitor(poolUser, competition, new StartLocation(json.categoryNr, json.pouleNr, json.placeNr));
        }
        competitor.setId(json.id);
        return competitor;
    }

    toJson(competitor: PoolCompetitor): JsonPoolCompetitor {
        return {
            id: competitor.getId(),
            registered: competitor.getRegistered(),
            info: competitor.getInfo(),
            name: competitor.getName(),
            categoryNr: competitor.getStartLocation().getCategoryNr(),
            pouleNr: competitor.getStartLocation().getPouleNr(),
            placeNr: competitor.getStartLocation().getPlaceNr(),
            competitionId: competitor.getCompetition().getId()
        };
    }
}