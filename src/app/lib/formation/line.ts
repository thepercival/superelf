import { Person } from 'ngx-sport';
import { Formation } from '../formation';

export class FormationLine {
    protected persons: Person[] = [];
    constructor(protected formation: Formation, protected number: number, protected maxNrOfPersons: number) {
        this.formation.getLines().push(this);
    }

    public getNrOfPersons(): number {
        return this.maxNrOfPersons;
    }

    public getNumber(): number {
        return this.number;
    }

    public getPersons(): Person[] {
        return this.persons;
    }
}