import { Injectable } from '@angular/core';
import { TransferPeriod } from '../transfer';
import { ViewPeriodMapper } from '../view/mapper';
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


