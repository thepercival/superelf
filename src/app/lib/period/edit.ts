import { Period } from 'ngx-sport';
import { ViewPeriod } from './view';

export class EditPeriod extends Period {
    constructor(startDateTime: Date, endDateTime: Date, protected viewPeriod: ViewPeriod) {
        super(startDateTime, endDateTime);
    }
}