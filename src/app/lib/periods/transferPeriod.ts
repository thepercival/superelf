import { EditPeriod } from './editPeriod';
import { ViewPeriod } from './viewPeriod';

export class TransferPeriod extends EditPeriod {
    constructor(startDateTime: Date, endDateTime: Date, viewPeriod: ViewPeriod,
        protected maxNrOfTransfers: number) {
        super(startDateTime, endDateTime, viewPeriod);
    }

    getMaxNrOfTransfers(): number {
        return this.maxNrOfTransfers;
    }
}