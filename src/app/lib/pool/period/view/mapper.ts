import { Injectable } from '@angular/core';
import { PoolViewPeriod } from '../view';
import { JsonPoolViewPeriod } from './json';


@Injectable()
export class PoolViewPeriodMapper {
    constructor() { }

    toObject(json: JsonPoolViewPeriod): PoolViewPeriod {
        return new PoolViewPeriod(new Date(json.start), new Date(json.end));
    }
}


