import { Person } from 'ngx-sport';
import { Formation } from '../formation';
import { ViewPeriodPerson } from '../period/view/person';
import { PoolUserViewPeriodPerson } from '../pool/user/viewPeriodPerson';

export class FormationLine {
    protected viewPeriodPersons: ViewPeriodPerson[] = [];
    protected substitute: PoolUserViewPeriodPerson | undefined;

    constructor(protected formation: Formation, protected number: number, protected maxNrOfPersons: number) {
        this.formation.getLines().push(this);
    }

    public getFormation(): Formation {
        return this.formation;
    }

    public getMaxNrOfPersons(): number {
        return this.maxNrOfPersons;
    }

    public getNumber(): number {
        return this.number;
    }

    public getViewPeriodPersons(): ViewPeriodPerson[] {
        return this.viewPeriodPersons;
    }

    public getSubstitute(): PoolUserViewPeriodPerson | undefined {
        return this.substitute;
    }

    public setSubstitute(substitute: PoolUserViewPeriodPerson | undefined) {
        this.substitute = substitute;
    }

    // public getAllPersons(): Person[] {
    //     if (this.substitute) {
    //         return this.persons.concat([this.substitute]);
    //     }
    //     return this.persons;
    // }
}