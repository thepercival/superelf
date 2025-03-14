import { Injectable } from '@angular/core';
import { Competition } from 'ngx-sport';
import { ViewPeriod } from '../../periods/viewPeriod';
import { S11PlayerMapper } from '../../player/mapper';
import { TotalsMapper } from '../../totals/mapper';
import { S11FormationLine } from '../line';
import { S11FormationPlace } from '../place';
import { JsonS11FormationPlace } from './json';

@Injectable({
    providedIn: 'root'
})
export class FormationPlaceMapper {
    constructor(protected playerMapper: S11PlayerMapper, protected totalsMapper: TotalsMapper) { }

    toObject(json: JsonS11FormationPlace, line: S11FormationLine, competition: Competition, viewPeriod: ViewPeriod): S11FormationPlace {
        const s11Player = json.player ? this.playerMapper.toObject(json.player, competition, viewPeriod) : undefined;
        const place = new S11FormationPlace(line, s11Player, json.number, this.totalsMapper.toObject(json.totals));
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
            penaltyPoints: place.getPenaltyPoints(),
            totals: {
                nrOfWins: 0,
                nrOfDraws: 0,
                nrOfTimesStarted: 0,
                nrOfTimesSubstituted: 0,
                nrOfTimesSubstitute: 0,
                nrOfTimesNotAppeared: 0,
                nrOfFieldGoals: 0,
                nrOfAssists: 0,
                nrOfPenalties: 0,
                nrOfOwnGoals: 0,
                nrOfCleanSheets: 0,
                nrOfSpottySheets: 0,
                nrOfYellowCards: 0,
                nrOfRedCards: 0
            }
        }
    }
}


