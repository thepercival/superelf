import { Injectable } from '@angular/core';
import { Season } from 'ngx-sport';
import { ScoreUnitMapper } from '../../../scoreUnit/mapper';
import { SeasonScoreUnit } from '../scoreUnit';
import { JsonSeasonScoreUnit } from './json';


@Injectable()
export class SeasonScoreUnitMapper {
    constructor(private scoreUnitMapper: ScoreUnitMapper) { }

    toObject(json: JsonSeasonScoreUnit, season: Season): SeasonScoreUnit {
        return new SeasonScoreUnit(season, this.scoreUnitMapper.toObject(json.number), json.points);
    }

    toJson(seasonScoreUnit: SeasonScoreUnit): JsonSeasonScoreUnit {
        return {
            number: seasonScoreUnit.getBase().getNumber(),
            points: seasonScoreUnit.getPoints()
        };
    }
}

export class ScoreUnitMap extends Map<number, number> {

}
