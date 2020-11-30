import { Injectable } from '@angular/core';

import { GameRoundScore } from '../gameRoundScore';
import { JsonPoolScoreUnit } from '../scoreUnit/json';
import { PoolScoreUnitMap, PoolScoreUnitMapper } from '../scoreUnit/mapper';
import { PoolUser } from '../user';
import { JsonGameRoundScore } from './json';

@Injectable()
export class GameRoundScoreMapper {
    constructor(private poolScoreUnitMapper: PoolScoreUnitMapper) { }

    toObject(json: JsonGameRoundScore, poolUser: PoolUser): GameRoundScore {
        const map = new PoolScoreUnitMap();
        json.scoreUnits.forEach((jsonScoreUnit: JsonPoolScoreUnit) => {
            const scoreUnit = this.poolScoreUnitMapper.toObject(jsonScoreUnit, poolUser.getPool());
            map.set(scoreUnit.getNumber(), scoreUnit);
        });
        return new GameRoundScore(poolUser, json.gameRound, map);
    }
}
