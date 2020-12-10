import { JsonViewPeriodPerson } from '../../../period/view/person/json';

export interface JsonPoolUserViewPeriodPerson {
    id: number;
    viewPeriodPerson: JsonViewPeriodPerson;
    points: Map<number, number>;
    total: number;
    participations: Map<number, boolean>;
}