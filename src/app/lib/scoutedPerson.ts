import { Identifiable, Person } from 'ngx-sport';

export class ScoutedPerson extends Identifiable {
    constructor(protected person: Person, protected nrOfStars: number) {
        super();
    }

    public getPerson(): Person {
        return this.person;
    }

    public getNrOfStars(): number {
        return this.nrOfStars;
    }
}