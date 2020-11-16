
import { FormationLine } from './formation/line';

export class Formation {
    static readonly TotalNrOfPersons: number = 15;
    protected lines: FormationLine[] = [];

    constructor(protected name: string) {
    }

    public getName(): string {
        return this.name;
    }

    public getLines(): FormationLine[] {
        return this.lines;
    }
}