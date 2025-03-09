import { Injectable } from '@angular/core';
import { TransferPeriod } from '../transferPeriod';
import { ViewPeriodMapper } from '../viewPeriod/mapper';
import { JsonTransferPeriod } from './json';

@Injectable({
    providedIn: 'root'
})
export class TransferPeriodMapper {
    constructor(protected viewPeriodMapper: ViewPeriodMapper) { }

    toObject(json: JsonTransferPeriod): TransferPeriod {
        const viewPeriod = this.viewPeriodMapper.toObject(json.viewPeriod);
        return new TransferPeriod(new Date(json.start), new Date(json.end), viewPeriod, json.maxNrOfTransfers);
    }
}


