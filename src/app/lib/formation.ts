
import { FormationLine } from './formation/line';

export class Formation {
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