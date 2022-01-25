import { Injectable } from '@angular/core';
import { AssemblePeriod } from '../assemble';
import { ViewPeriodMapper } from '../view/mapper';
import { JsonAssemblePeriod } from './json';

@Injectable({
    providedIn: 'root'
})
export class AssemblePeriodMapper {
    constructor(protected viewPeriodMapper: ViewPeriodMapper) { }

    toObject(json: JsonAssemblePeriod): AssemblePeriod {
        const viewPeriod = this.viewPeriodMapper.toObject(json.viewPeriod);
        return new AssemblePeriod(new Date(json.start), new Date(json.end), viewPeriod);
    }
}


