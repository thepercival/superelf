import { Injectable } from '@angular/core';
import { Competition } from 'ngx-sport';
import { TransferPeriod } from '../transfer';
import { ViewPeriodMapper } from '../view/mapper';
import { JsonTransferPeriod } from './json';

@Injectable()
export class TransferPeriodMapper {
    constructor(protected viewPeriodMapper: ViewPeriodMapper) { }

    toObject(json: JsonTransferPeriod, sourceCompetition: Competition): TransferPeriod {
        const viewPeriod = this.viewPeriodMapper.toObject(json.viewPeriod, sourceCompetition);
        return new TransferPeriod(new Date(json.start), new Date(json.end), viewPeriod, json.maxNrOfTransfers);
    }
}


