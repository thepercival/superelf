import { Injectable } from '@angular/core';
import { PoolAssemblePeriod } from '../assemble';

import { PoolTransferPeriod } from '../transfer';
import { PoolViewPeriodMapper } from '../view/mapper';
import { JsonPoolTransferPeriod } from './json';

@Injectable()
export class PoolTransferPeriodMapper {
    constructor(protected poolViewPeriodMapper: PoolViewPeriodMapper) { }

    toObject(json: JsonPoolTransferPeriod): PoolTransferPeriod {
        const viewPeriod = this.poolViewPeriodMapper.toObject(json.viewPeriod);
        return new PoolTransferPeriod(new Date(json.start), new Date(json.end), viewPeriod, json.maxNrOfTransfers);
    }
}


