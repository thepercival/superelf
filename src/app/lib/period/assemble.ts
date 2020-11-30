import { EditPeriod } from './edit';
import { ViewPeriod } from './view';

export class AssemblePeriod extends EditPeriod {
    constructor(startDateTime: Date, endDateTime: Date, viewPeriod: ViewPeriod) {
        super(startDateTime, endDateTime, viewPeriod);
    }
}