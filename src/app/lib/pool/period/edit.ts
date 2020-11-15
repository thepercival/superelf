import { Period } from 'ngx-sport';
import { PoolViewPeriod } from './view';

export class PoolEditPeriod extends Period {
    constructor(startDateTime: Date, endDateTime: Date, protected viewPeriod: PoolViewPeriod) {
        super(startDateTime, endDateTime);
    }
}