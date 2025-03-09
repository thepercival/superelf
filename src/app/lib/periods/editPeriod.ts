import { Period } from 'ngx-sport';
import { ViewPeriod } from './viewPeriod';

export class EditPeriod extends Period {
    constructor(startDateTime: Date, endDateTime: Date, protected viewPeriod: ViewPeriod) {
        super(startDateTime, endDateTime);
    }

    getViewPeriod(): ViewPeriod {
        return this.viewPeriod;
    }
}