import { EditPeriod } from './editPeriod';
import { ViewPeriod } from './viewPeriod';

export class AssemblePeriod extends EditPeriod {
    constructor(startDateTime: Date, endDateTime: Date, viewPeriod: ViewPeriod) {
        super(startDateTime, endDateTime, viewPeriod);
    }
}