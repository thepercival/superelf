import { PoolEditPeriod } from './edit';
import { PoolViewPeriod } from './view';

export class PoolAssemblePeriod extends PoolEditPeriod {
    constructor(startDateTime: Date, endDateTime: Date, viewPeriod: PoolViewPeriod) {
        super(startDateTime, endDateTime, viewPeriod);
    }
}