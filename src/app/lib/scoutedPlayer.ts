import { Identifiable, Person } from 'ngx-sport';
import { S11Player } from './player';

export class ScoutedPlayer extends Identifiable {
    constructor(protected s11Player: S11Player, protected nrOfStars: number) {
        super();
    }

    public getS11Player(): S11Player {
        return this.s11Player;
    }

    public getNrOfStars(): number {
        return this.nrOfStars;
    }

    public getPerson(): Person {
        return this.s11Player.getPerson();
    }
}