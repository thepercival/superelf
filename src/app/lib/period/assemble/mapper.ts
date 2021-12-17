import { Injectable } from '@angular/core';
import { Competition } from 'ngx-sport';
import { AssemblePeriod } from '../assemble';
import { ViewPeriodMapper } from '../view/mapper';
import { JsonAssemblePeriod } from './json';

@Injectable({
    providedIn: 'root'
})
export class AssemblePeriodMapper {
    constructor(protected viewPeriodMapper: ViewPeriodMapper) { }

    toObject(json: JsonAssemblePeriod, sourceCompetition: Competition): AssemblePeriod {
        const viewPeriod = this.viewPeriodMapper.toObject(json.viewPeriod, sourceCompetition);
        return new AssemblePeriod(new Date(json.start), new Date(json.end), viewPeriod);
    }
}


