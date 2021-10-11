import { Injectable } from '@angular/core';
import { PersonMapper } from 'ngx-sport';
import { ViewPeriod } from '../period/view';
import { S11Player } from '../player';
import { JsonS11Player } from './json';
import { StatisticsMapper } from '../statistics/mapper';

@Injectable()
export class S11PlayerMapper {
    constructor(protected personMapper: PersonMapper, protected statisticsMapper: StatisticsMapper) { }

    toObject(json: JsonS11Player, viewPeriod: ViewPeriod): S11Player {
        const association = viewPeriod.getSourceCompetition().getLeague().getAssociation();
        const person = this.personMapper.toObject(json.person, association, undefined);
        const player = new S11Player(viewPeriod, person);
        player.setId(json.id);
        if (json.statistics) {
            json.statistics.forEach((jsonStatistics) => {
                // const gameRound = viewPeriod.getGameRound(jsonStatistics.gameRoundNumber);
                player.setStatistics(
                    jsonStatistics.gameRoundNumber, this.statisticsMapper.toObject(jsonStatistics)
                );
            });
        }
        // player.setPoints(json.points);
        // player.setTotal(json.total);
        // console.log(json.gameRoundScores)

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
        return player;
    }

    toJson(player: S11Player): JsonS11Player {
        return {
            id: player.getId(),
            person: this.personMapper.toJson(player.getPerson()),
            statistics: undefined
            // points: new Map(),
            // total: 0,
            // gameRoundScores: []
        };
    }
}
