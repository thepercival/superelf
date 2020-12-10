import { Injectable } from '@angular/core';
import { PersonMapper } from 'ngx-sport';
import { JsonGameRoundScore } from '../../../gameRound/score/json';
import { ViewPeriod } from '../../view';
import { ViewPeriodPerson } from '../person';
import { ViewPeriodPersonGameRoundScore } from './gameRoundScore';
import { JsonViewPeriodPersonGameRoundScore } from './gameRoundScore/json';
import { JsonViewPeriodPerson } from './json';

@Injectable()
export class ViewPeriodPersonMapper {
    constructor(protected personMapper: PersonMapper) { }

    toObject(json: JsonViewPeriodPerson, viewPeriod: ViewPeriod): ViewPeriodPerson {
        const association = viewPeriod.getSourceCompetition().getLeague().getAssociation();
        const viewPeriodPerson = new ViewPeriodPerson(
            viewPeriod,
            this.personMapper.toObject(json.person, association, undefined));
        viewPeriodPerson.setId(json.id);
        viewPeriodPerson.setPoints(json.points);
        viewPeriodPerson.setTotal(json.total);
        // console.log(json.gameRoundScores)

        json.gameRoundScores.forEach((jsonGameRoundScore: JsonViewPeriodPersonGameRoundScore) => {
            // const stats = new Map<number, boolean | number>();
            // for (let stat in jsonGameRoundScore.points) {
            //     stats.set(+stat, jsonGameRoundScore.points[stat]);
            // }
            const gameRound = viewPeriod.getGameRound(jsonGameRoundScore.gameRoundNumber);
            if (!gameRound) {
                return;
            }
            const gameRoundScore = new ViewPeriodPersonGameRoundScore(viewPeriodPerson, gameRound, jsonGameRoundScore.stats);
            gameRoundScore.setPoints(jsonGameRoundScore.points);
            gameRoundScore.setTotal(jsonGameRoundScore.total);
        });
        return viewPeriodPerson;
    }

    toJson(viewPeriodPerson: ViewPeriodPerson): JsonViewPeriodPerson {
        return {
            id: viewPeriodPerson.getId(),
            person: this.personMapper.toJson(viewPeriodPerson.getPerson()),
            points: new Map(),
            total: 0,
            gameRoundScores: []
        };
    }
}
