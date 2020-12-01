import { Injectable } from '@angular/core';

import { Pool } from '../../pool';
import { ScoreUnit } from '../../scoreUnit';
import { ScoreUnitMapper } from '../../scoreUnit/mapper';
import { PoolScoreUnit } from '../scoreUnit';
import { JsonPoolScoreUnit } from './json';

@Injectable()
export class PoolScoreUnitMapper {
    constructor(private scoreUnitMapper: ScoreUnitMapper) { }

    toObject(json: JsonPoolScoreUnit, pool: Pool): PoolScoreUnit {
        return new PoolScoreUnit(pool, this.scoreUnitMapper.toObject(json.number), json.points);
    }

    toJson(poolScoreUnit: PoolScoreUnit): JsonPoolScoreUnit {
        return {
            number: poolScoreUnit.getBase().getNumber(),
            points: poolScoreUnit.getPoints()
        };
    }
}

export class ScoreUnitMap extends Map<number, number> {

}
