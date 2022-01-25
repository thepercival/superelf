import { Injectable } from '@angular/core';
import { Competition } from 'ngx-sport';
import { ViewPeriod } from '../../period/view';
import { S11PlayerMapper } from '../../player/mapper';
import { S11FormationLine } from '../line';
import { S11FormationPlace } from '../place';
import { JsonS11FormationPlace } from './json';

@Injectable({
    providedIn: 'root'
})
export class FormationPlaceMapper {
    constructor(protected playerMapper: S11PlayerMapper) { }

    toObject(json: JsonS11FormationPlace, line: S11FormationLine, competition: Competition, viewPeriod: ViewPeriod): S11FormationPlace {
        const s11Player = json.player ? this.playerMapper.toObject(json.player, competition, viewPeriod) : undefined;
        const place = new S11FormationPlace(line, s11Player, json.number);
        place.setId(json.id);
        place.setPenaltyPoints(json.penaltyPoints);
        return place;
    }

    toJson(place: S11FormationPlace): JsonS11FormationPlace {
        const player = place.getPlayer();
        return {
            id: place.getId(),
            number: place.getNumber(),
            player: player ? this.playerMapper.toJson(player) : player,
            penaltyPoints: place.getPenaltyPoints()
        };
    }
}


