
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
}