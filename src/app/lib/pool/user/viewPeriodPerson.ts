import { Person } from 'ngx-sport';
import { ViewPeriodPerson } from '../../period/view/person';
import { PoolUser } from '../user';

export class PoolUserViewPeriodPerson {
    protected id: number = 0;
    protected total: number = 0;
    protected points: Map<number, number> = new Map();
    protected participations: Map<number, boolean> = new Map();

    constructor(protected poolUser: PoolUser, protected viewPeriodPerson: ViewPeriodPerson) {

    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    public getViewPeriodPerson(): ViewPeriodPerson {
        return this.viewPeriodPerson;
    }

    public getPerson(): Person {
        return this.viewPeriodPerson.getPerson();
    }

    public getTotal(): number {
        return this.total;
    }

    public setTotal(total: number) {
        this.total = total;
    }

    public getPoints(): Map<number, number> {
        return this.points;
    }

    public setPoints(points: Map<number, number>) {
        this.points = points;
    }

    public getParticipations(): Map<number, boolean> {
        return this.participations;
    }

    public setParticipations(participations: Map<number, boolean>) {
        this.participations = participations;
    }
}