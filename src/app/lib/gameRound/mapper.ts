import { Injectable } from '@angular/core';
import { GameRound } from '../gameRound';
import { ViewPeriod } from '../periods/viewPeriod';
import { JsonGameRound } from './json';
import { Period } from 'ngx-sport';

@Injectable({
    providedIn: 'root'
})
export class GameRoundMapper {
    constructor() { }

    toObject(json: JsonGameRound, viewPeriod: ViewPeriod): GameRound {
        const period: Period = new Period(new Date(json.period.start), new Date(json.period.end));
        const gameRound = new GameRound(
          viewPeriod,
          json.number,
          period,
          json.created,
          json.inProgress,
          json.finished
        );
        return gameRound;
    }
}


