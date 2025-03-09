import { Injectable } from '@angular/core';
import { GameRound } from '../gameRound';
import { ViewPeriod } from '../periods/viewPeriod';
import { JsonGameRound } from './json';

@Injectable({
    providedIn: 'root'
})
export class GameRoundMapper {
    constructor() { }

    toObject(json: JsonGameRound, viewPeriod: ViewPeriod): GameRound {
        const gameRound = new GameRound(viewPeriod, json.number);
        return gameRound;
    }
}


