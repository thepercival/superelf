import { Injectable } from '@angular/core';
import { Competition, JsonPlayer, PersonMapper, PlayerMapper } from 'ngx-sport';
import { ViewPeriod } from '../periods/viewPeriod';
import { S11Player } from '../player';
import { JsonS11Player } from './json';
import { StatisticsMapper } from '../statistics/mapper';
import { TotalsMapper } from '../totals/mapper';

@Injectable({
    providedIn: 'root'
})
export class S11PlayerMapper {
    constructor(
        protected personMapper: PersonMapper,
        protected playerMapper: PlayerMapper,
        protected totalsMapper: TotalsMapper,
        protected statisticsMapper: StatisticsMapper) { }

    toObject(json: JsonS11Player, competition: Competition, viewPeriod: ViewPeriod): S11Player {
        const association = competition.getLeague().getAssociation();
        const person = this.personMapper.toObject(json.person, association, undefined);
        const players = json.players.map((jsonPlayer: JsonPlayer) => this.playerMapper.toObject(
            jsonPlayer, association, person
        ));
        const s11Player = new S11Player(viewPeriod, person, players, this.totalsMapper.toObject(json.totals));
        s11Player.setId(json.id);
        return s11Player;
    }

    toJson(player: S11Player): JsonS11Player {
        return {
            id: player.getId(),
            person: this.personMapper.toJson(player.getPerson()),
            players: [],
            statistics: undefined,
            totals: this.totalsMapper.toJson(player.getTotals())
            // gameRoundScores: []
        };
    }
}

export class S11PlayerMap extends Map<number, S11Player> {

}

