import { Injectable } from '@angular/core';
import { ScoreUnit } from '../scoreUnit';

@Injectable()
export class ScoreUnitMapper {
    protected scoreUnits: ScoreUnit[] = [];

    constructor() { }

    toObject(nr: number, disableCache?: boolean): ScoreUnit {
        let scoreUnit;
        if (disableCache !== true) {
            scoreUnit = this.scoreUnits[nr];
        }
        if (scoreUnit === undefined) {
            scoreUnit = new ScoreUnit(nr);
            this.scoreUnits[nr] = scoreUnit;
        }
        return new ScoreUnit(nr);
    }

    toJson(scoreUnit: ScoreUnit): number {
        return scoreUnit.getNumber();
    }
}


