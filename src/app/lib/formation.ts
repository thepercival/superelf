
import { Person, Team } from 'ngx-sport';
import { FormationLine } from './formation/line';
import { PoolUser } from './pool/user';

export class Formation {
    static readonly TotalNrOfPersons: number = 15;
    protected lines: FormationLine[] = [];
    protected id: number = 0;

    constructor(protected poolUser: PoolUser, protected name: string) {
        poolUser.setAssembleFormation(this);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    public getPoolUser(): PoolUser {
        return this.poolUser;
    }

    public getName(): string {
        return this.name;
    }

    public getLines(): FormationLine[] {
        return this.lines;
    }

    public getLine(lineNumber: number): FormationLine | undefined {
        return this.lines.find(line => line.getNumber() === lineNumber);
    }

    public getPersons(): Person[] {
        let persons: Person[] = [];
        this.lines.forEach(line => persons = persons.concat(line.getAllPersons()));
        return persons;
    }

    public getPerson(team: Team, date?: Date): Person | undefined {
        const checkDate = date ? date : new Date();
        return this.getPersons().find((person: Person) => {
            const player = person.getPlayer(checkDate);
            return player && player.getTeam() === team;
        });
    }
}