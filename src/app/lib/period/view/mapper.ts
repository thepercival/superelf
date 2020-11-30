import { Injectable } from '@angular/core';
import { ViewPeriod } from '../view';
import { JsonViewPeriod } from './json';


@Injectable()
export class ViewPeriodMapper {
    constructor() { }

    toObject(json: JsonViewPeriod): ViewPeriod {
        return new ViewPeriod(new Date(json.start), new Date(json.end));
    }
}


