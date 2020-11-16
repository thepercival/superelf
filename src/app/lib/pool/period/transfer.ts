import { PoolEditPeriod } from './edit';
import { PoolViewPeriod } from './view';

export class PoolTransferPeriod extends PoolEditPeriod {
    constructor(startDateTime: Date, endDateTime: Date, viewPeriod: PoolViewPeriod,
        protected maxNrOfTransfers: number) {
        super(startDateTime, endDateTime, viewPeriod);
    }

    getMaxNrOfTransfers(): number {
        return this.maxNrOfTransfers;
    }
}