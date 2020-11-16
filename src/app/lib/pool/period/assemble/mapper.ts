import { Injectable } from '@angular/core';
import { PoolAssemblePeriod } from '../assemble';

import { PoolViewPeriodMapper } from '../view/mapper';
import { JsonPoolAssemblePeriod } from './json';
@Injectable()
export class PoolAssemblePeriodMapper {
    constructor(protected poolViewPeriodMapper: PoolViewPeriodMapper) { }

    toObject(json: JsonPoolAssemblePeriod): PoolAssemblePeriod {
        const viewPeriod = this.poolViewPeriodMapper.toObject(json.viewPeriod);
        return new PoolAssemblePeriod(new Date(json.start), new Date(json.end), viewPeriod);
    }
}


