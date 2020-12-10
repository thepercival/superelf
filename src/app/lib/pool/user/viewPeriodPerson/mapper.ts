import { Injectable } from '@angular/core';
import { PersonMapper } from 'ngx-sport';
import { ViewPeriod } from '../../../period/view';
import { ViewPeriodPersonMapper } from '../../../period/view/person/mapper';
import { PoolUser } from '../../user';
import { PoolUserViewPeriodPerson } from '../viewPeriodPerson';
import { JsonPoolUserViewPeriodPerson } from './json';


@Injectable()
export class PoolUserViewPeriodPersonMapper {
    constructor(protected viewPeriodPersonMapper: ViewPeriodPersonMapper) { }

    toObject(json: JsonPoolUserViewPeriodPerson, poolUser: PoolUser, viewPeriod: ViewPeriod): PoolUserViewPeriodPerson {
        const poolUserViewPeriodPerson = new PoolUserViewPeriodPerson(
            poolUser,
            this.viewPeriodPersonMapper.toObject(json.viewPeriodPerson, viewPeriod));
        poolUserViewPeriodPerson.setId(json.id);
        poolUserViewPeriodPerson.setPoints(json.points);
        poolUserViewPeriodPerson.setTotal(json.total);
        poolUserViewPeriodPerson.setParticipations(json.participations);
        return poolUserViewPeriodPerson;
    }

    toJson(poolUserViewPeriodPerson: PoolUserViewPeriodPerson): JsonPoolUserViewPeriodPerson {
        return {
            id: poolUserViewPeriodPerson.getId(),
            viewPeriodPerson: this.viewPeriodPersonMapper.toJson(poolUserViewPeriodPerson.getViewPeriodPerson()),
            points: new Map(),
            total: 0,
            participations: new Map()
        };
    }
}
