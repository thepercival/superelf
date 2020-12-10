
import { Person, Player, Team } from 'ngx-sport';
import { FormationLine } from './formation/line';
import { ViewPeriod } from './period/view';
import { ViewPeriodPerson } from './period/view/person';
import { PoolUser } from './pool/user';

export class Formation {
    static readonly TotalNrOfPersons: number = 15;
    protected lines: FormationLine[] = [];
    protected id: number = 0;

    constructor(protected poolUser: PoolUser, protected viewPeriod: ViewPeriod, protected name: string) {
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

    public getViewPeriod(): ViewPeriod {
        return this.viewPeriod;
    }

    public getViewPeriodPersons(): ViewPeriodPerson[] {
        let persons: ViewPeriodPerson[] = [];
        this.lines.forEach(line => {
            persons = persons.concat(line.getViewPeriodPersons());
            const substitute = line.getSubstitute();
            if (substitute) {
                persons.push(substitute.getViewPeriodPerson());
            }

        });
        return persons;
    }

    public getViewPeriodPerson(team: Team, date?: Date): ViewPeriodPerson | undefined {
        const checkDate = date ? date : new Date();
        return this.getViewPeriodPersons().find((viewPeriodPerson: ViewPeriodPerson) => {
            return viewPeriodPerson.getPerson().getPlayer(team, checkDate);
        });
    }
}