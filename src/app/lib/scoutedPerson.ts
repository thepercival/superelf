import { Person } from 'ngx-sport';

export class ScoutedPerson {
    protected id: number = 0;

    constructor(protected person: Person, protected nrOfStars: number) {

    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    public getPerson(): Person {
        return this.person;
    }

    public getNrOfStars(): number {
        return this.nrOfStars;
    }
}