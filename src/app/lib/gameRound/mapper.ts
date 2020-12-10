import { Injectable } from '@angular/core';
import { GameRound } from '../gameRound';
import { ViewPeriod } from '../period/view';
import { JsonGameRound } from './json';


@Injectable()
export class GameRoundMapper {
    constructor() { }

    toObject(json: JsonGameRound, viewPeriod: ViewPeriod): GameRound {
        const gameRound = new GameRound(viewPeriod, json.number);
        return gameRound;
    }
}


