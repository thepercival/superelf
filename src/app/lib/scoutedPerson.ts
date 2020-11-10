import { Person } from 'ngx-sport';

export class ScoutedPerson {

    constructor(protected person: Person, protected nrOfStars: number) {

    }

    public getPerson(): Person {
        return this.person;
    }

    public getNrOfStars(): number {
        return this.nrOfStars;
    }
}