import { Association } from 'ngx-sport';

export class PoolCollection {
    protected id: number = 0;
    static readonly MIN_LENGTH_NAME = 3;
    static readonly MAX_LENGTH_NAME = 20;

    static readonly League_Default = 1;
    static readonly League_Cup = 2;
    static readonly League_SuperCup = 4;

    constructor(protected association: Association) {
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getName(): string {
        return this.getAssociation().getName();
    }

    getAssociation(): Association {
        return this.association;
    }

    getLeagueName(leagueNr?: number): string {
        if (leagueNr === PoolCollection.League_Cup) {
            return "beker";
        } else if (leagueNr === PoolCollection.League_SuperCup) {
            return "supercup";
        }
        return "competitie";
    }
}
