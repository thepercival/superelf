import { Season } from 'ngx-sport';
import { ScoreUnit } from '../../scoreUnit';

export class SeasonScoreUnit {
    constructor(protected season: Season, protected base: ScoreUnit, protected points: number) {
        // this.season.getScoreUnits().push(this);
    }

    public getSeason(): Season {
        return this.season;
    }

    public getBase(): ScoreUnit {
        return this.base;
    }

    public getNumber(): number {
        return this.base.getNumber();
    }

    public getPoints(): number {
        return this.points;
    }
}