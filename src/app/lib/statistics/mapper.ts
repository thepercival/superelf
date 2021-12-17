import { Injectable } from '@angular/core';
import { PersonMapper } from 'ngx-sport';
import { ScoreUnit } from '../scoreUnit';
import { Statistics } from '../statistics';
import { JsonStatistics } from './json';

@Injectable({
    providedIn: 'root'
})
export class StatisticsMapper {
    constructor(protected personMapper: PersonMapper) { }

    toObject(json: JsonStatistics/*, viewPeriod: ViewPeriod*/): Statistics {
        // const gameRound = viewPeriod.getGameRound(json.gameRoundNumber);
        return new Statistics(json);
    }

    toJson(scoreUnit: ScoreUnit): number {
        return scoreUnit.getNumber();
    }
}


