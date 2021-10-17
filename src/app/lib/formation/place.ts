import { Identifiable } from 'ngx-sport';
import { S11Formation } from '../formation';
import { S11Player } from '../player';
import { S11FormationLine } from './line';

export class S11FormationPlace extends Identifiable {
    protected number: number;
    protected penaltyPoints: number = 0;

    constructor(protected formationLine: S11FormationLine, protected player: S11Player | undefined, number: number | undefined) {
        super();
        this.formationLine.getPlaces().push(this);
        if (number === undefined) {
            number = this.formationLine.getPlaces().length;
        }
        this.number = number;
    }

    public getFormationLine(): S11FormationLine {
        return this.formationLine;
    }

    public getNumber(): number {
        return this.number;
    }

    public getPenaltyPoints(): number {
        return this.penaltyPoints;
    }

    public setPenaltyPoints(penaltyPoints: number): void {
        this.penaltyPoints = penaltyPoints;
    }

    public getPlayer(): S11Player | undefined {
        return this.player;
    }

    public setPlayer(player: S11Player | undefined): void {
        this.player = player;
    }
}

