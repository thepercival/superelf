import { Injectable } from '@angular/core';
import { Competition, JsonPlayer, PersonMapper, PlayerMapper } from 'ngx-sport';
import { ViewPeriod } from '../period/view';
import { S11Player } from '../player';
import { JsonS11Player } from './json';
import { StatisticsMapper } from '../statistics/mapper';

@Injectable({
    providedIn: 'root'
})
export class S11PlayerMapper {
    constructor(
        protected personMapper: PersonMapper,
        protected playerMapper: PlayerMapper,
        protected statisticsMapper: StatisticsMapper) { }

    toObject(json: JsonS11Player, competition: Competition, viewPeriod: ViewPeriod): S11Player {
        const association = competition.getLeague().getAssociation();
        const person = this.personMapper.toObject(json.person, association, undefined);
        const players = json.players.map((jsonPlayer: JsonPlayer) => this.playerMapper.toObject(
            jsonPlayer, association, person
        ));
        console.log('S11Player');
        const s11Player = new S11Player(viewPeriod, person, players, json.totals, json.totalPoints);
        s11Player.setId(json.id);
        // if (json.statistics) {
        //     json.statistics.forEach((jsonStatistics) => {
        //         // const gameRound = viewPeriod.getGameRound(jsonStatistics.gameRoundNumber);
        //         player.setStatistics(
        //             jsonStatistics.gameRoundNumber, this.statisticsMapper.toObject(jsonStatistics)
        //         );
        //     });
        // }
        // player.setPoints(json.points);
        // player.setTotal(json.total);

        // json.gameRoundScores?.forEach((jsonGameRoundScore: JsonPlayerGameRoundScore) => {
        //     // const stats = new Map<number, boolean | number>();
        //     // for (let stat in jsonGameRoundScore.points) {
        //     //     stats.set(+stat, jsonGameRoundScore.points[stat]);
        //     // }
        //     const gameRound = viewPeriod.getGameRound(jsonGameRoundScore.gameRoundNumber);
        //     if (!gameRound) {
        //         return;
        //     }
        //     const gameRoundScore = new PlayerGameRoundScore(player, gameRound, jsonGameRoundScore.stats);
        //     gameRoundScore.setPoints(jsonGameRoundScore.points);
        //     gameRoundScore.setTotal(jsonGameRoundScore.total);
        // });
        return s11Player;
    }

    toJson(player: S11Player): JsonS11Player {
        return {
            id: player.getId(),
            person: this.personMapper.toJson(player.getPerson()),
            players: [],
            statistics: undefined,
            totals: player.getTotals(),
            totalPoints: player.getTotalPoints()
            // gameRoundScores: []
        };
    }
}

export class S11PlayerMap extends Map<number, S11Player> {

}

