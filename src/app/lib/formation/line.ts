import { Person } from 'ngx-sport';
import { Formation } from '../formation';

export class FormationLine {
    protected persons: Person[] = [];
    protected substitute: Person | undefined;

    constructor(protected formation: Formation, protected number: number, protected maxNrOfPersons: number) {
        this.formation.getLines().push(this);
    }

    public getMaxNrOfPersons(): number {
        return this.maxNrOfPersons;
    }

    public getNumber(): number {
        return this.number;
    }

    public getPersons(): Person[] {
        return this.persons;
    }

    public getSubstitute(): Person | undefined {
        return this.substitute;
    }

    public setSubstitute(substitute: Person | undefined) {
        this.substitute = substitute;
    }
}