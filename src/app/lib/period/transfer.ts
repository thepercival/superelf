import { EditPeriod } from './edit';
import { ViewPeriod } from './view';

export class TransferPeriod extends EditPeriod {
    constructor(startDateTime: Date, endDateTime: Date, viewPeriod: ViewPeriod,
        protected maxNrOfTransfers: number) {
        super(startDateTime, endDateTime, viewPeriod);
    }

    getMaxNrOfTransfers(): number {
        return this.maxNrOfTransfers;
    }
}