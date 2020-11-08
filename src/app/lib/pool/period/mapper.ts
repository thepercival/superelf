import { Injectable } from '@angular/core';

import { Pool } from '../../pool';
import { PoolPeriod } from '../period';
import { JsonPoolPeriod } from './json';

@Injectable()
export class PoolPeriodMapper {
    constructor() { }

    toObject(json: JsonPoolPeriod, pool: Pool): PoolPeriod {
        return new PoolPeriod(pool, json.type, new Date(json.startDateTime), new Date(json.endDateTime));
    }

    toJson(period: PoolPeriod): JsonPoolPeriod {
        return {
            type: period.getType(),
            startDateTime: period.getStartDateTime().toISOString(),
            endDateTime: period.getEndDateTime().toISOString(),
        };
    }
}


