import { Formation } from '../formation';
import { S11Player } from '../player';

export class FormationLine {
    protected players: S11Player[] = [];
    protected substitute: S11Player | undefined;
    protected substitutions: Map<number, boolean> = new Map();

    constructor(protected formation: Formation, protected number: number, protected maxNrOfPersons: number) {
        this.formation.getLines().push(this);
    }

    public getFormation(): Formation {
        return this.formation;
    }

    public getMaxNrOfPersons(): number {
        return this.maxNrOfPersons;
    }

    public getNumber(): number {
        return this.number;
    }

    public getPlayers(): S11Player[] {
        return this.players;
    }

    public getSubstitute(): S11Player | undefined {
        return this.substitute;
    }

    public setSubstitute(substitute: S11Player | undefined) {
        this.substitute = substitute;
    }

    public getSubstitutions(): Map<number, boolean> {
        return this.substitutions;
    }
    public setSubstitutions(substitutions: Map<number, boolean>) {
        this.substitutions = substitutions;
    }

    public getAllPlayers(): S11Player[] {
        if (this.substitute!) {
            return this.players.concat([this.substitute]);
        }
        return this.players;
    }
}