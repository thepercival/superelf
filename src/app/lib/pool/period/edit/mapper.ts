import { Injectable } from '@angular/core';
import { PoolAssemblePeriod } from '../assembleTeam';

import { PoolTransferPeriod } from '../transfer';
import { PoolViewPeriodMapper } from '../view/mapper';
import { JsonPoolEditPeriod } from './json';

@Injectable()
export class PoolEditPeriodMapper {
    constructor(protected poolViewPeriodMapper: PoolViewPeriodMapper) { }

    toAssemble(json: JsonPoolEditPeriod): PoolAssemblePeriod {
        const viewPeriod = this.poolViewPeriodMapper.toObject(json.viewPeriod);
        return new PoolAssemblePeriod(new Date(json.start), new Date(json.end), viewPeriod);
    }

    toTransfer(json: JsonPoolEditPeriod): PoolTransferPeriod {
        const viewPeriod = this.poolViewPeriodMapper.toObject(json.viewPeriod);
        return new PoolTransferPeriod(new Date(json.start), new Date(json.end), viewPeriod);
    }
}


